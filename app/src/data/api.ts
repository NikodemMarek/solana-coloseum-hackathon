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
): Promise<Idea[]> {
  const program = getProgram(connection, wallet);
  return (await program.account.idea.all()).reduce(
    (acc: Idea[], idea: { account: Idea; pubkey: PublicKey }) => {
      if (idea.account.isForSale) {
        acc.push(idea.account);
      }

      return acc;
    },
    [],
  );
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

export { createIdea, getIdeas };
