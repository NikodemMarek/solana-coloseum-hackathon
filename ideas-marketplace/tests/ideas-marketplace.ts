import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
import { MPL_TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAccount,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

import { IdeasMarketplace } from "../target/types/ideas_marketplace";

describe("ideas-marketplace", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.IdeasMarketplace as Program<
    IdeasMarketplace
  >;

  it("create idea", async () => {
    console.log("it started");

    const mintToken = new Keypair();
    const tokenAccount = anchor.utils.token.associatedAddress({
      mint: mintToken.publicKey,
      owner: provider.publicKey,
    });

    // const [metadataAddress] = PublicKey.findProgramAddressSync(
    //   [
    //     Buffer.from("metadata"),
    //     Buffer.from(MPL_TOKEN_METADATA_PROGRAM_ID),
    //     mintToken.publicKey.toBuffer(),
    //   ],
    //   MPL_TOKEN_METADATA_PROGRAM_ID,
    // );

    const tx = await program.methods
      .createIdea(new BN(0.5 * LAMPORTS_PER_SOL))
      .accounts({
        // payer: payer.publicKey,
        mintToken: mintToken.publicKey,
        tokenAccount,
        associateTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        // metadataAccount: metadataAddress,
        // tokenProgram: TOKEN_PROGRAM_ID,
        // tokenMetadataProgram: MPL_TOKEN_METADATA_PROGRAM_ID,
        // systemProgram: SystemProgram.programId,
        // rent: SYSVAR_RENT_PUBKEY,
      })
      .signers([mintToken])
      .rpc();
    console.log("created with signature: ", tx);
  });
});
