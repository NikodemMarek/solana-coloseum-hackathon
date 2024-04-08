import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import { Wallet } from "@solana/wallet-adapter-base";

import { IDL as IdeasMarketplace } from "../../../ideas-marketplace/target/types/ideas_marketplace.ts";
import { Idea, IdeaContent } from "./data.ts";
import { createIdeasContent, getIdeasContent } from "./firebase-api.ts";

const systemProgram = SystemProgram.programId;

const programId = new PublicKey("BFGLMCzCmCyMPc2ntisKs7toR1N9u7kexi9zDyYbE5xo");
async function findPDA(seeds: string[]): Promise<PublicKey> {
  return await PublicKey.findProgramAddress(seeds, programId);
}

function getProgram(
  connection: Connection,
  wallet: Wallet,
): Program<typeof IdeasMarketplace> {
  return new Program(IdeasMarketplace, programId, {
    connection,
  });
}

async function getIdeas(
  connection: Connection,
  wallet: Wallet,
  filter: (idea: Idea) => boolean = () => true,
): Promise<Idea[]> {
  const program = getProgram(connection, wallet);

  const acc: Idea[] = [];
  for (const it of await program.account.idea.all()) {
    try {
      const content = await getIdeasContent(it.account.uri);
      const idea = { ...it.account, content, publicKey: it.publicKey };

      if (filter(idea)) {
        acc.push(idea);
      }
    } catch (e) {
      console.error("Failed to get idea content", e);
    }
  }

  return acc;
}

async function getIdeasForSale(
  connection: Connection,
  wallet: Wallet,
): Promise<Idea[]> {
  return await getIdeas(connection, wallet, (idea) => idea.isForSale);
}

async function getNotOwnedIdeasForSale(
  connection: Connection,
  wallet: Wallet,
): Promise<Idea[]> {
  if (!wallet.publicKey) {
    throw new Error("Wallet not connected");
  }

  return await getIdeas(
    connection,
    wallet,
    (idea) => idea.isForSale && !wallet.publicKey.equals(idea.owner),
  );
}

async function getOwnedIdeas(
  connection: Connection,
  wallet: Wallet,
): Promise<Idea[]> {
  if (!wallet.publicKey) {
    throw new Error("Wallet not connected");
  }

  return await getIdeas(
    connection,
    wallet,
    (idea) => wallet.publicKey.equals(idea.owner),
  );
}

async function buyIdea(
  connection: Connection,
  wallet: Wallet,
  idea: Idea,
  buyer: PublicKey,
) {
  const program = getProgram(connection, wallet);
  console.log("buyIdea: ", [buyer, idea]);
  const buy_tx = await program.methods
    .buyIdea()
    .accounts({
      payer: buyer,
      seller: idea.owner,
      buyer: buyer,
      idea: idea.publicKey,
      systemProgram,
    })
    .transaction();

  const res = await wallet.sendTransaction(buy_tx, connection);
  console.log("Idea bought: ", [res]);
}

async function createIdea(
  connection: Connection,
  wallet: Wallet,
  title: string,
  content: IdeaContent,
  price: number,
  isForSale: boolean = true,
  creator: PublicKey,
) {
  const program = getProgram(connection, wallet);

  const [ideaPDA, _] = await findPDA([
    anchor.utils.bytes.utf8.encode("idea"),
    // ...( title.match(/.{1,32}/g) || [] ).map((c: string) => anchor.utils.bytes.utf8.encode(c)),
    // title.reduce((acc: string[], c: char) => [...acc, acc.at(-1)?.length == 32?  ]).map((c: string) => anchor.utils.bytes.utf8.encode(c)),
    // anchor.utils.bytes.utf8.encode(title),
    anchor.utils.bytes.utf8.encode(title.slice(0, 32)),
    creator.toBuffer(),
  ]);

  let uri: string;
  try {
    uri = await createIdeasContent(content);
  } catch (e) {
    console.error("Failed to create idea content", e);
    throw new Error("Failed to create idea content");
  }

  const create_tx = await program.methods
    .createIdea(title, uri, new BN(price), isForSale)
    .accounts({
      payer: creator,
      creator: creator,
      idea: ideaPDA,
      systemProgram,
    })
    .transaction();

  const res = await wallet.sendTransaction(create_tx, connection);

  console.log("Idea created: ", [res]);
}

export {
  buyIdea,
  createIdea,
  getIdeas,
  getIdeasForSale,
  getNotOwnedIdeasForSale,
  getOwnedIdeas,
};
