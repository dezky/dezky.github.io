import palette from "../themes/palette";
import { utils as pixiUtils } from "pixi.js";

const categoryGroupLabelColors = {
    networkingColor: palette.common.white,
    computeColor: palette.common.offBlack,
    storageColor: palette.common.offBlack,
    dbColor: palette.common.white,
    accessColor: palette.common.white,
    integrationColor: palette.common.offBlack,
    analyticsColor: palette.common.white,
    managementColor: palette.common.white,
    iotColor: palette.common.white,
    devToolColor: palette.common.white,
    aiMlColor: palette.common.offBlack,
    securityColor: palette.common.white,
    identityColor: palette.common.white,
    devopsColor: palette.common.white,
};

const iconColorForGroupLabelMap = {
    [palette.common.white]: palette.common.white,
    [palette.common.offBlack]: palette.common.lightBlueGray,
};

export const getIconColorForGroupLabel = (labelColor: number) =>
    pixiUtils.string2hex(iconColorForGroupLabelMap[pixiUtils.hex2string(labelColor)]);

export default categoryGroupLabelColors;
