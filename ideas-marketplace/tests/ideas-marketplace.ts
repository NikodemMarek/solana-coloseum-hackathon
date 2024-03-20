import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";

import { IdeasMarketplace } from "../target/types/ideas_marketplace";

describe("ideas-marketplace", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace
    .IdeasMarketplace as Program<IdeasMarketplace>;

  const payer = provider.wallet.payer;

  it("create idea", async () => {
    console.log("it started");

    const title = "My first idea";
    const description = "This is a description of my first idea";

    const creator = new Keypair();
    const [ideaPDA, _] = await PublicKey.findProgramAddress(
      [anchor.utils.bytes.utf8.encode("idea"), creator.publicKey.toBuffer()],
      program.programId,
    );

    try {
      const tx = await program.methods
        .createIdea(title, description)
        .accounts({
          creator: creator.publicKey,
          idea: ideaPDA,
          payer: payer.publicKey,
        })
        .signers([payer])
        .rpc();

      console.log("created with signature: ", tx);

      console.log(
        "something changed: ",
        await program.account.idea.fetch(ideaPDA),
      );
    } catch (e) {
      console.log("error: ", e);
    }
  });
});
