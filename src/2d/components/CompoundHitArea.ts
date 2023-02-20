import type { IHitArea } from "pixi.js";

class CompoundHitArea implements IHitArea {
    constructor(private hitAreas: IHitArea[]) {}

    contains(x: number, y: number): boolean {
        return this.hitAreas.some((hitArea) => hitArea.contains(x, y));
    }
}

export default CompoundHitArea;
