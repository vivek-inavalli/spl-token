import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import fs from "fs";

const wallet = JSON.parse(fs.readFileSync("wallet", "utf8"));
// Create a devnet connection
const umi = createUmi("https://api.devnet.solana.com");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(
  irysUploader({
    providerUrl: "https://api.devnet.solana.com",
    timeout: 180_000, // 60s, prevents infinite hang
  }),
);
umi.use(signerIdentity(signer));

(async () => {
  try {
    //1. Load image
    //2. Convert image to generic file.
    //3. Upload image
    const image = "https://pngimg.com/uploads/batman/batman_PNG111.png";

    const response = await fetch(image);

    const buffer = Buffer.from(await response.arrayBuffer());

    const genericFile = createGenericFile(buffer, "batman.png", {
      contentType: "image/png",
    });

    // 4. Upload to Irys
    const [imageUri] = await umi.uploader.upload([genericFile]);

    console.log("Your image URI: ", imageUri);
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
