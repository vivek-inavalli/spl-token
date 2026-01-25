import fs from "fs";

const wallet = JSON.parse(
    fs.readFileSync(
        "wallet_path",
        "utf8"
    )
)
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { 
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args,
    findMetadataPda
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey, none } from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

// Define our Mint address
const mint = publicKey("6YonGwmWLd3fVd1uxSgDQp3oauM8cdnMHuBfjTKoR2ry")

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(signer))

const metadata = findMetadataPda(umi, { mint });


(async () => {
    try {
        // Start here
        let accounts: CreateMetadataAccountV3InstructionAccounts = { 
            metadata,
            mint,
            mintAuthority: signer,
            payer: signer,
            updateAuthority: keypair.publicKey,
        }

        let data: DataV2Args = {
            name: "VIVEK",
            symbol: "🦀",
            uri: "https://arweave.net/AbC123xyz",
            sellerFeeBasisPoints: 1000,
            creators: none(),
            collection: none(),
            uses: none()
            
        }

        let args: CreateMetadataAccountV3InstructionArgs = {
            data,
            isMutable: false,
            collectionDetails: none()
        }

         let tx = createMetadataAccountV3(
            umi,
            {
                ...accounts,
                ...args
            }
        )


        let result = await tx.sendAndConfirm(umi);
        console.log(bs58.encode(result.signature));
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
