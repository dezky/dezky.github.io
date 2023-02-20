import _ from "lodash";
import { getIconColorForGroupLabel } from "./categoryGroupLabelColors";
import { EntityDefinition, Layout, LayoutType } from "../2d/scene/MainScene";
import { getElementsOfType } from "../2d/utils";

export interface VsdData {
    id: string;
    name: string;
    resourceType: string;
    children?: VsdData[];
    displayData?: {
        id?: string;
        gcpId?: string;
        arn?: string;
        azureId?: string;
        configuration?: {
            id?: string;
            gcpId?: string;
            arn?: string;
            azureId?: string;
        };
    };
    metaData: {
        cuid?: string;
        tags?: any[];
        // @TODO: make this compatible with gcp and azure
        vpcLevelParentType?: string;
        vpcLevelParent?: string;
        // @TODO GCP has labels, not tags and labels is an object.
    };
}

// set config to build the layout.. we may add ad-hoc functions to resolve some advanced aspects of it
export interface EntityConfig {
    // TODO: is container or not?
    order?: number;
    isContainer?: boolean;
    clusterNodesContainers?: string;
    parentContainer?: string;
    hide?: boolean;
    omitIfEmpty?: boolean;
    layout: Layout;
}

const clusterDefs: any = {};

export class DataMapper {
    private vsdData!: VsdData;

    constructor(
        private readonly resourcesConfig: { [resourceType: string]: EntityConfig },
        private readonly displayNames: { [resourceType: string]: string },
        private getResourceId: (node: VsdData) => string | undefined,
        private getResourceColor: (resourceType: string) => number,
        private getResourceGroupLabelColor: (resourceType: string) => number,
    ) {}

    public getLayout(vsdData: VsdData): EntityDefinition {
        this.vsdData = vsdData;
        return this.postProcessTree(this.layoutNode(this.vsdData));
    }

    private layoutNode(node: VsdData): EntityDefinition {
        // we can see more details at setProcessOrder(), but lets try to start generic first

        const { id, name, resourceType } = node;
        const children = node.children!;
        const config = this.getResourceConfig(resourceType);

        const isContainer = config.isContainer;
        delete config.isContainer;

        const entity: EntityDefinition = {
            id,
            _type: resourceType,
            resourceId: this.getResourceId(node),
            name,
            ...config,
        };

        if (isContainer) {
            entity.children = this.layoutChildren(children, entity);
            this.bubleUpClusters(entity);
        }
        return entity;
    }

    private layoutChildren(children: VsdData[], parent: EntityDefinition): EntityDefinition[] {
        // elements of the same type go in rows
        // elements belonging to clusters go in separate rows, and aligned to the bottom
        // elements that are clusterNodeContainers are handled separately

        // const childrenEntitties = children.map(child => this.layoutNode(child))
        const groups = _.groupBy(
            children,
            (ch) => ch.metaData.vpcLevelParent || "top-level", //only vpc parents exist for now
        );
        const topLevelGroups = groups["top-level"];
        delete groups["top-level"];
        const clusterGroups = Object.values(groups);
        const clusterEntities = this.groupChildrenCluster(clusterGroups, parent);
        const topLevelEntities = this.groupChildrenByType(topLevelGroups, parent);
        return clusterEntities.concat(topLevelEntities);
    }

    private groupChildrenCluster(clusterGroups: VsdData[][], parent: EntityDefinition): EntityDefinition[] {
        return clusterGroups.map((group) => {
            const clusterNodeRowMeta = group[0].metaData;
            const clusterNodeContainerConfig = this.getResourceConfig(LayoutType.ClusterNode);
            const clusterNodeElementConfig = this.getResourceConfig(clusterNodeRowMeta.vpcLevelParentType!);
            const cluster = {
                id: clusterNodeRowMeta.vpcLevelParent!,
                type: clusterNodeRowMeta.vpcLevelParentType!,
            };
            const clusterNodeContainer: EntityDefinition = {
                id: `${cluster.id}_${LayoutType.ClusterNode}`,
                _type: LayoutType.ClusterNode,
                ...clusterNodeContainerConfig,
                order: clusterNodeElementConfig.order, // inherit order
                layout: { type: LayoutType.ClusterNode },
                clusterId: cluster.id,
                containedClusters: [cluster.id],
            };
            clusterDefs[cluster.id] = {
                id: cluster.id,
                clusterNodesContainers: clusterNodeElementConfig.clusterNodesContainers,
                parentContainer: clusterNodeElementConfig.parentContainer,
                order: clusterNodeElementConfig.order,
            };
            // vsd-api sends this nested cluster... we only have the container be the cluster
            group.forEach((child) => {
                if (child.metaData.vpcLevelParent) child.metaData.vpcLevelParent = undefined;
                child.children?.forEach((child) => {
                    if (child.metaData.vpcLevelParent) child.metaData.vpcLevelParent = undefined;
                });
            });
            clusterNodeContainer.children = this.groupChildrenByType(group, clusterNodeContainer);
            delete (clusterNodeContainer as any).isContainer;
            return clusterNodeContainer;
        });
    }

