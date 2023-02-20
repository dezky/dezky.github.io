import { Container, Text, ITextStyle, utils as pixiUtils } from "pixi.js";
import { formatNumber } from "../../utils/numberUtils";
import palette from "../../themes/palette";
import Column from "../components/Column";
import Grid from "../components/Grid";
import TruncatedText from "../components/TruncatedText";
import { dimension as labeledIconDimension } from "./LabeledIcon";
import SceneNode from "./SceneNode";

const titleTextStyle: Partial<ITextStyle> = {
    fill: pixiUtils.string2hex(palette.common.white),
    fontSize: 96,
    fontWeight: "400",
    align: "center",
};

const nameTextStyle: Partial<ITextStyle> = {
    fill: pixiUtils.string2hex(palette.common.white),
    fontSize: 32,
    fontWeight: "500",
    align: "center",
};

const maxTextWidth = 336;
const defaultColumns = 12;

class GridGroup extends SceneNode {
    draw(children: Container[], _traversalState?: any): void {
        const { maxRows, columns = defaultColumns, ...options } = this.data.layout.options;

        let childrenToRender = children;
        if (maxRows && children.length > maxRows * columns) {
            childrenToRender = children.slice(0, maxRows * columns - 1);
            const showMore = this.drawShowMore(children.length - maxRows * columns);
            childrenToRender.push(showMore);
        }

        this.addContent(
            new Grid(childrenToRender, {
                spacing: 64,
                columns,
                ...options,
            }),
        );
    }

    private drawShowMore(amount: number) {
        const remainingChildrenText = new TruncatedText(formatNumber(amount), titleTextStyle, maxTextWidth);
        const showMoreText = new Text("MORE", nameTextStyle);

        const showMore = new Column([remainingChildrenText, showMoreText], {
            align: "center",
            spacing: 8,
        });

        const showMoreContainer = new Column([], {
            align: "center",
            style: {
                minWidth: labeledIconDimension.width,
                minHeight: labeledIconDimension.height,
            },
        });

        if (remainingChildrenText.width < maxTextWidth) {
            showMore.x += (maxTextWidth - remainingChildrenText.width) / 2;
        }

        return showMoreContainer;
    }
}

export default GridGroup;
