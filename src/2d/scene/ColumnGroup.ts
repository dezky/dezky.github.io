import { Container } from "pixi.js";
import SceneNode from "./SceneNode";
import ColumnLayout from "./ColumnLayout";

class ColumnGroup extends SceneNode {
    draw(children: Container[], _traversalState?: any): void {
        this.addContent(new ColumnLayout(children, { spacing: 64, ...this.data.layout.options }));
    }
}

export default ColumnGroup;
