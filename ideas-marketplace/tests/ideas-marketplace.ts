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

  const program = anchor.workspace
    .IdeasMarketplace as Program<IdeasMarketplace>;

  const payer = provider.wallet.payer;

  const getBalance = program.provider.connection.getBalance.bind(
    program.provider.connection,
  );
  const confirmTransaction = program.provider.connection.confirmTransaction
    .bind(
      program.provider.connection,
    );

  it("create idea", async () => {
    const data1 = {
      title: "test title",
      uri: "test uri",
      price: 1 * LAMPORTS_PER_SOL,
      isForSale: true,
    };
    const data2 = {
      title: "test title 2",
      uri: "test uri 2",
      price: 1 * LAMPORTS_PER_SOL,
      isForSale: true,
    };

    const creator = Keypair.generate();
    const [idea1PDA, _1] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("idea"),
        anchor.utils.bytes.utf8.encode(data1.title),
        creator.publicKey.toBuffer(),
      ],
      program.programId,
    );
    const [idea2PDA, _2] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("idea"),
        anchor.utils.bytes.utf8.encode(data2.title),
        creator.publicKey.toBuffer(),
      ],
      program.programId,
    );

    const [payerBalanceBefore, creatorBalanceBefore] = await Promise.all([
      getBalance(payer.publicKey),
      getBalance(creator.publicKey),
    ]);

    const create1_tx = await program.methods
      .createIdea(data1.title, data1.uri, new BN(data1.price), data1.isForSale)
      .accounts({
        payer: payer.publicKey,
        creator: creator.publicKey,
        idea: idea1PDA,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    await confirmTransaction(create1_tx);

    const create2_tx = await program.methods
      .createIdea(data2.title, data2.uri, new BN(data2.price), data2.isForSale)
      .accounts({
        payer: payer.publicKey,
        creator: creator.publicKey,
        idea: idea2PDA,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    await confirmTransaction(create2_tx);

    console.log("signatures: ", [create1_tx, create2_tx]);

    assert.isAtMost(await getBalance(payer.publicKey), payerBalanceBefore);
    assert.equal(await getBalance(creator.publicKey), creatorBalanceBefore);

    const res1 = await program.account.idea.fetch(idea1PDA);
    assert.equal(res1.title, data1.title);
    assert.equal(res1.uri, data1.uri);
    assert.equal(res1.price, data1.price);
    assert.equal(res1.isForSale, data1.isForSale);

    const res2 = await program.account.idea.fetch(idea2PDA);
    assert.equal(res2.title, data2.title);
    assert.equal(res2.uri, data2.uri);
    assert.equal(res2.price, data2.price);
    assert.equal(res2.isForSale, data2.isForSale);
  });

  it("buy idea", async () => {
    const data = {
      title: "test title",
      uri: "test uri",
      price: 1 * LAMPORTS_PER_SOL,
      isForSale: true,
    };

    const creator = Keypair.generate();
    const [ideaPDA, _] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("idea"),
        anchor.utils.bytes.utf8.encode(data.title),
        creator.publicKey.toBuffer(),
      ],
      program.programId,
    );
    const buyer = Keypair.generate();

    const create_tx = await program.methods
      .createIdea(data.title, data.uri, new BN(data.price), data.isForSale)
      .accounts({
        payer: payer.publicKey,
        creator: creator.publicKey,
        idea: ideaPDA,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    await confirmTransaction(create_tx);

    const [payerBalanceBefore, creatorBalanceBefore, buyerBalanceBefore] =
      await Promise.all([
        getBalance(payer.publicKey),
        getBalance(creator.publicKey),
        getBalance(buyer.publicKey),
      ]);

    const transfer_tx = await program.methods
      .buyIdea()
      .accounts({
        payer: payer.publicKey,
        seller: creator.publicKey,
        buyer: buyer.publicKey,
        idea: ideaPDA,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    await confirmTransaction(transfer_tx);

    console.log("signatures: ", [create_tx, transfer_tx]);

    assert.isAtMost(
      await getBalance(payer.publicKey),
      payerBalanceBefore - data.price,
    );
    assert.equal(
      await getBalance(creator.publicKey),
      creatorBalanceBefore + data.price,
    );
    assert.equal(await getBalance(buyer.publicKey), buyerBalanceBefore);
  });

  it("try buy idea not for sale", async () => {
    const data = {
      title: "test title",
      uri: "test uri",
      price: 1 * LAMPORTS_PER_SOL,
      isForSale: false,
    };

    const creator = Keypair.generate();
    const [ideaPDA, _] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("idea"),
        anchor.utils.bytes.utf8.encode(data.title),
        creator.publicKey.toBuffer(),
      ],
      program.programId,
    );
    const buyer = Keypair.generate();

    const create_tx = await program.methods
      .createIdea(data.title, data.uri, new BN(data.price), data.isForSale)
      .accounts({
        payer: payer.publicKey,
        creator: creator.publicKey,
        idea: ideaPDA,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    await confirmTransaction(create_tx);

    const [payerBalanceBefore, creatorBalanceBefore, buyerBalanceBefore] =
      await Promise.all([
        getBalance(payer.publicKey),
        getBalance(creator.publicKey),
        getBalance(buyer.publicKey),
      ]);

    try {
      const transfer_tx = await program.methods
        .buyIdea()
        .accounts({
          payer: payer.publicKey,
          seller: creator.publicKey,
          buyer: buyer.publicKey,
          idea: ideaPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([payer])
        .rpc();

      await confirmTransaction(transfer_tx);
    } catch (e) {
      assert.equal(e.error.errorMessage, "idea is not for sale");
    }

    console.log("signatures: ", [create_tx]);

    assert.equal(await getBalance(payer.publicKey), payerBalanceBefore);
    assert.equal(await getBalance(creator.publicKey), creatorBalanceBefore);
    assert.equal(await getBalance(buyer.publicKey), buyerBalanceBefore);
  });

  it("change idea state", async () => {
    const data = {
      title: "test title",
      uri: "test uri",
      price: 1 * LAMPORTS_PER_SOL,
      isForSale: true,
    };

    const owner = Keypair.generate();
    const [ideaPDA, _] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("idea"),
        anchor.utils.bytes.utf8.encode(data.title),
        owner.publicKey.toBuffer(),
      ],
      program.programId,
    );

    const create_tx = await program.methods
      .createIdea(data.title, data.uri, new BN(data.price), data.isForSale)
      .accounts({
        payer: payer.publicKey,
        creator: owner.publicKey,
        idea: ideaPDA,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    await confirmTransaction(create_tx);

    assert.equal(
      (await program.account.idea.fetch(ideaPDA)).isForSale,
      data.isForSale,
    );

    const set_idea_is_for_sale_tx = await program.methods
      .setIdeaIsForSale(!data.isForSale)
      .accounts({
        owner: owner.publicKey,
        idea: ideaPDA,
        systemProgram: SystemProgram.programId,
      })
      .signers([owner])
      .rpc();

    await confirmTransaction(set_idea_is_for_sale_tx);

    console.log("signatures: ", [create_tx, set_idea_is_for_sale_tx]);

    assert.equal(
      (await program.account.idea.fetch(ideaPDA)).isForSale,
      !data.isForSale,
    );
  });
});
