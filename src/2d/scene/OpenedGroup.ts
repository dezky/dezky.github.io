import { Container, Graphics, RoundedRectangle } from "pixi.js";
import Layer from "../components/Layer";
import Column from "../components/Column";
import CompoundHitArea from "../components/CompoundHitArea";
import SceneNode from "./SceneNode";
import Icon from "./Icon";
import GroupLabel from "./GroupLabel";
import ColumnLayout from "./ColumnLayout";

const iconSize = 80;
const labelPaddingX = 16;
const labelPaddingBottom = 16;
const minWidth = 336;

const borderRadius = 4;
const borderWidth = 16;
const spacing = 64;

/**
 * The parent and the children aren't nested in the same container.
 * As opposed to Group, the children are not added to the parent component.
 * @example AWS NACL component
 */
class OpenedGroup extends SceneNode {
    private highlightContainer!: Container;
    private borderBox!: Graphics;
    private icon?: Icon;

    addToLayer(layer: Layer) {
        layer.add(this.highlightContainer);
    }

    removeFromLayer(layer: Layer) {
        layer.remove(this.highlightContainer);
    }

    applyColor(color: number) {
        this.borderBox.tint = color;
        this.icon?.applyColor(color);
    }

    resetColor() {
        this.applyColor(this.data.layout.options.color);
    }

    draw(children: Container[], _traversalState?: any): void {
        const { title = "", name = "", _type, layout } = this.data;
        const childrenContent = this.layoutChildren(children);

        // Make the borders white so it is in a "pristine" state to change the color
        this.borderBox = new Graphics()
            .beginFill(0xffffff)
            .drawRoundedRect(0, 0, Math.max(minWidth, childrenContent.width), borderWidth, borderRadius)
            .endFill();

        this.icon = new Icon(_type, {
            width: iconSize,
            height: iconSize,
            color: layout.options.groupLabelIconColor,
        });

        const label = new GroupLabel(title, name, this.icon, layout.options.groupLabelColor, {
            maxWidth: this.borderBox.width - labelPaddingX * 2,
        });

        label.x = labelPaddingX;
        this.borderBox.y = label.height + labelPaddingBottom;

        this.highlightContainer = new Container();
        this.highlightContainer.addChild(label);
        this.highlightContainer.addChild(this.borderBox);

        this.hitArea = new CompoundHitArea([
            new RoundedRectangle(label.x, label.y, label.width, label.height, borderRadius),
            new RoundedRectangle(
                this.borderBox.x,
                this.borderBox.y,
                this.borderBox.width,
                this.borderBox.height,
                borderRadius,
            ),
        ]);

        this.resetColor();
        this.addContent(new Column([this.highlightContainer, childrenContent], { spacing }));
    }

    private layoutChildren(children: Container[]): Container {
        return new ColumnLayout(children, { spacing });
    }
}

export default OpenedGroup;
