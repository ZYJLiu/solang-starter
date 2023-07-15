import 'solana';

@program_id("bXHdKxE4Ti8gsQUSSWvhodPpgjcQFHtdnYx2Ab1S2S2")
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
    }

    /// Simply returns the current value of our `bool`.
    function get() public view returns (bool) {
            return value;
    }
}

// Interface to the flipper program.
flipperInterface constant flipperProgram = flipperInterface(address'bXHdKxE4Ti8gsQUSSWvhodPpgjcQFHtdnYx2Ab1S2S2');
interface flipperInterface {
    function flip() external;
}

@program_id("JCEZ3WFA6jCP35ywaLZaqn8dSs1p3JQXJFqKwGJffCVZ")
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
