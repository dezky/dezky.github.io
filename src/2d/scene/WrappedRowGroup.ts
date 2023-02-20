import { Container } from "pixi.js";
import WrappedRow from "../components/WrappedRow";
import SceneNode from "./SceneNode";

class WrappedRowGroup extends SceneNode {
    draw(children: Container[], _traversalState?: any): void {
        this.addContent(
            new WrappedRow(children, {
                spacing: 64,
                ...this.data.layout.options,
            }),
        );
    }
}

export default WrappedRowGroup;
