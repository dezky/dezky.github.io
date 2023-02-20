import { Container, DisplayObject, InteractionEvent, IPoint } from "pixi.js";
import Box from "../components/Box";
import Layer from "../components/Layer";
import type { EntityDefinition } from "./MainScene";

/**
 * Turn on to add a border to all the scene nodes
 * Useful for debugging spacing, alignment, etc.
 */
const DEBUG_MODE = false;

abstract class SceneNode extends Container {
    constructor(public data: EntityDefinition) {
        super();
    }

    get color() {
        return this.data.layout.options.color;
    }

    /**
     * Return the id of the entity represented by the node
     */
    getId() {
        return this.data.id;
    }

    /**
     * Whether the node represents an entity or a layout grouping
     */
    isRealEntity() {
        const id = this.getId();
        return Boolean(id && !id.includes("_#_"));
    }

    /**
     * Add a diplay object to a layer
     * For instance, a vpc node renders its entity children as part of the layout, but the
     * objects to be added to the layer are a text and a rectangle, so we need to add only them
     * By default we add the node itself
     */
    addToLayer(layer: Layer): void {
        layer.add(this);
    }

    removeFromLayer(layer: Layer): void {
        layer.remove(this);
    }

    /**
     * Apply a color to the node. The node decides how to apply the coloring
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    applyColor(color: number): void {}

    /**
     * Reset the applied color to the original one
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    resetColor(): void {}

    /**
     * Children were already rendereed, time to render the container around them
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    draw(children: Container[], traversalState?: any): void {}

    /**
     * Use this method instead of `addChild` to add children to the node
     */
    addContent(content: DisplayObject | DisplayObject[]): void {
        if (DEBUG_MODE) {
            content = new Box(content, {
                border: {
                    width: 1,
                    color: 0xffffff,
                },
            });
        }

        if (Array.isArray(content)) {
            this.addChild(...content);
        } else {
            this.addChild(content);
        }
    }

    /**
     * We can't use native PIXI 'click' event because it conflicts with the drag event of
     * pixi-viewport lib (ff you click and drag on an entity, it will trigger the click event as well)
     * That is why we're simulating the click event using the 'pointerdown' and 'pointerup' events and
     * checking if the pointer move between the two events
     */
    onClick(cb: () => void): void {
        this.interactive = true;
        this.buttonMode = true;
        let pointerDownCoords: IPoint | null = null;

        this.on("pointerdown", (e: InteractionEvent) => {
            // `e.stopPropagation()` can't be used because it will conflict with pixi-viewport lib behaviour
            // So, instead of stopping the propagation (bubble up), the entity will only emit an event
            // when it is the original target of the event
            if (e.currentTarget === e.target) {
                pointerDownCoords = e.data.global.clone();
            }
        });

        this.on("pointerup", (e: InteractionEvent) => {
            if (e.currentTarget === e.target) {
                if (pointerDownCoords?.equals(e.data.global)) {
                    cb();
                }
                pointerDownCoords = null;
            }
        });
    }

    setData(data: EntityDefinition) {
        this.data = data;
    }
}

export default SceneNode;
