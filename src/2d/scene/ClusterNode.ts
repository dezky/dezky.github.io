import { Container } from "pixi.js";
import Box from "../components/Box";
import TransparentRectangle from "../components/TransparentRectangle";
import SceneNode from "./SceneNode";
import ColumnLayout from "./ColumnLayout";
import { borderWidth as clusterBorderWidth } from "./EnclosedGroup";
import { dimension as labeledIconDimension } from "./LabeledIcon";

const paddingSize = 64;

/**
 * Turn on to add a wrapper to the childs that are inside a Cluster
 */
const DEBUG_MODE = false;

class ClusterNode extends SceneNode {
    isPlaceholder = false;

    isRealEntity() {
        return false;
    }

    draw(children: Container[], traversalState?: any): void {
        const clusterId = this.data.clusterId!;
        const clusterSpec = traversalState?.clusterSpecs?.[clusterId];

        this.data.name = clusterId;

        if (!children.length) {
            this.renderPlaceholder(clusterSpec?.clusterHeight);
        } else {
            this.renderChildren(children, clusterSpec);
            clusterSpec?.renderedClusterNodes.push(this);
        }
    }

    private renderPlaceholder(clusterHeight: number) {
        const width = labeledIconDimension.width;
        const height = clusterHeight || labeledIconDimension.height;

        this.isPlaceholder = true;
        this.addContent(new TransparentRectangle(0, 0, width, height));
    }

    private renderChildren(children: Container[], clusterSpec: any) {
        const clusterHeight = clusterSpec?.clusterHeight ?? 0;
        const isFirst = clusterSpec?.renderedClusterNodes.length === 0;
        const isLast = clusterSpec?.renderedClusterNodes.length + 1 === clusterSpec?.realClusterNodes;

        const arrangedChildren = new ColumnLayout(children);
        const paddingTop = clusterHeight ? clusterHeight - arrangedChildren.height - paddingSize : paddingSize;

        const childrenWithExtraSpace = new Box(arrangedChildren, {
            padding:
                isFirst || isLast
                    ? [
                          paddingTop,
                          isLast ? paddingSize + clusterBorderWidth : paddingSize,
                          paddingSize,
                          isFirst ? paddingSize + clusterBorderWidth : paddingSize,
                      ]
                    : [paddingTop, 0, paddingSize, 0],
        });

        if (DEBUG_MODE) {
            const debugWrapper = new Box(childrenWithExtraSpace, {
                border: { width: 16, color: 0x00ff00 },
            });
            this.addContent(debugWrapper);
        } else {
            this.addContent(childrenWithExtraSpace);
        }
    }
}

export default ClusterNode;
