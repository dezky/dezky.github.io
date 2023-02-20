import { Container } from "pixi.js";
import { alignVertically, type Alignment } from "../utils";
import Box, { type StyleOptions } from "./Box";

export interface RowOptions {
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

class Row extends Container {
    constructor(children: Container[], options: RowOptions = {}) {
        super();

        this.renderContent(children, options);
    }

    setChildren(children: Container[], options: RowOptions = {}) {
        this.renderContent(children, options);
    }

    private renderContent(children: Container[], options: RowOptions = {}) {
        const spacing = options.spacing ?? 0;
        const align = options.align ?? "start";
        let offset = 0;
        let height = 0;

        for (const child of children) {
            child.x = offset;
            offset += child.width + spacing;
            height = Math.max(height, child.height);
        }

        alignVertically(align, children, { height });

        if (options.style) {
            this.addChild(new Box(children, options.style));
        } else {
            children.forEach((child) => this.addChild(child));
        }
    }
}

export default Row;
