
import "solana";

@program_id("88jamb7mwRNgu4kj1as2X8gPeB4gS4uojQ9ScBizWLqW")
contract pda {
    bool private value = true;

    @payer(payer)
    @seed("flipper") // hardcoded string as seed
    constructor(@seed bytes payer, @bump bytes1 bump) {
        // Independently derive the PDA address from the seeds, bump, and programId
        (address pda, bytes1 _bump) = try_find_program_address(["flipper", payer], type(pda).program_id);

        // Verify that the bump passed to the constructor matches the bump derived from the seeds and programId
        // This ensures that only the canonical pda address can be used to create the account (first bump that generates a valid pda address)
        require(bump == _bump, 'INVALID_BUMP');

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
