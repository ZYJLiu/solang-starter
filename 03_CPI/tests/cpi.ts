import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Cpi } from "../target/types/cpi";
import { Flipper } from "../target/types/flipper";

describe("cpi", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const dataAccount = anchor.web3.Keypair.generate();
  const dataAccount2 = anchor.web3.Keypair.generate();
  const wallet = provider.wallet;

  const flipperProgram = anchor.workspace.Flipper as Program<Flipper>;
  const cpiProgram = anchor.workspace.Cpi as Program<Cpi>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await flipperProgram.methods
      .new()
      .accounts({ dataAccount: dataAccount.publicKey })
      .signers([dataAccount])
      .rpc();
    console.log("Your transaction signature", tx);

    const val1 = await flipperProgram.methods
      .get()
      .accounts({ dataAccount: dataAccount.publicKey })
      .view();

    console.log("state", val1);

    await flipperProgram.methods
      .flip()
      .accounts({ dataAccount: dataAccount.publicKey })
      .rpc();

    const val2 = await flipperProgram.methods
      .get()
      .accounts({ dataAccount: dataAccount.publicKey })
      .view();

    console.log("state", val2);
  });

  it("Flip CPI", async () => {
    // Add your test here.
    const tx = await cpiProgram.methods
      .new()
      .accounts({ dataAccount: dataAccount2.publicKey })
      .signers([dataAccount2])
      .rpc();
    console.log("Your transaction signature", tx);

    await cpiProgram.methods
      .flipCpi(dataAccount.publicKey)
      .accounts({ dataAccount: dataAccount2.publicKey })
      .remainingAccounts([
        {
          pubkey: flipperProgram.programId,
          isWritable: false,
          isSigner: false,
        },
        {
          pubkey: dataAccount.publicKey,
          isWritable: true,
          isSigner: false,
        },
      ])
      .rpc();

    const val = await flipperProgram.methods
      .get()
      .accounts({ dataAccount: dataAccount.publicKey })
      .view();

    console.log("state", val);
  });
});
