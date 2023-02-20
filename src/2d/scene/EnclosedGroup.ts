import { Container, Graphics, RoundedRectangle, Text } from "pixi.js";
import palette from "../../themes/palette";
import Border from "../components/Border";
import Box from "../components/Box";
import Layer from "../components/Layer";
import CompoundHitArea from "../components/CompoundHitArea";
import BorderHitArea from "../components/BorderHitArea";
import SceneNode from "./SceneNode";
import Icon from "./Icon";
import GroupLabel from "./GroupLabel";
import ColumnLayout from "./ColumnLayout";

const iconSize = 80;
const labelPadding = 16;
const borderRadius = 4;

const minWidthLayout = 336;
const minHeightLayout = 172;

export const borderWidth = 16;
export const labelHeight = iconSize + labelPadding * 2;

const buildNoResourceContent = () => {
    const noResourceContent = new Text("No Resources", {
        fontSize: 36,
        fontWeight: "500",
        fontFamily: "Red Hat Text, sans-serif",
        fontStyle: "italic",
        fill: palette.common.lightGray,
    });

    const box = new Box(noResourceContent, {
        minWidth: minWidthLayout,
        minHeight: minHeightLayout,
    });

    noResourceContent.anchor.set(0.5, 0.5);
    noResourceContent.x = minWidthLayout / 2;
    noResourceContent.y = minHeightLayout / 2;

    return box;
};

class EnclosedGroup extends SceneNode {
    private highlightContainer!: Container;
    private borderBox!: Border;
    private labelBox!: Graphics;

    addToLayer(layer: Layer) {
        layer.add(this.highlightContainer);
    }

    removeFromLayer(layer: Layer) {
        layer.remove(this.highlightContainer);
    }

    applyColor(color: number) {
        this.borderBox.tint = color;
        this.labelBox!.tint = color;
    }

    resetColor() {
        this.applyColor(this.data.layout.options.color);
    }

    draw(children: Container[], _traversalState?: any): void {
        const { title = "", name = "", _type, layout } = this.data;
        const childrenContent = this.layoutChildren(children);

        // Make the borders white so it is in a "pristine" state to change the color
        this.borderBox = new Border(
            {
                width: childrenContent.width + borderWidth * 2,
                height: childrenContent.height + borderWidth * 2,
            },
            { width: borderWidth, radius: borderRadius, color: 0xffffff },
        );
        const borderBoxWidth = this.borderBox.width;

        const icon = new Icon(_type, {
            width: iconSize,
            height: iconSize,
            color: layout.options.groupLabelIconColor,
        });

        const label = new GroupLabel(title, name, icon, layout.options.groupLabelColor, {
            maxWidth: this.borderBox.width - labelPadding * 2,
        });
        label.position.set(labelPadding, labelPadding);

        let labelBoxWidth = label.width + labelPadding * 2;
        if (borderBoxWidth - labelBoxWidth < borderWidth) {
            labelBoxWidth = borderBoxWidth;
        }

        this.labelBox = new Graphics()
            .beginFill(0xffffff)
            .drawRoundedRect(0, 0, labelBoxWidth, label.height + labelPadding * 2, 4)
            .endFill();
        this.labelBox.addChild(label);

        this.borderBox.y = this.labelBox.height - borderWidth;

        childrenContent.x = borderWidth + this.borderBox.x;
        childrenContent.y = borderWidth + this.borderBox.y;

        this.highlightContainer = new Container();
        this.highlightContainer.addChild(this.labelBox);
        this.highlightContainer.addChild(this.borderBox);

        this.hitArea = new CompoundHitArea([
            new RoundedRectangle(0, 0, this.labelBox.width, this.labelBox.height, borderRadius),
            new BorderHitArea(
                {
                    width: this.borderBox.width,
                    height: this.borderBox.height,
                    y: this.labelBox.height - borderWidth,
                },
                {
                    width: borderWidth,
                    radius: borderRadius,
                },
            ),
        ]);

        this.resetColor();
        this.addContent([this.highlightContainer, childrenContent]);
    }

    protected layoutChildren(children: Container[]): Container {
        if (children.length === 0) {
            children.push(buildNoResourceContent());
        }

        return new ColumnLayout(children, {
            spacing: 64,
            align: "center",
            style: {
                padding: 64,
                minWidth: minWidthLayout,
                minHeight: minHeightLayout,
            },
        });
    }
}

export default EnclosedGroup;
