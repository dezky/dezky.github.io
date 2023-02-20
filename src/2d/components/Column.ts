import { Container } from "pixi.js";
import { alignHorizontally, type Alignment } from "../utils";
import Box, { type StyleOptions } from "./Box";

export interface ColumnOptions {
    /**
     * The spacing between elements
     * @default 0
     */
    spacing?: number;
    /**
     * Align items to the start, center or end of the container
     * @default 'start'
     */
    align?: Alignment;
    /**
     * Box syles options (padding, border, background)
     */
    style?: StyleOptions;
}

class Column extends Container {
    constructor(children: Container[], options: ColumnOptions = {}) {
        super();

        const spacing = options.spacing ?? 0;
        const align = options.align ?? "start";
        let offset = 0;
        let width = 0;

        for (const child of children) {
            child.y = offset;
            offset += child.height + spacing;
            width = Math.max(width, child.width);
        }

        alignHorizontally(align, children, { width });

        if (options.style) {
            this.addChild(new Box(children, options.style));
        } else {
            children.forEach((child) => this.addChild(child));
        }
    }
}

export default Column;
