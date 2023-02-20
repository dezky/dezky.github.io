import { Sprite, Texture } from "pixi.js";

class TransparentRectangle extends Sprite {
    constructor(x: number, y: number, width: number, height: number) {
        super(Texture.EMPTY);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

export default TransparentRectangle;
