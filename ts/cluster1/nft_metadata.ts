import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  signerIdentity,
  publicKey,
  createGenericFile,
} from "@metaplex-foundation/umi";
import {
  mplTokenMetadata,
  updateMetadataAccountV2,
  findMetadataPda,
} from "@metaplex-foundation/mpl-token-metadata";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import fs from "fs";

const wallet = JSON.parse(
  fs.readFileSync("/Users/vivekinavalli/.config/solana/id.json", "utf8"),
);

const umi = createUmi("https://api.devnet.solana.com");

const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));
umi.use(mplTokenMetadata());
umi.use(
  irysUploader({
    providerUrl: "https://api.devnet.solana.com",
    timeout: 180_000,
  }),
);

(async () => {
  try {
    const mint = publicKey("2tT4ntXyQtiUPCiFgLbZ2tRz7Z7xEuGmTbX5uvSeeJHd");

    const metadataPda = findMetadataPda(umi, { mint });

    const imageUri = "wallet";

    const metadataJson = {
      name: "Batman Devnet NFT",
      symbol: "BATDEV",
      description: "Metadata updated fully from code",
      image: imageUri,
      attributes: [
        { trait_type: "Hero", value: "Batman" },
        { trait_type: "Network", value: "Devnet" },
      ],
      properties: {
        files: [{ uri: imageUri, type: "image/png" }],
      },
    };

    const metadataFile = createGenericFile(
      Buffer.from(JSON.stringify(metadataJson)),
      "metadata.json",
      { contentType: "application/json" },
    );

    const [metadataUri] = await umi.uploader.upload([metadataFile]);

    await updateMetadataAccountV2(umi, {
      metadata: metadataPda,
      updateAuthority: signer,
      data: {
        name: metadataJson.name,
        symbol: metadataJson.symbol,
        uri: metadataUri,
        sellerFeeBasisPoints: 0,
        creators: null,
        collection: null,
        uses: null,
      },
      isMutable: true,
    }).sendAndConfirm(umi);

    console.log("Metadata updated:", metadataUri);
  } catch (e) {
    console.error(e);
  }
})();
