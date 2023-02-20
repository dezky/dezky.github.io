import { RoundedRectangle, type IHitArea } from "pixi.js";

export interface BorderHitAreaConfig {
    width: number;
    radius?: number;
}

class BorderHitArea implements IHitArea {
    private outerRectangle: RoundedRectangle;
    private innerRectangle: RoundedRectangle;

    constructor(dimension: { width: number; height: number; x?: number; y?: number }, config: BorderHitAreaConfig) {
        const { width, height, x = 0, y = 0 } = dimension;
        const borderWidth = config.width;

        this.outerRectangle = new RoundedRectangle(x, y, width, height, config.radius ?? 0);
        this.innerRectangle = new RoundedRectangle(
            x + borderWidth,
            y + borderWidth,
            width - borderWidth * 2,
            height - borderWidth * 2,
            config.radius ?? 0,
        );
    }

    contains(x: number, y: number): boolean {
        return this.outerRectangle.contains(x, y) && !this.innerRectangle.contains(x, y);
    }
}

export default BorderHitArea;
