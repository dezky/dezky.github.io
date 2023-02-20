import { ResolverManifest } from "@pixi/assets";
import awsAssets from "./aws";

const manifest: ResolverManifest = {
    bundles: [
        {
            name: "aws",
            assets: awsAssets,
        },
    ],
};

export default manifest;