    private groupChildrenByType(children: VsdData[], parent: EntityDefinition): EntityDefinition[] {
        const groupsOfType = _.groupBy(children || [], "resourceType");
        const res: EntityDefinition[] = [];
        Object.keys(groupsOfType).forEach((groupType) => {
            const group = groupsOfType[groupType];
            const parentConfig = this.getResourceConfig(groupType);
            if (parentConfig.hide === true) return;

            const children = group.map((child) => this.layoutNode(child));

            if (parentConfig.layout.type === "cluster") {
                // no wrapping, they will be rendered across many children
                return res.push(...children);
            }
            // if we have 3 subnets, but 1 has clusters, we create a row for it, so it cant get its own row
            const normalChildren: any = [];
            const clusterChildren: any = [];
            children.forEach((child) => {
                if (child.containedClusters?.length) {
                    clusterChildren.push(child);
                } else {
                    normalChildren.push(child);
                }
            });
            if (clusterChildren.length) {
                const container: EntityDefinition = {
                    id: `${parent.id}_#_${groupType}`,
                    _type: "row",
                    layout: { type: LayoutType.Row },
                    order: parentConfig.order, // inherit order
                    children: clusterChildren,
                };
                this.bubleUpClusters(container);
                res.push(container);
            }
            if (normalChildren.length) {
                const config = this.getResourceConfig(`${groupType}_group`, {
                    type: LayoutType.Grid,
                    options: { columns: 12, maxRows: 3, align: "center" },
                });
                const container: EntityDefinition = {
                    id: `${parent.id}_#_${groupType}`,
                    _type: LayoutType.Grid,
                    ...config,
                    order: parentConfig.order, // inherit order
                    children: normalChildren,
                };
                this.bubleUpClusters(container);
                res.push(container);
            }
        });
        return res;
    }

    private postProcessTree(node: EntityDefinition) {
        if (!node.children?.length) return node;

        for (const child of node.children) {
            this.postProcessTree(child);
        }
        // sort children by order
        node.children.sort((a, b) => {
            const aOrder = a.order || 0;
            const bOrder = b.order || 0;

            // Containers with clusters go last
            if (a.containedClusters && !b.containedClusters) {
                return 1;
            } else if (!a.containedClusters && b.containedClusters) {
                return -1;
            }

            return aOrder - bOrder;
        });

        return node;
    }

    private bubleUpClusters(node: EntityDefinition) {
        // we bubble up the cluster to the parent - until we find the container ID in a child (sibling)
        const containedClusters = node.children!.reduce((acc, c) => {
            acc.push(...(c.containedClusters || []));
            return acc;
        }, node.containedClusters || []);
        if (containedClusters.length) {
            node.containedClusters = _.uniq(containedClusters);

            // @TODO: we only support 1 parent type for now
            const container = clusterDefs[containedClusters[0]].parentContainer;
            if (node._type === container) {
                // time to finish propagating the cluster.
                // we now make sure all the children of the given type contain the cluster or an empty placeholder
                node.containedClusters?.forEach((clusterId) => {
                    const clusterDef = clusterDefs[clusterId];
                    node.children!.forEach((child) => {
                        if (child.containedClusters) {
                            const allElements = getElementsOfType(
                                child,
                                clusterDef.clusterNodesContainers, //ie. subnets
                            );
                            allElements
                                .filter((s) => s.containedClusters && !s.containedClusters?.includes(clusterId))
                                .forEach((child) => {
                                    if (!child.containedClusters?.length) return;
                                    child.children!.push({
                                        id: `${clusterDef.id}_clusterNode_placeholder`,
                                        _type: LayoutType.ClusterNode,
                                        order: clusterDef.order,
                                        layout: { type: LayoutType.ClusterNode },
                                        clusterId: clusterDef.id,
                                        containedClusters: [clusterDef.id],
                                    });
                                });
                        }
                    });
                });
                delete node.containedClusters;
            }
        }
    }

    private getResourceConfig = (
        resourceType: string,
        defaultLayout: Layout = { type: LayoutType.Icon, options: {} },
    ): EntityConfig => {
        const resConfig = this.resourcesConfig[resourceType] ?? {
            layout: defaultLayout,
        };
        const groupLabelColor = this.getResourceGroupLabelColor(resourceType);
        resConfig.layout.options = {
            color: this.getResourceColor(resourceType),
            groupLabelIconColor: getIconColorForGroupLabel(groupLabelColor),
            groupLabelColor: groupLabelColor,
            ...resConfig.layout.options,
        };

        return {
            title: this.displayNames[resourceType] || resourceType,
            order: resConfig.isContainer ? 1000 : 0,
            ...resConfig,
        } as EntityConfig;
    };
}
