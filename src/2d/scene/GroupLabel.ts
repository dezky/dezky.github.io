import { type ITextStyle, utils as pixiUtils } from "pixi.js";
import palette from "../../themes/palette";
import TruncatedText from "../components/TruncatedText";
import Row from "../components/Row";
import Column from "../components/Column";
import Icon from "./Icon";

interface GroupLabelOptions {
    maxWidth: number;
}

const commonWhite = pixiUtils.string2hex(palette.common.white);

const titleTextStyle: Partial<ITextStyle> = {
    fontSize: 22,
    fontWeight: "700",
    fill: commonWhite,
};

const descriptionTextStyle: Partial<ITextStyle> = {
    fontSize: 22,
    fontWeight: "500",
    fill: commonWhite,
} as Partial<ITextStyle>;

const iconSpace = 16;

class GroupLabel extends Row {
    constructor(title: string, description: string, icon: Icon, labelColor: number, options: GroupLabelOptions) {
        // const textWidth = options.maxWidth - padding * 2 - iconSpace - iconSize
        const textWidth = options.maxWidth - iconSpace - icon.width;
        const titleText = new TruncatedText(title.toUpperCase(), { ...titleTextStyle, fill: labelColor }, textWidth);
        const descriptionText = new TruncatedText(
            description,
            { ...descriptionTextStyle, fill: labelColor },
            textWidth,
        );

        const label = new Column([titleText, descriptionText], { spacing: 8 });

        super([icon, label], { spacing: iconSpace, align: "center" });
    }
}

export default GroupLabel;
