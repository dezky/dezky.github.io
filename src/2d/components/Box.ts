import { Container, DisplayObject, Graphics, filters as pixiFilters } from "pixi.js";
import { castArray } from "../utils";
import Border, { type BorderOptions } from "./Border";
import TransparentRectangle from "./TransparentRectangle";

/**
 * Then the options are:
 * - `padding: number` - it will use the same padding for top, right, bottom and left
 * - `padding: [paddingX, paddingY]` - it will use the first value for left and right and the second value for top and bottom
 * - `padding: [paddingTop, paddingRight, paddingBottom, paddingLeft]`
 */
export type Padding = number | [number, number] | [number, number, number, number];

export interface ShadowOptions {
    strength: number;
    quality: number;
}

const defaultShadowOptions: ShadowOptions = {
    strength: 12,
    quality: 8,
};

export interface StyleOptions {
    padding?: Padding;
    border?: Omit<BorderOptions, "radius">;
    borderRadius?: number;
    background?: {
        color: number;
        alpha?: number;
    };
    shadow?: ShadowOptions | boolean;
    minWidth?: number;
    minHeight?: number;
}

export function normalizePadding(padding: Padding = 0): [number, number, number, number] {
    const paddings = castArray(padding);

    switch (paddings.length) {
        case 1:
            return [paddings[0], paddings[0], paddings[0], paddings[0]];
        case 2:
            return [paddings[0], paddings[1], paddings[0], paddings[1]];
        case 4:
        default:
            return [paddings[0], paddings[1], paddings[2], paddings[3]];
    }
}

export class Box extends Container {
    constructor(children: DisplayObject | DisplayObject[], options?: StyleOptions) {
        super();

        const content = new Container();
        castArray(children).forEach((child) => content.addChild(child));

        const { width, height, minWidth, minHeight } = this.computeDimensions(options, content);

        if (options?.shadow) {
            this.renderShadow(options, width, height);
        }

        if (this.hasPadding(options) || minWidth > content.width || minHeight > content.height || options?.background) {
            this.renderSpacingAndBackground(content, options, width, height);
        }

        if (options?.border) {
            this.renderBorder(width, height, options, content);
        }

        this.addChild(content);
    }

    private hasPadding(options?: StyleOptions) {
        const paddingSum = castArray(options?.padding ?? 0).reduce((sum, padding) => sum + padding, 0);
        return paddingSum > 0;
    }

    private renderSpacingAndBackground(
        content: Container<DisplayObject>,
        options: StyleOptions | undefined,
        width: number,
        height: number,
    ) {
        const [paddingTop, , , paddingLeft] = normalizePadding(options?.padding);

        content.x = paddingLeft;
        content.y = paddingTop;

        let paddingBox: DisplayObject;

        if (options?.background) {
            paddingBox = new Graphics()
                .beginFill(options.background.color, options.background.alpha ?? 1)
                .drawRoundedRect(0, 0, width, height, options?.borderRadius ?? 0)
                .endFill();
        } else {
            paddingBox = new TransparentRectangle(0, 0, width, height);
        }

        this.addChild(paddingBox);
    }

    private computeDimensions(options: StyleOptions | undefined, content: Container<DisplayObject>) {
        const [paddingTop, paddingRight, paddingBottom, paddingLeft] = normalizePadding(options?.padding);
        const borderWidth = options?.border?.width ?? 0;

        const minWidth = options?.minWidth ?? content.width;
        const width = Math.max(content.width, minWidth) + paddingLeft + paddingRight + borderWidth * 2;

        const minHeight = options?.minHeight ?? content.height;
        const height = Math.max(content.height, minHeight) + paddingTop + paddingBottom + borderWidth * 2;

        return { width, height, minWidth, minHeight };
    }

    /**
     * Easy way to add a shadow. It's not perfect, but it's good enough for now
     */
    private renderShadow(options: StyleOptions, width: number, height: number) {
        const shadowOptions =
            typeof options.shadow === "boolean"
                ? defaultShadowOptions
                : {
                      strength: options.shadow?.strength ?? defaultShadowOptions.strength,
                      quality: options.shadow?.quality ?? defaultShadowOptions.quality,
                  };

        const boxShadow = new Graphics()
            .beginFill(0, 0.5)
            .drawRoundedRect(0, 0, width, height, options?.borderRadius ?? 0)
            .endFill();

        boxShadow.filters = [new pixiFilters.BlurFilter(shadowOptions.strength, shadowOptions.quality)];

        this.addChild(boxShadow);
    }

    private renderBorder(width: number, height: number, options: StyleOptions, content: Container<DisplayObject>) {
        const borderWidth = options.border?.width ?? 0;
        const borderConfig = {
            ...options.border,
            width: borderWidth,
            radius: options.borderRadius,
        };
        const border = new Border({ width, height }, borderConfig);

        switch (borderConfig.target) {
            case "top":
                content.y += borderWidth;
                break;
            case "left":
                content.x += borderWidth;
                break;
            case "all":
            default:
                content.x += borderWidth;
                content.y += borderWidth;
        }
        this.addChild(border);
    }
}

export default Box;
