import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Starter } from "../target/types/starter";
import { SystemProgram } from "@solana/web3.js";

describe("starter", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const dataAccount = anchor.web3.Keypair.generate();
  const wallet = provider.wallet as anchor.Wallet;
  const connection = provider.connection;

  const program = anchor.workspace.Starter as Program<Starter>;

  it("Initialized Data Account", async () => {
    const instruction1 = await program.methods
      .new()
      .accounts({
        dataAccount: dataAccount.publicKey,
        payer: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .instruction();

    const instruction2 = await program.methods
      .flip()
      .accounts({
        dataAccount: dataAccount.publicKey,
      })
      .instruction();

    const transaction = new anchor.web3.Transaction().add(
      instruction1,
      instruction2
    );

    const txSig = await anchor.web3.sendAndConfirmTransaction(
      connection,
      transaction,
      [wallet.payer, dataAccount]
    );
    console.log("Your transaction signature", txSig);

    const val = await program.methods
      .get()
      .accounts({ dataAccount: dataAccount.publicKey })
      .view();

    console.log("state", val);
  });
});
