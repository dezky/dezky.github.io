import displayNames from "./awsDisplayNames";
import resourceCategories from "./awsServiceHierarchy";
import resourceCategoryColors, {
    categoryGroupLabelColorsMap as resourceCategoryGroupLabelColors,
} from "./awsServiceCategoryColors";
import awsServices from "./awsServices";
import { getResourceColorResolver } from "../2d/utils";
import { LayoutType } from "../2d/scene/MainScene";
import { DataMapper, EntityConfig, VsdData } from "./dataMapper";
import palette from "../themes/palette";

const getResourceId = (node: VsdData) => {
    return node?.displayData?.arn ?? node?.displayData?.configuration?.arn;
};

const getResourceColor = getResourceColorResolver(resourceCategories, resourceCategoryColors);

const getResourceGroupLabelColor = getResourceColorResolver(
    resourceCategories,
    resourceCategoryGroupLabelColors,
    palette.common.offBlack,
);

const resourcesConfig: { [key: string]: EntityConfig } = {
    clusterNode: {
        isContainer: true,
        layout: { type: LayoutType.ClusterNode },
    },
    [awsServices.awsOrganizationsAccount]: {
        hide: true,
        layout: { type: LayoutType.Icon },
    },
    // Logical Groups
    [`${awsServices.awsRegion}_group`]: {
        isContainer: true,
        layout: {
            type: LayoutType.Column,
            options: {
                align: "center",
            },
        },
    },
    [`${awsServices.awsVpc}_group`]: {
        isContainer: true,
        layout: {
            type: LayoutType.Column,
            options: {
                align: "center",
            },
        },
    },
    [`${awsServices.awsAvailabilityZone}_group`]: {
        isContainer: true,
        layout: { type: LayoutType.Row },
    },
    [`${awsServices.awsSubnet}_group`]: {
        isContainer: true,
        layout: { type: LayoutType.Row },
    },
    // Enclosed Groups
    [awsServices.awsAccount]: {
        order: 1000,
        isContainer: true,
        layout: { type: LayoutType.EnclosedGroup },
    },
    [awsServices.awsAutoscalingGroup]: {
        order: 1001,
        isContainer: true,
        layout: { type: LayoutType.EnclosedGroup },
    },
    [awsServices.awsAvailabilityZone]: {
        order: 1002,
        isContainer: true,
        layout: { type: LayoutType.EnclosedGroup },
    },
    [awsServices.awsNetworkAcl]: {
        order: 1003,
        isContainer: true,
        layout: {
            type: LayoutType.OpenedGroup,
            options: {
                // I'm overriding also the default color, because the nacl should have the color
                // of networking category but in the diagram the security category color is used ¯\_(ツ)_/¯
                color: 0xfb4a72,
            },
        },
    },
    [awsServices.awsRegion]: {
        order: 1004,
        isContainer: true,
        layout: { type: LayoutType.EnclosedGroup },
    },
    [awsServices.awsSubnet]: {
        order: 1005,
        isContainer: true,
        layout: { type: LayoutType.EnclosedGroup },
    },
    [awsServices.awsVpc]: {
        order: 1006,
        isContainer: true,
        layout: { type: LayoutType.EnclosedGroup },
    },
    [awsServices.awsDbInstance]: {
        order: 100006,
        isContainer: true,
        layout: { type: LayoutType.EnclosedGroup },
    },
    // icon containers
    [awsServices.awsInstance]: {
        isContainer: true,
        layout: { type: LayoutType.IconContainer },
    },
    // clusters
    [awsServices.awsEksCluster]: {
        order: 100002,
        isContainer: true,
        clusterNodesContainers: awsServices.awsSubnet,
        parentContainer: awsServices.awsVpc,
        layout: { type: LayoutType.Cluster },
    },
    [awsServices.awsEcsCluster]: {
        order: 100003,
        isContainer: true,
        clusterNodesContainers: awsServices.awsSubnet,
        parentContainer: awsServices.awsVpc,
        layout: { type: LayoutType.Cluster },
    },
    [awsServices.awsEmrCluster]: {
        order: 100004,
        isContainer: true,
        clusterNodesContainers: awsServices.awsSubnet,
        parentContainer: awsServices.awsVpc,
        layout: { type: LayoutType.Cluster },
    },
    [awsServices.awsElasticacheReplicationGroup]: {
        order: 100005,
        isContainer: true,
        clusterNodesContainers: awsServices.awsSubnet,
        parentContainer: awsServices.awsVpc,
        layout: { type: LayoutType.Cluster },
    },
    [awsServices.awsElasticBeanstalkEnvironment]: {
        order: 100006,
        isContainer: true,
        clusterNodesContainers: awsServices.awsSubnet,
        parentContainer: awsServices.awsVpc,
        layout: { type: LayoutType.Cluster },
    },
    [awsServices.awsRdsCluster]: {
        order: 100020,
        isContainer: true,
        clusterNodesContainers: awsServices.awsSubnet,
        parentContainer: awsServices.awsVpc,
        layout: { type: LayoutType.Cluster },
    },
};

export const getDataMapper = () => {
    return new DataMapper(resourcesConfig, displayNames, getResourceId, getResourceColor, getResourceGroupLabelColor);
};
