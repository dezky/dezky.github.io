import { Container, DisplayObject, Graphics, Rectangle } from "pixi.js";
import Border from "../components/Border";
import Layer from "../components/Layer";
import ColumnLayout from "./ColumnLayout";
import SceneNode from "./SceneNode";
import LabeledIcon from "./LabeledIcon";

const childrenSpacing = 64;
const borderSpacing = 64;
const contentPadding = 64;
const borderRadius = 4;
const borderWidth = 8;

/**
 * This is a combination of a Group and an LabeledIcon component.
 * It is rendered as a LabeledIcon and, if it has children, they will be rendered wrapped in a border box container.
 */
class LabeledIconGroup extends SceneNode {
    private borderBox?: Border;
    private labeledIcon!: LabeledIcon;

    addToLayer(layer: Layer) {
        layer.add(this.labeledIcon);
    }

    removeFromLayer(layer: Layer) {
        layer.remove(this.labeledIcon);
    }

    applyColor(color: number) {
        this.labeledIcon.applyColor(color);
    }

    resetColor() {
        this.labeledIcon.resetColor();
        if (this.borderBox) {
            this.borderBox.tint = this.data.layout.options.color;
        }
    }

    draw(children: SceneNode[], _traversalState?: any): void {
        this.labeledIcon = new LabeledIcon(this.data);
        this.labeledIcon.draw([]);
        const content: DisplayObject[] = [this.labeledIcon];

        if (children.length > 0) {
            const childrenContent = this.layoutChildren(children);

            this.borderBox = new Border(
                {
                    width: childrenContent.width + borderWidth * 2,
                    height: childrenContent.height + borderWidth * 2,
                },
                {
                    width: borderWidth,
                    radius: borderRadius,
                    color: 0xffffff,
                },
            );

            const borderBoxMask = new Graphics();
            borderBoxMask
                .beginFill(0)
                .drawPolygon([
                    this.labeledIcon.width / 2 + borderSpacing,
                    0,
                    this.borderBox.width,
                    0,
                    this.borderBox.width,
                    this.borderBox.height,
                    0,
                    this.borderBox.height,
                    0,
                    this.labeledIcon.height / 2 + borderSpacing,
                    this.labeledIcon.width / 2 + borderSpacing,
                    this.labeledIcon.height / 2 + borderSpacing,
                ])
                .endFill();

            this.borderBox.mask = borderBoxMask;
            this.borderBox.position.set(this.labeledIcon.width / 2, this.labeledIcon.height / 2);
            borderBoxMask.position = this.borderBox.position;

            childrenContent.x = borderWidth + this.borderBox.x;
            childrenContent.y = borderWidth + this.borderBox.y;

            content.push(borderBoxMask, borderBoxMask, this.borderBox, childrenContent);
        }

        this.addContent(content);

        this.hitArea = new Rectangle(
            this.labeledIcon.x,
            this.labeledIcon.y,
            this.labeledIcon.width,
            this.labeledIcon.height,
        );

        this.resetColor();
    }

    private layoutChildren(children: Container[]): Container {
        return new ColumnLayout(children, {
            spacing: childrenSpacing,
            style: { padding: contentPadding },
        });
    }
}

export default LabeledIconGroup;
