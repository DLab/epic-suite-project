import _ from "lodash";

import {
    COUNTYCODES,
    COUNTYNAMES,
    STATECODES,
    STATENAMES,
} from "constants/verifyAttrTomlConstants";

/**
 * It takes a string or an array of strings and returns an array of strings
 * @param {string | string[]} cod - The spatial code of the area you want to get the name for.
 * @param {string} scales - The spatial scale of the data.
 * @returns An array of strings.
 */
const getGeoNames = (cod: string | string[], scales: string) => {
    const newCod = _.isString(cod) ? [cod] : cod;
    return newCod.map((spatialCode, i) => {
        if (scales === "States") {
            const stateIndex = STATECODES.findIndex((id) => {
                return id === spatialCode;
            });
            return STATENAMES[stateIndex];
        }
        if (scales === "Counties") {
            const countiesIndex = COUNTYCODES.findIndex(
                (id) => id === spatialCode
            );
            return COUNTYNAMES[countiesIndex];
        }
        return `${spatialCode}`;
    });
};

export default getGeoNames;
