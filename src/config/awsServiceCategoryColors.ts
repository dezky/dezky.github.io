import categoryColors from "./categoryColors";
import categoryGroupLabelColors from "./categoryGroupLabelColors";
import awsServiceCategories from "./awsServiceCategories";

const {
    access,
    aiMl,
    analytics,
    compute,
    database,
    devops,
    iam,
    iot,
    integration,
    management,
    networking,
    security,
    storage,
} = awsServiceCategories;

const {
    networkingColor,
    computeColor,
    storageColor,
    securityColor,
    dbColor,
    accessColor,
    integrationColor,
    analyticsColor,
    managementColor,
    iotColor,
    devToolColor,
    aiMlColor,
} = categoryColors;

const {
    networkingColor: networkingGroupLabelColor,
    computeColor: computeGroupLabelColor,
    storageColor: storageGroupLabelColor,
    securityColor: securityGroupLabelColor,
    dbColor: dbGroupLabelColor,
    accessColor: accessGroupLabelColor,
    integrationColor: integrationGroupLabelColor,
    analyticsColor: analyticsGroupLabelColor,
    managementColor: managementGroupLabelColor,
    iotColor: iotGroupLabelColor,
    devToolColor: devToolGroupLabelColor,
    aiMlColor: aiMlGroupLabelColor,
} = categoryGroupLabelColors;

const categoryColorsMap = {
    [access]: accessColor,
    [analytics]: analyticsColor,
    [compute]: computeColor,
    [database]: dbColor,
    [devops]: devToolColor,
    [iam]: managementColor,
    [iot]: iotColor,
    [integration]: integrationColor,
    [aiMl]: aiMlColor,
    [management]: managementColor,
    [networking]: networkingColor,
    [security]: securityColor,
    [storage]: storageColor,
};

export const categoryGroupLabelColorsMap = {
    [access]: accessGroupLabelColor,
    [analytics]: analyticsGroupLabelColor,
    [compute]: computeGroupLabelColor,
    [database]: dbGroupLabelColor,
    [devops]: devToolGroupLabelColor,
    [iam]: managementGroupLabelColor,
    [iot]: iotGroupLabelColor,
    [integration]: integrationGroupLabelColor,
    [aiMl]: aiMlGroupLabelColor,
    [management]: managementGroupLabelColor,
    [networking]: networkingGroupLabelColor,
    [security]: securityGroupLabelColor,
    [storage]: storageGroupLabelColor,
};

export default categoryColorsMap;
