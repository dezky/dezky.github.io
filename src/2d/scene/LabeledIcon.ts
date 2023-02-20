import { Container, ITextStyle, utils as pixiUtils } from "pixi.js";
import palette from "../../themes/palette";
import TruncatedText from "../components/TruncatedText";
import Box from "../components/Box";
import Column from "../components/Column";
import SceneNode from "./SceneNode";
import Icon from "./Icon";

const titleTextStyle: Partial<ITextStyle> = {
    fill: pixiUtils.string2hex(palette.common.white),
    fontSize: 18,
    fontWeight: "700",
    align: "center",
};

const nameTextStyle: Partial<ITextStyle> = {
    fill: pixiUtils.string2hex(palette.common.white),
    fontSize: 18,
    fontWeight: "500",
    align: "center",
};

const iconSize = 100;
const maxWidth = 336;
const iconTextSpacing = 24;
const textSpacing = 8;

export const dimension = {
    width: maxWidth,
    height: iconSize + iconTextSpacing + textSpacing + Number(titleTextStyle.fontSize) + Number(nameTextStyle.fontSize),
};

class LabeledIcon extends SceneNode {
    private icon!: Icon;

    applyColor(color: number) {
        this.icon.applyColor(color);
    }

    resetColor() {
        this.icon.resetColor();
    }

    draw(_children: Container[], _traversalState?: any): void {
        this.icon = new Icon(this.data._type, {
            width: iconSize,
            height: iconSize,
            color: this.data.layout.options.color,
        });

        const title = new TruncatedText((this.data.title ?? this.data._type).toUpperCase(), titleTextStyle, maxWidth);
        const nameText = new TruncatedText(this.data.name ?? "", nameTextStyle, maxWidth);

        const label = new Column([title, nameText], {
            spacing: textSpacing,
            align: "center",
        });
        const content = new Column([this.icon, label], {
            spacing: iconTextSpacing,
            align: "center",
        });
        const box = new Box(content, {
            minWidth: maxWidth,
        });

        if (content.width < maxWidth) {
            content.x += (maxWidth - content.width) / 2;
        }

        this.addContent(box);
    }
}

export default LabeledIcon;
