import { Container, Sprite, Texture } from "pixi.js";

export const buildTestContainers = (
    input: {
        width: number;
        height: number;
        children?: any[];
    }[],
): Container[] => {
    return input.map((i) => {
        const placeholder = Sprite.from(Texture.EMPTY);
        placeholder.width = i.width;
        placeholder.height = i.height;
        if (i.children?.length) {
            placeholder.addChild(...buildTestContainers(i.children));
        }
        return placeholder as any;
    });
};

export const testLayout = (input: Container, expectLayout: any) => {
    const cleanTree = (n: Container) => {
        const node = {
            x: n.x,
            y: n.y,
            width: n.width,
            height: n.height,
        };

        if (n.children?.length) {
            (node as any).children = n.children.map(cleanTree as any);
        }
        return node as Container;
    };

    const _res = cleanTree(input);
    expect(_res).toMatchObject(expectLayout);
};
