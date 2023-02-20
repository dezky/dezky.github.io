import WrappedRow from "./WrappedRow";
import { buildTestContainers, testLayout } from "./test.helpers";

describe("WrappedRow", () => {
    it("should layout children in a row", () => {
        const wrappedRow = new WrappedRow(
            buildTestContainers([
                { width: 10, height: 10 },
                { width: 15, height: 10 },
                { width: 10, height: 10 },
            ]),
        );

        testLayout(wrappedRow, {
            x: 0,
            y: 0,
            width: 35,
            height: 10,
            children: [
                {
                    x: 0,
                    y: 0,
                    width: 35,
                    height: 10,
                    children: [
                        { x: 0, y: 0, width: 10, height: 10 },
                        { x: 10, y: 0, width: 15, height: 10 },
                        { x: 25, y: 0, width: 10, height: 10 },
                    ],
                },
            ],
        });
    });

    it("should layout children in a row with spacing", () => {
        const wrappedRow = new WrappedRow(
            buildTestContainers([
                { width: 10, height: 10 },
                { width: 15, height: 10 },
                { width: 10, height: 10 },
            ]),
            { spacing: 5 },
        );

        testLayout(wrappedRow, {
            x: 0,
            y: 0,
            width: 45,
            height: 10,
            children: [
                {
                    x: 0,
                    y: 0,
                    width: 45,
                    height: 10,
                    children: [
                        { width: 10, height: 10 },
                        { width: 15, height: 10 },
                        { width: 10, height: 10 },
                    ],
                },
            ],
        });
    });

    it("should wrap children into a new row when there is no more room", () => {
        const wrappedRow = new WrappedRow(
            buildTestContainers([
                { width: 10, height: 10 },
                { width: 15, height: 10 },
                { width: 10, height: 10 },
            ]),
            { wrapWidth: 30 },
        );

        testLayout(wrappedRow, {
            x: 0,
            y: 0,
            width: 25,
            height: 20,
            children: [
                {
                    x: 0,
                    y: 0,
                    width: 25,
                    height: 10,
                    children: [
                        { x: 0, y: 0, width: 10, height: 10 },
                        { x: 10, y: 0, width: 15, height: 10 },
                    ],
                },
                {
                    x: 0,
                    y: 10,
                    width: 10,
                    height: 10,
                    children: [{ x: 0, y: 0, width: 10, height: 10 }],
                },
            ],
        });
    });

    it("should vertically center every row", () => {
        const wrappedRow = new WrappedRow(
            buildTestContainers([
                { width: 10, height: 10 },
                { width: 10, height: 40 },
                { width: 10, height: 20 },
            ]),
            { wrapWidth: 20, alignY: "center" },
        );

        testLayout(wrappedRow, {
            x: 0,
            y: 0,
            width: 20,
            height: 60,
            children: [
                {
                    x: 0,
                    y: 0,
                    width: 20,
                    height: 40,
                    children: [
                        { x: 0, y: 15, width: 10, height: 10 },
                        { x: 10, y: 0, width: 10, height: 40 },
                    ],
                },
                {
                    x: 0,
                    y: 40,
                    width: 10,
                    height: 20,
                    children: [{ x: 0, y: 0, width: 10, height: 20 }],
                },
            ],
        });
    });

    it("should vertically align at the end every row", () => {
        const wrappedRow = new WrappedRow(
            buildTestContainers([
                { width: 10, height: 10 },
                { width: 10, height: 40 },
                { width: 10, height: 20 },
            ]),
            { wrapWidth: 20, alignY: "end" },
        );

        testLayout(wrappedRow, {
            x: 0,
            y: 0,
            width: 20,
            height: 60,
            children: [
                {
                    x: 0,
                    y: 0,
                    width: 20,
                    height: 40,
                    children: [
                        { x: 0, y: 30, width: 10, height: 10 },
                        { x: 10, y: 0, width: 10, height: 40 },
                    ],
                },
                {
                    x: 0,
                    y: 40,
                    width: 10,
                    height: 20,
                    children: [{ x: 0, y: 0, width: 10, height: 20 }],
                },
            ],
        });
    });

    it("should align rows and items in both axis", () => {
        const wrappedRow = new WrappedRow(
            buildTestContainers([
                { width: 10, height: 10 },
                { width: 10, height: 40 },
                { width: 10, height: 20 },
            ]),
            { wrapWidth: 20, alignX: "center", alignY: "center" },
        );

        testLayout(wrappedRow, {
            x: 0,
            y: 0,
            width: 20,
            height: 60,
            children: [
                {
                    x: 0,
                    y: 0,
                    width: 20,
                    height: 40,
                    children: [
                        { x: 0, y: 15, width: 10, height: 10 },
                        { x: 10, y: 0, width: 10, height: 40 },
                    ],
                },
                {
                    x: 5,
                    y: 40,
                    width: 10,
                    height: 20,
                    children: [{ x: 0, y: 0, width: 10, height: 20 }],
                },
            ],
        });
    });
});
