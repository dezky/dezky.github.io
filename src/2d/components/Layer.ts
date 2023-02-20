import { DisplayObject } from "pixi.js";
import { Layer as PixiLayer } from "@pixi/layers";
import { castArray } from "../utils";

class Layer extends PixiLayer {
    private elements: Set<DisplayObject> = new Set();

    add(elements: DisplayObject | DisplayObject[]) {
        for (const element of castArray(elements)) {
            this.elements.add(element);
            element.parentLayer = this;
        }
    }

    remove(elements: DisplayObject | DisplayObject[]) {
        for (const element of castArray(elements)) {
            this.elements.delete(element);
            delete element.parentLayer;
        }
    }

    clear() {
        this.remove(Array.from(this.elements));
    }

    has(element: DisplayObject) {
        return this.elements.has(element);
    }

    isEmpty() {
        return this.elements.size === 0;
    }
}

export default Layer;
