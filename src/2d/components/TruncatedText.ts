import { Text, TextMetrics, TextStyle, ITextStyle } from "pixi.js";

const ELLIPSIS = "...";

function truncate(
    text: string,
    style: TextStyle,
    maxWidth: number,
    options: {
        forceEllipsis?: boolean;
        textOverflow?: string;
    } = {},
) {
    const textOverflow = options?.textOverflow ?? ELLIPSIS;
    const chars = text.split("");
    const metrics = TextMetrics.measureText(`${textOverflow}\n${chars.join("\n")}`, style);
    const [ellipsisWidth, ...charWidths] = metrics.lineWidths;

    let overflow = false;
    let truncated = "";
    let currentWidth = 0;

    for (let i = 0; i < chars.length; i++) {
        currentWidth += charWidths[i];
        if (currentWidth + ellipsisWidth >= maxWidth) {
            overflow = true;
            break;
        }
        truncated += chars[i];
    }

    return `${truncated}${overflow || options?.forceEllipsis ? textOverflow : ""}`;
}

export interface TruncatedTextOptions {
    /**
     * The maximun line of text to render. If the text is longer than this value, it will be truncated
     *
     * @default 1
     */
    maxLines?: number;
    /**
     * If `true`, the text will be fill with `\n` to match the maxLines value
     * This is useful when you want to align elements or you need a fixed height
     *
     * @default false
     */
    completeLines?: boolean;
    /**
     * Character to use to truncate the text
     *
     * @default '...'
     */
    textOverflow?: string;
}

class TruncatedText extends Text {
    constructor(text: string, style: Partial<ITextStyle>, maxWidth: number, options?: TruncatedTextOptions) {
        const maxLines = options?.maxLines ?? 1;
        const textStyle = new TextStyle({
            ...style,
            ...(maxLines > 1 ? { breakWords: true, wordWrap: true, wordWrapWidth: maxWidth } : {}),
        });

        const { lines } = TextMetrics.measureText(text, textStyle);
        const lastLineIndex = Math.min(lines.length, maxLines) - 1;
        const untruncatedText = lines.length > 1 ? lines.slice(0, lastLineIndex).join("\n") : "";

        const truncatedText = truncate(lines[lastLineIndex], textStyle, maxWidth, {
            forceEllipsis: lines.length > maxLines,
            textOverflow: options?.textOverflow,
        });

        let finalText = untruncatedText.length ? `${untruncatedText}\n${truncatedText}` : truncatedText;

        if (options?.completeLines && maxLines > lines.length) {
            finalText += "\n".repeat(maxLines - lines.length);
        }

        super(finalText, style);
    }
}

export default TruncatedText;
