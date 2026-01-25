import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
import fs from "fs";

const wallet = JSON.parse(
    fs.readFileSync(
        "wallet_path",
        "utf8"
    )
)
// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("3seuNRFgbkEwcAFLgbSuikaAUom1tr6EXY4MiK4MqyG3");

// Recipient address
const to = new PublicKey("berg7BKPHZWPiAdjpitQaWCfTELaKjQ6x7e9nDSu23d");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it

        // Get the token account of the toWallet address, and if it does not exist, create it

        // Transfer the new token to the "toTokenAccount" we just created
        const fromWallet = await getOrCreateAssociatedTokenAccount(
            connection,
             keypair, 
             mint,
             keypair.publicKey
         )

        const toWallet = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            to,
         )

        const toTokenAccount = await transfer(
            connection,
            keypair,
            fromWallet.address,
            toWallet.address,
            keypair.publicKey,
            100
        ) 
        console.log("to account", toTokenAccount);
        
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();