/* eslint-disable complexity */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable @typescript-eslint/naming-convention */
import _ from "lodash";

import {
    TYPECOMPARTMENTS,
    STATECODES,
    COUNTYCODES,
    REGEXTYPEMODEL,
} from "constants/verifyAttrTomlConstants";
import { EpicConfigToml } from "types/TomlTypes";

import { verifyInnertypesVDT } from "./helpersImportModel";

const isRightModelTypes = (mod: EpicConfigToml["model"]) => {
    const { model, compartments, name } = mod;
    if (!_.isString(name) && !_.isString(model)) {
        throw new Error("name and model must to be a string");
    }
    if (!_.isArray(compartments)) {
        throw new Error("compartments must to be a array");
    }
    const typeModel = _.isEmpty(
        _.difference(
            [...compartments].sort(),
            TYPECOMPARTMENTS[model.match(REGEXTYPEMODEL)[0]].sort()
        )
    );
    if (!typeModel) {
        throw new Error("Elements into compartment property are wrong");
    }
    return true;
};
const isRightDataType = (data: EpicConfigToml["data"]) => {
    const {
        initdate,
        country,
        state,
        county,
        healthservice,
        loc_name,
        geo_topology,
    } = data;
    const isStringType = Object.entries({
        initdate,
        country,
        state,
        county,
        healthservice,
        loc_name,
        geo_topology,
    }).every(([key, value]) => {
        if (key === "county" || key === "state") {
            if (_.isArray(value)) {
                if (!value.every((val) => _.isString(val))) {
                    //     return false;
                    // }
                    throw new Error("Geographical codes must to be a string");
                }
                if (
                    !_.isEqual(
                        _.intersection(
                            key === "county" ? COUNTYCODES : STATECODES,
                            value
                        ).sort(),
                        value.sort()
                    )
                ) {
                    throw new Error("Geographical codes are wrong");
                }
                return true;
            }
            // if (!value) return true;
            if (value) {
                if (
                    !_.includes(
                        key === "county" ? COUNTYCODES : STATECODES,
                        value
                    )
                ) {
                    throw new Error("Geographical codes are wrong");
                }
                return true;
            }
            return _.isString(value);
        }
        return _.isString(value);
    });
    if (!isStringType) {
        throw new Error("In data, there are elements with wrong type");
    }
    return true;
};
const isRightInitialConditionsType = (
    initialConditions: EpicConfigToml["initialconditions"]
) => {
    return Object.values(initialConditions).every((num) => {
        if (_.isArray(num)) {
            return num.every((n) => _.isNumber(n) && n >= 0);
        }
        return _.isNumber(num) && num >= 0;
    });
};
const isRightStaticTypes = (
    staticData: EpicConfigToml["parameters"]["static"],
    typeCompartment: string,
    isMeta = false
) => {
    const verifyStaticType = ([key, value]) => {
        if (key === "t_init") {
            return _.isString(value);
        }
        if (key === "mu") {
            if (_.isArray(value) && isMeta) {
                return value.every((val) => _.isNumber(val));
            }
            return _.isNumber(value);
        }
        return _.isNumber(value);
    };
    const { t_init, t_end, mu, ...rest } = staticData;
    if (typeCompartment === "seirhvd") {
        const { pIcr_det, pIm_det, pIv_det } = rest;
        return Object.entries({
            t_init,
            t_end,
            mu,
            pIcr_det,
            pIm_det,
            pIv_det,
        }).every(verifyStaticType);
    }
    return Object.entries({
        t_init,
        t_end,
        mu,
        pI_det: rest.pI_det,
    }).every(verifyStaticType);
};
const isRightDynamicTypes = (
    dynamicData: EpicConfigToml["parameters"]["dynamic"],
    typeCompartment: string,
    isMeta = false
) => {
    const { alpha, beta, ...rest } = dynamicData;
    if (typeCompartment === "seirhvd") {
        const { phi, rR_S, tE_I, tI_R, ...restSEIRHVD } = rest;
        return Object.entries({ alpha, beta, ...restSEIRHVD }).every(
            ([_key, value]) => {
                if (!value && !_.isNumber(value)) {
                    throw new Error("There are empty value in dynamic data");
                }
                if (_.isString(value) || _.isNumber(value)) {
                    return verifyInnertypesVDT(value);
                }
                if (_.isArray(value) && isMeta) {
                    return value.every((val) => verifyInnertypesVDT(val));
                }
                throw new Error(
                    `In metapopulations simulations, time dependent variables must to be an array`
                );
            }
        );
    }
    const { rR_S, tE_I, tI_R } = rest;
    const dynamicParametersForSirOrSeir =
        typeCompartment === "seir"
            ? {
                  alpha,
                  beta,
                  rR_S,
                  tE_I,
                  tI_R,
              }
            : { alpha, beta, rR_S, tI_R };
    return Object.entries(dynamicParametersForSirOrSeir).every(
        ([_key, value]) => {
            if (!value && !_.isNumber(value)) {
                throw new Error("There are empty value in dynamic data 2");
            }
            // create a function verify string type with function
            // sanity string
            if (
                (_key === "tI_R" || _key === "tE_I" || _key === "rR_S") &&
                _.isArray(value)
            ) {
                throw new Error(`${_key} can't be an array`);
            }
            if (_.isString(value) || _.isNumber(value)) {
                return verifyInnertypesVDT(value);
            }
            if (_.isArray(value) && isMeta) {
                return value.every((val) => verifyInnertypesVDT(val));
            }

            throw new Error(
                `In metapopulations simulations, Dependent time Variables must to be an array`
            );
        }
    );
};
const verifyTomlTypesAttr = (dataToml: EpicConfigToml) => {
    const {
        model,
        data,
        initialconditions,
        parameters: { static: staticAttr, dynamic },
    } = dataToml;
    const typeModel = model.model.match(REGEXTYPEMODEL)[0];
    if (!Object.keys(TYPECOMPARTMENTS).includes(typeModel)) {
        throw new Error("model type is wrong");
    }
    isRightModelTypes(model);
    isRightDataType(data);
    isRightInitialConditionsType(initialconditions);
    const isMeta = data.geo_topology === "meta";
    isRightStaticTypes(staticAttr, typeModel, isMeta);
    isRightDynamicTypes(dynamic, typeModel, isMeta);
};

export default verifyTomlTypesAttr;
