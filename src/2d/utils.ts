import { utils as pixiUtils } from "pixi.js";
import { memoize } from "lodash";
import palette from "../themes/palette";
import type { EntityDefinition } from "./scene/MainScene";

export function chunk<T>(arr: T[], size: number): T[][] {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        result.push(arr.slice(i, i + size));
    }
    return result;
}

export function castArray<T>(value: T | T[]): T[] {
    return Array.isArray(value) ? value : [value];
}

export type Alignment = "start" | "center" | "end";

// This function mutate the elements
export function alignHorizontally(
    align: Alignment,
    elements: { x: number; width: number }[],
    container: { width: number },
) {
    for (const element of elements) {
        switch (align) {
            case "start":
                element.x = 0;
                break;
            case "center":
                element.x = (container.width - element.width) / 2;
                break;
            case "end":
            default:
                element.x = container.width - element.width;
                break;
        }
    }
}

// This function mutate the elements
export function alignVertically(
    align: Alignment,
    elements: { y: number; height: number }[],
    container: { height: number },
) {
    for (const element of elements) {
        switch (align) {
            case "start":
                element.y = 0;
                break;
            case "center":
                element.y = (container.height - element.height) / 2;
                break;
            case "end":
            default:
                element.y = container.height - element.height;
                break;
        }
    }
}

export function getElementsOfType(el: EntityDefinition, resourceType: string): EntityDefinition[] {
    // so easy to traverse trees :)
    const result: EntityDefinition[] = [];
    _getElementsOfType(el, resourceType, result);
    return result;
}

function _getElementsOfType(el: EntityDefinition, resourceType: string, out: EntityDefinition[]) {
    if (el._type === resourceType) {
        return out.push(el); // we can finish here, as we don't have nested elements of the same type for now
    }
    el.children?.forEach((child) => {
        _getElementsOfType(child, resourceType, out);
    });
}

export const getResourceColorResolver = (
    resourceCategories: any,
    resourceCategoryColors: any,
    defaultColor: string = palette.common.white,
) => {
    return memoize((resourceType: string) => {
        let color;
        for (const category in resourceCategories) {
            const categoryResources = resourceCategories[category];
            if (categoryResources.includes(resourceType)) {
                color = resourceCategoryColors[category];
                break;
            }
        }
        return pixiUtils.string2hex(color ?? defaultColor);
    });
};

function _modifyColorChannel(colorChannel: string, modifier: number): string {
    const modified = parseInt(colorChannel ?? 0, 16) + modifier;
    const newColorChannel = Math.max(Math.min(255, modified), 0).toString(16);
    return newColorChannel.length < 2 ? "0" : "" + newColorChannel;
}

/**
 * Darken or lighten a color
 *
 * @param color hex color number
 * @param scale number between -255 (black) and 255 (white)
 * @returns darker or lighter color
 */
export function scaleColor(color: number, scale: number) {
    const colorStr = color.toString(16);
    const [r, g, b] = colorStr.match(/.{2}/g) ?? ["0", "0", "0"];

    const rr = _modifyColorChannel(r, scale);
    const gg = _modifyColorChannel(g, scale);
    const bb = _modifyColorChannel(b, scale);

    return parseInt(`${rr}${gg}${bb}`, 16);
}

/**
 * traverses the full tree of nodes in depth first order
 * */
export const dfs = (node: any, vistiFn: (node: any) => void) => {
    if (node.children && node.children.length > 0) {
        for (const child of node.children) {
            dfs(child, vistiFn);
        }
    }
    vistiFn(node);
};
