import * as anchor from "@coral-xyz/anchor"
import { Program } from "@coral-xyz/anchor"
import { Pda } from "../target/types/pda"
import { PublicKey, sendAndConfirmTransaction } from "@solana/web3.js"

describe("pda", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const wallet = provider.wallet
  const connection = provider.connection

  const program = anchor.workspace.Pda as Program<Pda>

  it("Is initialized!", async () => {
    // Derive the PDA that will be used to initialize the dataAccount.
    const [dataAccountPDA, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("flipper"), wallet.publicKey.toBuffer()],
      program.programId
    )

    console.log(`PDA: ${dataAccountPDA.toBase58()}`)

    const txSig = await program.methods
      .new(
        wallet.publicKey, // payer
        [bump] // dataAccountPDA bump
      )
      .accounts({ dataAccount: dataAccountPDA })
      .rpc()
    console.log("Your transaction signature", txSig)

    const val1 = await program.methods
      .get()
      .accounts({ dataAccount: dataAccountPDA })
      .view()

    console.log("state", val1)

    await program.methods.flip().accounts({ dataAccount: dataAccountPDA }).rpc()

    const val2 = await program.methods
      .get()
      .accounts({ dataAccount: dataAccountPDA })
      .view()

    console.log("state", val2)
  })

  it("Initialize Another Data Account", async () => {
    // Generate a new keypair
    const wallet2 = anchor.web3.Keypair.generate()

    // Airdrop lamports to the new account
    const airdropTxSig = await connection.requestAirdrop(
      wallet2.publicKey,
      1_000_000_000
    )
    // Wait for airdrop confirmation
    await connection.confirmTransaction(airdropTxSig, "confirmed")

    // Derive the PDA that will be used to initialize the dataAccount.
    const [dataAccountPDA2, bump2] = PublicKey.findProgramAddressSync(
      [Buffer.from("flipper"), wallet2.publicKey.toBuffer()],
      program.programId
    )

    console.log(`PDA: ${dataAccountPDA2.toBase58()}`)

    // Build the transaction that creates a new dataAccount
    const tx = await program.methods
      .new(
        wallet2.publicKey, // payer
        [bump2] // dataAccountPDA bump
      )
      .accounts({
        dataAccount: dataAccountPDA2,
        wallet: wallet2.publicKey,
      })
      .transaction()

    // Sign and send the transaction
    const txSig = await sendAndConfirmTransaction(connection, tx, [wallet2])
    console.log("Your transaction signature", txSig)

    const val1 = await program.methods
      .get()
      .accounts({ dataAccount: dataAccountPDA2 })
      .view()

    console.log("state", val1)

    // Build the transaction to update the dataAccount
    const tx2 = await program.methods
      .flip()
      .accounts({ dataAccount: dataAccountPDA2 })
      .transaction()

    await sendAndConfirmTransaction(connection, tx2, [wallet2])

    const val2 = await program.methods
      .get()
      .accounts({ dataAccount: dataAccountPDA2 })
      .view()

    console.log("state", val2)
  })
})
