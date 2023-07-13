import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Starter } from "../target/types/starter";

describe("starter", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const dataAccount = anchor.web3.Keypair.generate();
  const wallet = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.Starter as Program<Starter>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods
      .new(wallet.publicKey)
      .accounts({ dataAccount: dataAccount.publicKey })
      .signers([dataAccount])
      .rpc();
    console.log("Your transaction signature", tx);

    const val1 = await program.methods
      .get()
      .accounts({ dataAccount: dataAccount.publicKey })
      .view();

    console.log("state", val1);

    await program.methods
      .flip()
      .accounts({ dataAccount: dataAccount.publicKey })
      .rpc();

    const val2 = await program.methods
      .get()
      .accounts({ dataAccount: dataAccount.publicKey })
      .view();

    console.log("state", val2);
  });

  it("Initialized Another Data Account", async () => {
    const connection = provider.connection;
    const dataAccount2 = anchor.web3.Keypair.generate();

    const instruction = await program.methods
      .new(wallet.publicKey)
      .accounts({
        dataAccount: dataAccount2.publicKey,
        wallet: wallet.publicKey,
      })
      .instruction();

    const instruction2 = await program.methods
      .flip()
      .accounts({
        dataAccount: dataAccount2.publicKey,
      })
      .instruction();

    const transaction = new anchor.web3.Transaction().add(
      instruction,
      instruction2
    );

    const txSig = await anchor.web3.sendAndConfirmTransaction(
      connection,
      transaction,
      [wallet.payer, dataAccount2]
    );
    console.log("Your transaction signature", txSig);

    const val = await program.methods
      .get()
      .accounts({ dataAccount: dataAccount2.publicKey })
      .view();

    console.log("state", val);
  });
});
