import { Sprite, Texture } from "pixi.js";
import { LoadAsset, Assets } from "@pixi/assets";

// This is the same icon in ../default_icon.svg but enconded
// The intention of this is to avoid loading the svg file and ensure it will be always available
const encondedDefaultIcon =
    "data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M50 97C49.6498 96.9963 49.3066 96.9003 49.0053 96.7217L9.99467 74.2225C9.6911 74.0474 9.43922 73.7951 9.26455 73.4915C9.08988 73.1878 8.99862 72.8435 9.00002 72.4933V27.4948C8.99862 27.1446 9.08988 26.8001 9.26455 26.4965C9.43922 26.1928 9.6911 25.9407 9.99467 25.7656L49.0053 3.26628C49.3078 3.09184 49.6509 3 50 3C50.3492 3 50.6923 3.09184 50.9946 3.26628L90.0053 25.7656C90.309 25.9407 90.5608 26.1928 90.7355 26.4965C90.9102 26.8001 91.0014 27.1446 91 27.4948V72.4933C91.0014 72.8435 90.9102 73.1878 90.7355 73.4915C90.5608 73.7951 90.309 74.0474 90.0053 74.2225L50.9946 96.7217C50.6935 96.9003 50.3503 96.9963 50 97ZM48.0107 91.5597V52.0818L12.9787 31.8415V71.3604L48.0107 91.5597ZM51.9893 91.5598L87.0213 71.3604V31.9332L51.9893 52.0843V91.5598ZM50 48.6415L85.9123 27.9882L50 7.28117L14.1691 27.9413L50 48.6415Z' fill='white'/%3E%3C/svg%3E";

interface IconOptions {
    width: number;
    height: number;
    color?: number;
}

class Icon extends Sprite {
    constructor(url: string | LoadAsset<any>, private options: IconOptions) {
        super(Texture.from(encondedDefaultIcon));

        this.options = {
            ...options,
            color: options.color ?? 0x000000,
        };
        this.width = options.width;
        this.height = options.height;

        this.resetColor();

        Assets.load(url).then((texture) => {
            if (texture) {
                this.texture = texture;
            }
        });
    }

    applyColor(color: number) {
        this.tint = color;
    }

    resetColor() {
        this.tint = this.options.color!;
    }
}

export default Icon;
