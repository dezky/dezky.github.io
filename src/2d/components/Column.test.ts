import Column from "./Column";
import { buildTestContainers, testLayout } from "./test.helpers";

describe("Column", () => {
    it("should layout children in a column", () => {
        const column = new Column(
            buildTestContainers([
                { width: 10, height: 10 },
                { width: 10, height: 20 },
                { width: 10, height: 10 },
            ]),
        );

        testLayout(column, {
            x: 0,
            y: 0,
            width: 10,
            height: 40,
            children: [
                { x: 0, y: 0, width: 10, height: 10 },
                { x: 0, y: 10, width: 10, height: 20 },
                { x: 0, y: 30, width: 10, height: 10 },
            ],
        });
    });

    it("should layout children in a column with spacing", () => {
        const column = new Column(
            buildTestContainers([
                { width: 10, height: 10 },
                { width: 10, height: 20 },
                { width: 10, height: 10 },
            ]),
            { spacing: 5 },
        );

        testLayout(column, {
            x: 0,
            y: 0,
            width: 10,
            height: 50,
            children: [
                { x: 0, y: 0, width: 10, height: 10 },
                { x: 0, y: 15, width: 10, height: 20 },
                { x: 0, y: 40, width: 10, height: 10 },
            ],
        });
    });

    it("should layout children horizontally centered", () => {
        const column = new Column(
            buildTestContainers([
                { width: 10, height: 10 },
                { width: 40, height: 10 },
                { width: 20, height: 10 },
            ]),
            { align: "center" },
        );

        testLayout(column, {
            x: 0,
            y: 0,
            width: 40,
            height: 30,
            children: [
                { x: 15, y: 0, width: 10, height: 10 },
                { x: 0, y: 10, width: 40, height: 10 },
                { x: 10, y: 20, width: 20, height: 10 },
            ],
        });
    });

    it("should layout children horizontally align at the end", () => {
        const column = new Column(
            buildTestContainers([
                { width: 10, height: 10 },
                { width: 40, height: 10 },
                { width: 20, height: 10 },
            ]),
            { align: "end" },
        );

        testLayout(column, {
            x: 0,
            y: 0,
            width: 40,
            height: 30,
            children: [
                { x: 30, y: 0, width: 10, height: 10 },
                { x: 0, y: 10, width: 40, height: 10 },
                { x: 20, y: 20, width: 20, height: 10 },
            ],
        });
    });
});
