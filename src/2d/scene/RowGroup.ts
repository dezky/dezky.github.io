import { Container } from "pixi.js";
import Row from "../components/Row";
import SceneNode from "./SceneNode";

class RowGroup extends SceneNode {
    private row = new Row([]);

    draw(children: Container[], _traversalState?: any): void {
        this.row.setChildren(children, {
            align: "end",
            spacing: 64,
            ...this.data.layout.options,
        });
        this.addContent(this.row);
    }
}

export default RowGroup;
