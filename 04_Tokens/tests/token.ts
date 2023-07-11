import * as anchor from "@coral-xyz/anchor"
import { Program } from "@coral-xyz/anchor"
import { Token } from "../target/types/token"

describe("token", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const dataAccount = anchor.web3.Keypair.generate()
  const wallet = provider.wallet

  const program = anchor.workspace.Token as Program<Token>

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods
      .new(wallet.publicKey)
      .accounts({ dataAccount: dataAccount.publicKey })
      .signers([dataAccount])
      .rpc()
    console.log("Your transaction signature", tx)
  })

  it("Create an SPL Token!", async () => {
    // Generate a new keypair for the mint
    const mintKeypair = anchor.web3.Keypair.generate()

    const tx = await program.methods
      .createTokenMint(
        wallet.publicKey, // payer
        mintKeypair.publicKey, // mint
        wallet.publicKey, // freeze authority
        wallet.publicKey, // mint authority
        9 // decimals
      )
      .accounts({ dataAccount: dataAccount.publicKey })
      .remainingAccounts([
        {
          pubkey: wallet.publicKey,
          isWritable: true,
          isSigner: true,
        },
        { pubkey: mintKeypair.publicKey, isWritable: true, isSigner: true },
      ])
      .signers([mintKeypair])
      .rpc({ skipPreflight: true })
    console.log("Your transaction signature", tx)
  })
})
