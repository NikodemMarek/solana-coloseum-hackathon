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
import { Idea } from "./data.ts";

const systemProgram = SystemProgram.programId;

const programId = new PublicKey("5KoS5ttQJhFNhy9DsMu5Wdz6qZPjBJmVHRKcLb8tggEJ");
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
  return (await program.account.idea.all()).reduce(
    (acc: Idea[], it: { account: Idea; publicKey: PublicKey }) => {
      const idea = { ...it.account, publicKey: it.publicKey };
      if (filter(idea)) {
        acc.push(idea);
      }
      return acc;
    },
    [],
  );
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
  description: string,
  price: number,
  isForSale: boolean = true,
  creator: PublicKey,
) {
  const program = getProgram(connection, wallet);

  const [ideaPDA, _] = await findPDA([
    anchor.utils.bytes.utf8.encode("idea"),
    anchor.utils.bytes.utf8.encode(title),
    creator.toBuffer(),
  ]);

  const create_tx = await program.methods
    .createIdea(title, description, new BN(price), isForSale)
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
