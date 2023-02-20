import { Container, filters as pixiFilters } from "pixi.js";
import { dfs } from "../utils";
import SceneNode from "./SceneNode";
import EnclosedGroup from "./EnclosedGroup";
import OpenedGroup from "./OpenedGroup";
import ColumnGroup from "./ColumnGroup";
import GridGroup from "./GridGroup";
import RowGroup from "./RowGroup";
import WrappedRowGroup from "./WrappedRowGroup";
import LabeledIcon from "./LabeledIcon";
import LabeledIconGroup from "./LabeledIconGroup";
import Cluster from "./Cluster";
import ClusterNode from "./ClusterNode";

export enum LayoutType {
    Row = "row",
    Column = "column",
    Grid = "grid",
    WrappedRow = "wrappedRow",
    EnclosedGroup = "enclosedGroup",
    OpenedGroup = "openedGroup",
    Icon = "icon",
    Cluster = "cluster",
    ClusterNode = "clusterNode",
    IconContainer = "iconContainer",
}

export interface Layout {
    type: LayoutType;
    options?: any;
}

interface ClusterSpec {
    data: EntityDefinition;
    renderedClusterNodes: SceneNode[];
    realClusterNodes: number;
    clusterHeight: number;
}

export interface EntityDefinition {
    id: string;
    _type: string;
    resourceId?: string;
    title?: string;
    name?: string;
    order?: number;
    layout: Layout;
    children?: EntityDefinition[];
    clusterId?: string; // does this belong to a cluster
    containedClusters?: string[]; // do we contain parts of clusters in our children
}

class MainScene extends Container {
    public readonly data: EntityDefinition;
    /**
     * An entity can be drawn (scene node) multiple times although all of them
     * represent the same entity. For example, an AWS NACL
     */
    public readonly entitiesMap: Map<string, SceneNode[]>;

    constructor(data: EntityDefinition) {
        super();

        this.data = data;
        this.entitiesMap = new Map();
        const clusterSpecs = this.getClusterSpecs();

        // Render the scene without clusters
        const scene = this.draw(data, { clusterSpecs });

        // Render clusters
        for (const spec of Object.values(clusterSpecs)) {
            const cluster = this.drawCluster(spec);
            scene?.addChild(cluster);
        }

        this.addChild(scene!);
    }

    getEntity(id: string): SceneNode[] {
        return this.entitiesMap.get(id) ?? [];
    }

    getFirstEntity(id: string): SceneNode | undefined {
        return this.getEntity(id)[0];
    }

    getEntities(ids?: string[]): SceneNode[] {
        return ids
            ? (ids.flatMap((id) => this.getEntity(id)).filter(Boolean) as SceneNode[])
            : Array.from(this.entitiesMap.values()).flat();
    }

    /**
     * Gray out all the scene
     *
     * @param enabled boolean to enable or disable the filter
     */
    fade(enabled = true): void {
        if (enabled) {
            const grayFilter = new pixiFilters.ColorMatrixFilter();
            grayFilter.grayscale(0.2, false);
            this.filters = [grayFilter];
        } else {
            this.filters = null;
        }
    }

    /**
     * Renders cluster nodes of clusters separately to determine the max height
     * of the cluster nodes. This is needed to calculate the height of the cluster and
     * make room for thecluster to be rendered in the main scene.
     *
     * @returns a map of cluster id to cluster spec
     */
    private getClusterSpecs(): Record<string, ClusterSpec> {
        const clustersDefintions: EntityDefinition[] = [];
        const clusterNodesDefinitions: EntityDefinition[] = [];
        const groupedClusterNodes: Record<string, SceneNode[]> = {};
        const clusterSpecs: Record<string, ClusterSpec> = {};

        // 1. Collect all clusters and cluster nodes
        dfs(this.data, (node: EntityDefinition) => {
            if (node.layout.type === "cluster") {
                clustersDefintions.push(node);
            }
            if (node.layout.type === "clusterNode") {
                clusterNodesDefinitions.push(node);
            }
        });

        const clusterNodes = clusterNodesDefinitions.map((definition) => this.draw(definition)) as SceneNode[];

        // 2. Group cluster nodes by cluster id
        for (const node of clusterNodes) {
            const clusterId = node.data.clusterId!;
            if (groupedClusterNodes[clusterId]) {
                groupedClusterNodes[clusterId].push(node);
            } else {
                groupedClusterNodes[clusterId] = [node];
            }
        }

        // 3. Create cluster specs.
        for (const clusterDef of clustersDefintions) {
            let clusterHeight = 0;
            const clusterNodes = groupedClusterNodes[clusterDef.id];

            //@TODO: do something with empty clusters
            if (!clusterNodes) {
                continue;
            }

            for (const clusterNode of clusterNodes) {
                clusterHeight = Math.max(clusterHeight, clusterNode.height);
            }

            const realClusterNodes = clusterNodes.filter(
                (clusterNode) => !(clusterNode as ClusterNode).isPlaceholder,
            ).length;

            clusterSpecs[clusterDef.id] = {
                data: clusterDef,
                renderedClusterNodes: [],
                realClusterNodes,
                clusterHeight,
            };
        }

        return clusterSpecs;
    }

    private drawCluster(spec: ClusterSpec): SceneNode {
        const cluster = new Cluster(spec.data);
        cluster.draw(spec.renderedClusterNodes);
        this.addToEntitiesMap(cluster);

        return cluster;
    }

    private draw(data: EntityDefinition, state: any = {}): SceneNode | undefined {
        if (data.layout.options?.omitIfEmpty && !data.children?.length) {
            return;
        }
        const node = this.createNode(data);
        const childrenNodes: SceneNode[] = [];

        for (const child of data.children ?? []) {
            if (child.layout.type === "cluster") {
                continue; // clusters are rendered separately after all other nodes
            }
            const childNode = this.draw(child, state);
            if (childNode) {
                childrenNodes.push(childNode as SceneNode);
            }
        }

        node.draw(childrenNodes, state);
        this.addToEntitiesMap(node);
        return node;
    }

    private addToEntitiesMap(node: SceneNode): void {
        // Hack to filter only 'real' business level entities, not generated containers
        if (node.isRealEntity()) {
            const id = node.getId();
            if (this.entitiesMap.has(id)) {
                this.entitiesMap.get(id)!.push(node);
            } else {
                this.entitiesMap.set(id, [node]);
            }
        }
    }

    private createNode(data: EntityDefinition): SceneNode {
        switch (data.layout.type) {
            case "row":
                return new RowGroup(data);
            case "column":
                return new ColumnGroup(data);
            case "grid":
                return new GridGroup(data);
            case "wrappedRow":
                return new WrappedRowGroup(data);
            case "enclosedGroup":
                return new EnclosedGroup(data);
            case "openedGroup":
                return new OpenedGroup(data);
            case "cluster":
                return new Cluster(data);
            case "clusterNode":
                return new ClusterNode(data);
            case "iconContainer":
                return new LabeledIconGroup(data);
            case "icon":
            default:
                return new LabeledIcon(data);
        }
    }
}

export default MainScene;
