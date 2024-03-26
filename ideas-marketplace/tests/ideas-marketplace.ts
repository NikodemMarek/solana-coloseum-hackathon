import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

import { IdeasMarketplace } from "../target/types/ideas_marketplace";

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

describe("ideas-marketplace", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace
    .IdeasMarketplace as Program<IdeasMarketplace>;

  const payer = provider.wallet.payer;

  it("create idea", async () => {
    console.log("it started");

    const owner = Keypair.generate();
    const [mintPDA, _m] = await PublicKey.findProgramAddress(
      [anchor.utils.bytes.utf8.encode("mint"), owner.publicKey.toBuffer()],
      program.programId
    );
    const ideaPDA = anchor.utils.token.associatedAddress({
      mint: mintPDA,
      owner: owner.publicKey,
    });

    console.log("owner: ", owner.publicKey.toBase58());
    try {
      const tx = await program.methods
        .createIdea()
        .accounts({
          payer: payer.publicKey,
          owner: owner.publicKey,
          mint: mintPDA,
          idea: ideaPDA,
          tokenProgram: TOKEN_PROGRAM_ID,
          associateTokenProgram: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([payer, owner])
        .rpc();

      await program.provider.connection.confirmTransaction(tx);

      console.log("created with signature: ", tx);

      // const accounts = await program.connection.getParsedProgramAccounts(
      //   program.programId,
      // );
      console.log("accounts: ", accounts);
    } catch (e) {
      console.log("error: ", e);
    }
  });

  it("create idea nft", async () => {
    console.log("it started");

    const owner = payer; // Keypair.generate();
    const mint = Keypair.generate();
    const [mintPDA, _m] = await PublicKey.findProgramAddress(
      [anchor.utils.bytes.utf8.encode("mint"), owner.publicKey.toBuffer()],
      program.programId
    );
    const ideaPDA = anchor.utils.token.associatedAddress({
      mint: mint.publicKey,
      owner: owner.publicKey,
    });

    console.log("owner: ", owner.publicKey.toBase58());
    try {
      console.log("ideaPDA ", ideaPDA);
      const tx = await program.methods
        .create()
        .accounts({
          payer: payer.publicKey,
          owner: owner.publicKey,
          mint: mintPDA,
          idea: ideaPDA,
          sysvarInstructions: SYSVAR_RENT_PUBKEY,
          tokenProgram: TOKEN_PROGRAM_ID,
          associateTokenProgram: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
          tokenMetadataProgram: new PublicKey(
            "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
          ),
          systemProgram: SystemProgram.programId,
        })
        .signers([payer, owner])
        .rpc();

      await program.provider.connection.confirmTransaction(tx);

      console.log("created with signature: ", tx);

      const accounts = await program.connection.getParsedProgramAccounts(
        program.programId
      );
      console.log("accounts: ", accounts);
    } catch (e) {
      console.log("error: ", e);
    }
  });
});
