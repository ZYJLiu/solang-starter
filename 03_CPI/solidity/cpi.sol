import 'solana';

@program_id("GyWjf3mHhKi5Qbr57crXzannY9JDrF3x5U4FSx8z8urh")
contract flipper {
    bool private value = true;

    @payer(payer)
    constructor() {
        print("Hello, World!");
    }

    /// A message that can be called on instantiated contracts.
    /// This one flips the value of the stored `bool` from `true`
    /// to `false` and vice versa.
    function flip() public {
            value = !value;
            print("Flip!");
    }

    /// Simply returns the current value of our `bool`.
    function get() public view returns (bool) {
            return value;
    }
}

// Interface to the flipper program.
flipperInterface constant flipperProgram = flipperInterface(address'GyWjf3mHhKi5Qbr57crXzannY9JDrF3x5U4FSx8z8urh');
interface flipperInterface {
    function flip() external;
}

@program_id("6BLnqBHgaShKoMMZRKxoPfG4oBrUQD7gbAgikZbpo7Nx")
contract cpi {

    @payer(payer)
    constructor() {}

    function flipCpi(address dataAccount) public {
        AccountMeta[1] metas = [
            AccountMeta({pubkey: dataAccount, is_writable: true, is_signer: false})
        ];

        flipperProgram.flip{accounts: metas}();
    }
}
