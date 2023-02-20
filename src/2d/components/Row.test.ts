import Row from "./Row";
import { buildTestContainers, testLayout } from "./test.helpers";

describe("Row", () => {
    it("should layout children in a row", () => {
        const row = new Row(
            buildTestContainers([
                { width: 10, height: 10 },
                { width: 15, height: 10 },
                { width: 10, height: 10 },
            ]),
        );

        testLayout(row, {
            x: 0,
            y: 0,
            width: 35,
            height: 10,
            children: [
                { x: 0, y: 0, width: 10, height: 10 },
                { x: 10, y: 0, width: 15, height: 10 },
                { x: 25, y: 0, width: 10, height: 10 },
            ],
        });
    });

    it("should layout children in a row with spacing", () => {
        const row = new Row(
            buildTestContainers([
                { width: 10, height: 10 },
                { width: 15, height: 10 },
                { width: 10, height: 10 },
            ]),
            { spacing: 5 },
        );

        testLayout(row, {
            x: 0,
            y: 0,
            width: 45,
            height: 10,
            children: [
                { width: 10, height: 10 },
                { width: 15, height: 10 },
                { width: 10, height: 10 },
            ],
        });
    });

    it("should layout children vertically centered", () => {
        const row = new Row(
            buildTestContainers([
                { width: 10, height: 10 },
                { width: 10, height: 40 },
                { width: 10, height: 20 },
            ]),
            { align: "center" },
        );

        testLayout(row, {
            x: 0,
            y: 0,
            width: 30,
            height: 40,
            children: [
                { x: 0, y: 15, width: 10, height: 10 },
                { x: 10, y: 0, width: 10, height: 40 },
                { x: 20, y: 10, width: 10, height: 20 },
            ],
        });
    });

    it("should layout children vertically align at the end", () => {
        const row = new Row(
            buildTestContainers([
                { width: 10, height: 10 },
                { width: 10, height: 40 },
                { width: 10, height: 20 },
            ]),
            { align: "end" },
        );

        testLayout(row, {
            x: 0,
            y: 0,
            width: 30,
            height: 40,
            children: [
                { x: 0, y: 30, width: 10, height: 10 },
                { x: 10, y: 0, width: 10, height: 40 },
                { x: 20, y: 20, width: 10, height: 20 },
            ],
        });
    });
});
