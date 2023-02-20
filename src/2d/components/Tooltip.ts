import { Container, DisplayObject, InteractionEvent, ITextStyle, Text } from "pixi.js";
import Box, { type StyleOptions } from "./Box";

export enum TooltipPlacement {
    TOP_LEFT = "top-left",
    TOP_CENTER = "top-center",
    TOP_RIGHT = "top-right",
    LEFT = "left",
    CENTER = "center",
    RIGHT = "right",
    BOTTOM_LEFT = "bottom-start",
    BOTTOM_CENTER = "bottom-center",
    BOTTOM_RIGHT = "bottom-end",
}

export enum TooltipPositionTarget {
    POINTER = "pointer",
    TARGET = "target",
}

export interface TooltipOptions {
    /**
     * Tooltip placement
     * @default "bottom-center"
     */
    placement?: TooltipPlacement;
    /**
     * Where the tooltip should be positioned based on the pointer or the target
     * @default "target"
     */
    positionTarget?: TooltipPositionTarget;
    /**
     * Tooltip container style options (padding, border, background). Same as Box component
     */
    style?: StyleOptions;
    /**
     * Left offset between the tooltip and the pointer or the target
     * @default 0
     */
    offsetLeft?: number;
    /**
     * Top offset between the tooltip and the pointer or the target
     * @default 0
     */
    offsetTop?: number;
    /**
     * This property will be used if a string is passed to the content property
     */
    textStyle?: Partial<ITextStyle>;
    /**
     * Prevents event from reaching parent objects of target
     * @default true
     */
    stopPropagation?: boolean;
    /**
     * Delay in milliseconds before the tooltip is shown.
     * It won't be shown if the pointer leaves the target before the delay is over
     * @default 0
     */
    delay?: number;
    /**
     * Function to be invoked when the tooltip is shown
     */
    onShow?: (tooltip: Tooltip) => void;
    /**
     * Function to be invoked when the tooltip is hidden
     */
    onHide?: (tooltip: Tooltip) => void;
    /**
     * Function that get the current app/target scale.
     * It is useful when the tooltip is shown on a scaled container like a zoomable container (pixi-viewport)
     */
    getCurrentScale?: () => { x: number; y: number };
}

class Tooltip extends Box {
    private target: Container;
    private options: TooltipOptions;
    private timeout?: number;

    constructor(target: Container, content: string | DisplayObject, options?: TooltipOptions) {
        super(typeof content === "string" ? new Text(content, options?.textStyle) : content, options?.style);

        this.visible = false;
        this.target = target;
        this.options = {
            offsetLeft: 0,
            offsetTop: 0,
            stopPropagation: true,
            delay: 0,
            placement: TooltipPlacement.BOTTOM_CENTER,
            positionTarget: TooltipPositionTarget.TARGET,
            ...options,
        };

        this.initializeHover();
    }

    show(e: InteractionEvent) {
        if (this.options.stopPropagation) {
            e.stopPropagation();
        }

        this.timeout = window.setTimeout(() => {
            if (this.options.getCurrentScale) {
                // In order to keep the tooltip of the same size in spite of the current scale,
                // we need to apply an inverse scale to it
                const currentScale = this.options.getCurrentScale();
                this.scale.set(1 / currentScale.x, 1 / currentScale.y);
            }

            this.visible = true;
            this.setPosition(e);
            this.target.addChild(this);

            if (this.options.onShow) {
                this.options.onShow(this);
            }
        }, this.options.delay ?? 0);
    }

    hide() {
        window.clearTimeout(this.timeout);

        if (!this.visible) {
            return;
        }

        this.visible = false;
        this.target.removeChild(this);

        if (this.options.onHide) {
            this.options.onHide(this);
        }
    }

    private initializeHover() {
        this.target.interactive = true;
        this.target.on("pointerover", this.show.bind(this));
        this.target.on("pointerout", this.hide.bind(this));
    }

    private setPosition(e: InteractionEvent) {
        if (this.options.positionTarget === TooltipPositionTarget.TARGET) {
            this.setPositionOnTarget();
        } else {
            this.setPositionOnPointer(e);
        }
    }

    private setPositionOnPointer(e: InteractionEvent) {
        const position = e.data.getLocalPosition(this.target);

        switch (this.options.placement) {
            case TooltipPlacement.TOP_LEFT:
                this.x = position.x - this.width;
                this.y = position.y - this.height;
                break;
            case TooltipPlacement.TOP_CENTER:
                this.x = position.x - this.width / 2;
                this.y = position.y - this.height;
                break;
            case TooltipPlacement.TOP_RIGHT:
                this.x = position.x;
                this.y = position.y - this.height;
                break;
            case TooltipPlacement.LEFT:
                this.x = position.x - this.width;
                this.y = position.y - this.height / 2;
                break;
            case TooltipPlacement.CENTER:
                this.x = position.x - this.width / 2;
                this.y = position.y - this.height / 2;
                break;
            case TooltipPlacement.RIGHT:
                this.x = position.x;
                this.y = position.y - this.height / 2;
                break;
            case TooltipPlacement.BOTTOM_LEFT:
                this.x = position.x - this.width;
                this.y = position.y;
                break;
            case TooltipPlacement.BOTTOM_CENTER:
                this.x = position.x - this.width / 2;
                this.y = position.y;
                break;
            case TooltipPlacement.BOTTOM_RIGHT:
            default:
                this.x = position.x;
                this.y = position.y;
        }

        this.x += this.options.offsetLeft!;
        this.y += this.options.offsetTop!;
    }

    private setPositionOnTarget() {
        switch (this.options.placement) {
            case TooltipPlacement.TOP_LEFT:
                this.x = 0;
                this.y = -this.height;
                break;
            case TooltipPlacement.TOP_CENTER:
                this.x = this.target.width / 2 - this.width / 2;
                this.y = -this.height;
                break;
            case TooltipPlacement.TOP_RIGHT:
                this.x = this.target.width - this.width;
                this.y = -this.height;
                break;
            case TooltipPlacement.LEFT:
                this.x = -this.width;
                this.y = this.target.height / 2 - this.height / 2;
                break;
            case TooltipPlacement.CENTER:
                this.x = this.target.width / 2 - this.width / 2;
                this.y = this.target.height / 2 - this.height / 2;
                break;
            case TooltipPlacement.RIGHT:
                this.x = this.target.width;
                this.y = this.target.height / 2 - this.height / 2;
                break;
            case TooltipPlacement.BOTTOM_LEFT:
                this.x = 0;
                this.y = this.target.height;
                break;
            case TooltipPlacement.BOTTOM_CENTER:
                this.x = this.target.width / 2 - this.width / 2;
                this.y = this.target.height;
                break;
            case TooltipPlacement.BOTTOM_RIGHT:
            default:
                this.x = this.target.width - this.width;
                this.y = this.target.height;
        }

        this.x += this.options.offsetLeft!;
        this.y += this.options.offsetTop!;
    }
}

export default Tooltip;
