import { Container } from "pixi.js";
import { alignHorizontally, type Alignment } from "../utils";
import Box, { normalizePadding, type StyleOptions } from "../components/Box";
import { labelHeight, borderWidth as clusterNodeBorderWidth } from "./EnclosedGroup";

export interface ColumnLayoutOptions {
    /**
     * The spacing between rows and columns. If a number is specified, it will use the same spacing for rows and columns
     */
    spacing?: number;
    /**
     * Align items to the start, center or end of the container
     */
    align?: Alignment;
    /**
     * Box syles options (padding, border, background)
     */
    style?: StyleOptions;
}

class ColumnLayout extends Container {
    constructor(children: Container[], options: ColumnLayoutOptions = {}) {
        super();

        const content = new Container();
        const spacing = options.spacing ?? 0;
        const align = options.align ?? "start";

        let offset = 0;
        let clustersToBeRendered = 0;

        for (const child of children) {
            child.y = offset;
            offset += child.height + spacing;

            if ((child as any).data?.layout?.type === "clusterNode") {
                const borderWidth = clustersToBeRendered > 0 ? clusterNodeBorderWidth : 0;
                child.y += labelHeight + borderWidth;
                offset += labelHeight + borderWidth;
                clustersToBeRendered++;
            }

            content.addChild(child);
        }

        alignHorizontally(align, children, content);

        if (clustersToBeRendered > 0) {
            const padding = normalizePadding(options.style?.padding);
            padding[2] += clusterNodeBorderWidth;

            let minHeight;
            const contentBounds = content.getBounds();

            // when the content position in the container isn't y=0
            if (contentBounds.y > 0) {
                minHeight = contentBounds.y + contentBounds.height;
            }

            this.addChild(new Box(content, { ...options.style, padding, minHeight }));
        } else {
            this.addChild(options.style ? new Box(content, options.style) : content);
        }
    }
}

export default ColumnLayout;
