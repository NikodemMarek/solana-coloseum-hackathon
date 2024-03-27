import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import { assert } from "chai";

import { IdeasMarketplace } from "../target/types/ideas_marketplace";

describe("ideas-marketplace", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const connection = provider.connection;

  const program = anchor.workspace
    .IdeasMarketplace as Program<IdeasMarketplace>;

  const payer = provider.wallet.payer;

  const getBalance = program.provider.connection.getBalance.bind(
    program.provider.connection
  );
  const confirmTransaction =
    program.provider.connection.confirmTransaction.bind(
      program.provider.connection
    );

  it("create idea", async () => {
    const data = {
      title: "test title",
      description: "test description",
      price: 1 * LAMPORTS_PER_SOL,
    };

    const creator = Keypair.generate();
    const [ideaPDA, _] = await PublicKey.findProgramAddress(
      [anchor.utils.bytes.utf8.encode("idea"), creator.publicKey.toBuffer()],
      program.programId
    );

    const [payerBalanceBefore, creatorBalanceBefore] = await Promise.all([
      getBalance(payer.publicKey),
      getBalance(creator.publicKey),
    ]);

    const create_tx = await program.methods
      .createIdea(data.title, data.description, new BN(data.price))
      .accounts({
        payer: payer.publicKey,
        creator: creator.publicKey,
        idea: ideaPDA,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    await confirmTransaction(create_tx);

    console.log("signatures: ", [create_tx]);

    assert.isAtMost(await getBalance(payer.publicKey), payerBalanceBefore);
    assert.equal(await getBalance(creator.publicKey), creatorBalanceBefore);

    const res = await program.account.idea.fetch(ideaPDA);
    assert.equal(res.title, data.title);
    assert.equal(res.description, data.description);
    assert.equal(res.price, data.price);
  });

  it("transfer idea", async () => {
    const data = {
      title: "test title",
      description: "test description",
      price: 1 * LAMPORTS_PER_SOL,
    };

    const creator = Keypair.generate();
    const [ideaPDA, _] = await PublicKey.findProgramAddress(
      [anchor.utils.bytes.utf8.encode("idea"), creator.publicKey.toBuffer()],
      program.programId
    );
    const newOwner = Keypair.generate();

    const create_tx = await program.methods
      .createIdea(data.title, data.description, new BN(data.price))
      .accounts({
        payer: payer.publicKey,
        creator: creator.publicKey,
        idea: ideaPDA,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    await confirmTransaction(create_tx);

    const [payerBalanceBefore, creatorBalanceBefore, newOwnerBalanceBefore] =
      await Promise.all([
        getBalance(payer.publicKey),
        getBalance(creator.publicKey),
        getBalance(newOwner.publicKey),
      ]);

    const transfer_tx = await program.methods
      .transferIdea()
      .accounts({
        payer: payer.publicKey,
        oldOwner: creator.publicKey,
        newOwner: newOwner.publicKey,
        idea: ideaPDA,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer, creator])
      .rpc();

    await confirmTransaction(transfer_tx);

    console.log("signatures: ", [create_tx, transfer_tx]);

    assert.isAtMost(
      await getBalance(payer.publicKey),
      payerBalanceBefore - data.price
    );
    assert.equal(
      await getBalance(creator.publicKey),
      creatorBalanceBefore + data.price
    );
    assert.equal(await getBalance(newOwner.publicKey), newOwnerBalanceBefore);
  });
});
