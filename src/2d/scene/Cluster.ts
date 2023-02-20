import { Container } from "pixi.js";
import TransparentRectangle from "../components/TransparentRectangle";
import EnclosedGroup, { labelHeight, borderWidth } from "./EnclosedGroup";
import ClusterNode from "./ClusterNode";

class Cluster extends EnclosedGroup {
    /**
     * Instead of rendering the children, we render a rectangle that wraps all the cluster nodes
     * this is because the cluster nodes were rendered before and belong to another scene node
     *
     * @param children elements that are part of the cluster
     * @returns an empty rectangle that is the size of the cluster
     */
    protected layoutChildren(children: ClusterNode[]): Container {
        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;

        for (const child of children) {
            if (child.isPlaceholder) {
                continue;
            }

            const globalPosition = child.getGlobalPosition();

            minX = Math.min(minX, globalPosition.x);
            maxX = Math.max(maxX, globalPosition.x + child.width);
            minY = Math.min(minY, globalPosition.y);
            maxY = Math.max(maxY, globalPosition.y + child.height);
        }

        this.x = minX;
        this.y = minY - labelHeight;

        return new TransparentRectangle(0, 0, maxX - minX - borderWidth * 2, maxY - minY);
    }
}

export default Cluster;
