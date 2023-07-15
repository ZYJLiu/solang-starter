import "./spl_token.sol";

@program_id("F1ipperKF9EfD821ZbbYjS319LXYiBmjhzkkf5a26rC")
contract token {

    @payer(payer)
    constructor() {}

    function createTokenMint(
        address payer, // payer account
        address mint, // mint account to be created
        address mintAuthority, // mint authority for the mint account
        address freezeAuthority, // freeze authority for the mint account
        uint8 decimals // decimals for the mint account
    ) public {
        // Invoke System Program to create a new account for the mint account and,
        // Invoke Token Program to initialize the mint account
        // Set mint authority, freeze authority, and decimals for the mint account
        SplToken.create_mint(
            payer,            // payer account
            mint,            // mint account
            mintAuthority,   // mint authority
            freezeAuthority, // freeze authority
            decimals         // decimals
        );
    }

    function mintTokens(
        address payer, // payer account
        address mint, // mint account, (what kind of token to mint)
        address tokenAccount, // the account tokens are minted to
        uint64 amount // amount of tokens to mint
    ) public {
        // Mint tokens to the token account
        SplToken.mint_to(
            mint, // mint account
            tokenAccount, // token account
            payer, // mint authority
            amount // amount
        );
    }

}
