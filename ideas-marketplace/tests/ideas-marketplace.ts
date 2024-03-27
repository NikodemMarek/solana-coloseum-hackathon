import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
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

    const owner = Keypair.generate();
    const [ideaPDA, _] = await PublicKey.findProgramAddress(
      [anchor.utils.bytes.utf8.encode("idea"), owner.publicKey.toBuffer()],
      program.programId,
    );

    const tx = await program.methods
      .createIdea(
        "test title",
        "test description",
        new BN(1 * LAMPORTS_PER_SOL),
      )
      .accounts({
        payer: payer.publicKey,
        owner: owner.publicKey,
        idea: ideaPDA,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    await program.provider.connection.confirmTransaction(tx);

    console.log("created with signature: ", tx);
    console.log("data: ", await program.account.idea.fetch(ideaPDA));
  });
});
