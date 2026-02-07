import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  signerIdentity,
  generateSigner,
  percentAmount,
} from "@metaplex-foundation/umi";
import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";

import base58 from "bs58";
import fs from "fs";

const wallet = JSON.parse(fs.readFileSync("wallet", "utf8"));

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata());

const mint = generateSigner(umi);

(async () => {
  // let tx = ???
  // let result = await tx.sendAndConfirm(umi);
  // const signature = base58.encode(result.signature);

  // console.log(`Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`)

  const metadataUri = "https://arweave.net/PASTE_YOURS_HERE";

  const tx = await createNft(umi, {
    mint,
    name: "Batman Devnet NFT",
    symbol: "BATDEV",
    uri: metadataUri,
    sellerFeeBasisPoints: percentAmount(0),
    isMutable: true,
  });

  const result = await tx.sendAndConfirm(umi);
  const signature = base58.encode(result.signature);

  console.log(`✅ Successfully Minted!\n`);
  console.log("🪙 Mint Address:", mint.publicKey.toString());

  console.log("Mint Address: ", mint.publicKey);
})();
