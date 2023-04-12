/* eslint-disable no-nested-ternary */
import _ from "lodash";

import SeirhbdChunkImport from "components/models-tab/SeirhvdChunkImport";
import type { EpidemicsData } from "types/ControlPanelTypes";
import type { InitialConditions } from "types/SimulationTypes";

export {};

/* eslint-disable @typescript-eslint/dot-notation */
interface OptionsChunk {
    t_init: number;
    t_end: number;
    val: number;
}
export interface TomlInitialConditions {
    population: number | number[];
    R: number | number[];
    I: number | number[];
    I_det?: number | number[];
    I_d: number | number[];
    I_d_det?: number | number[];
    I_ac: number | number[];
    I_ac_det?: number | number[];
    E: number | number[] | boolean;
    E_d: number | number[] | boolean;
    H?: number | number[];
    H_acum?: number | number[];
    V?: number | number[];
    V_acum?: number | number[];
    D?: number | number[];
    D_acum?: number | number[];
    Iv?: number | number[];
    H_cap?: number | number[];
}
export const variableDependentTimeParams = [
    "beta",
    "Beta_v",
    "rR_S",
    "alpha",
    "tE_I",
    "tI_R",
    "vac_d",
    "vac_eff",
    "pE_Im",
    "tE_Im",
    "pE_Icr",
    "tE_Icr",
    "tEv_Iv",
    "tIm_R",
    "tIcr_H",
    "pIv_R",
    "tIv_R",
    "pIv_H",
    "tIv_H",
    "pH_R",
    "tH_R",
    "pH_D",
    "tH_D",
    "pR_S",
    "tR_S",
];
const exceptionVDT = ["tI_R", "tE_I", "rR_S"];
const modifyChunkByTypeFunction = (
    data: unknown,
    key: string,
    end: number,
    init: number
    // eslint-disable-next-line sonarjs/cognitive-complexity
) => {
    if (data["function"] === "sine") {
        return {
            [key]: {
                rangeDays: [[init ?? 0, end ?? 1]],
                type: [
                    {
                        name: "sinusoidal",
                        min: data["min_val"],
                        max: data["max_val"],
                        period: data["period"],
                        initPhase: data["initPhase"] === "min" ? 0 : 1,
                    },
                ],
                name: key,
                default: 1,
                isEnabled: true,
                val: 1,
            },
        };
    }
    const modifiedValues = data["values"].map((val) => {
        const newValue = _.isString(val) ? JSON.parse(val) : val;
        if (newValue["function"] === "sine") {
            const utilValue = {
                ...newValue,
                min: newValue["min_val"],
                max: newValue["max_val"],
                name: "sinusoidal",
                initPhase: newValue["initPhase"] === "min" ? 0 : 1,
            };
            delete utilValue["function"];
            delete utilValue["min_val"];
            delete utilValue["max_val"];
            return utilValue;
        }
        if (newValue["function"] === "square") {
            const utilValue = {
                ...newValue,
                min: newValue["min_val"],
                max: newValue["max_val"],
                name: "square",
                initPhase: newValue["initPhase"] === "min" ? 0 : 1,
            };
            delete utilValue["function"];
            delete utilValue["min_val"];
            delete utilValue["max_val"];
            return utilValue;
        }
        if (newValue["function"] === "transition") {
            const utilValue = {
                ...newValue,
                initvalue: newValue["min_val"],
                endvalue: newValue["max_val"],
                name: "transition",
                ftype:
                    newValue["type"] === "linear"
                        ? 0
                        : newValue["type"] === "quadratic"
                        ? 1
                        : 2,
                t_init: data["days"][0][0],
                t_end: data["days"][data["days"].length - 1][1],
            };
            delete utilValue["type"];
            delete utilValue["function"];
            delete utilValue["min_val"];
            delete utilValue["max_val"];
            return utilValue;
        }
        if (!newValue["function"]) {
            return {
                name: "static",
                value: newValue,
            };
        }
        const generalUtilValue = newValue;
        delete generalUtilValue["function"];
        return generalUtilValue;
    });
    return {
        [key]: {
            rangeDays: data["days"],
            type: modifiedValues,
            name: key,
            default: 1,
            isEnabled: true,
            val: 1,
        },
    };
};
const createChunkDependentTime = (
    key: string,
    val: unknown,
    duration: number,
    init: number
) => {
    // if key is in variableDependentTimeParams, then do anything
    if (variableDependentTimeParams.includes(key)) {
        // if params is string, it means params is a variable dependent time
        if (typeof val === "string") {
            return modifyChunkByTypeFunction(
                JSON.parse(val),
                key,
                duration,
                init
            );
        }
        if (_.isArray(val)) {
            return {
                [key]: val.map((v: unknown) => {
                    if (_.isString(v)) {
                        return modifyChunkByTypeFunction(
                            JSON.parse(v),
                            key,
                            duration,
                            init
                        )[key];
                    }
                    return {
                        rangeDays: [
                            [v["t_init"] ?? 0, v["t_end"] ?? duration ?? 1],
                        ],
                        type: [
                            {
                                name: "static",
                                value: v,
                            },
                        ],
                        name: key,
                        default: v,
                        isEnabled: false,
                        val: v,
                    };
                }),
            };
        }
        return {
            [key]: {
                rangeDays: [
                    [val["t_init"] ?? 0, val["t_end"] ?? duration ?? 1],
                ],
                type: [
                    {
                        name: "static",
                        value: val,
                    },
                ],
                name: key,
                default: val,
                isEnabled: false,
                val,
            },
        };
    }
    if (key === "title") {
        return { name_model: val ?? "Imported Model" };
    }
    // else, only format data for model context
    return { [key]: val };
};

/**
 * It takes a JSON object and returns a new JSON object with the same keys but with the values
 * transformed
 * @param {unknown} data - the data from the file
 * @returns An object with the following structure:
 * {
 *     "t_init": 0,
 *     "t_end": 100,
 *     "t_step": 1,
 *     "t_incubation": 5,
 *     "t_infectious": 5,
 *     "t_recovery_mild": 14,
 *     "t_recovery_
 */
export const prepareChunk = (data: unknown): EpidemicsData => {
    const duration = data["t_end"];
    const init = data["t_init"];
    // for each [key,value] format if key is in list (variableDependentTimeParams)
    const utilData = Object.entries(data).map(([key, valueParam]) => {
        return createChunkDependentTime(key, valueParam, duration, init);
    });
    return utilData.reduce((prev, current) => {
        const [key, valueUtil] = Object.entries(current)[0];
        const isVDT =
            variableDependentTimeParams.includes(key) &&
            !exceptionVDT.includes(key);
        return {
            ...prev,
            [key]: isVDT
                ? _.isArray(valueUtil)
                    ? valueUtil
                    : [valueUtil]
                : valueUtil,
        };
    }, SeirhbdChunkImport) as unknown as EpidemicsData;
    // return utilData.reduce(
    //     (prev, current) => ({ ...prev, ...current }),
    //     SeirhbdChunkImport
    // ) as unknown as EpidemicsData;
};
export const cleanInitialConditions = (
    data: TomlInitialConditions
): InitialConditions => {
    const keysNotUsedFromToml = ["I_det", "I_d_det", "I_ac_det"];
    return Object.entries(data)
        .filter(([key, valueKey]) => {
            return (
                ((key === "E" || key === "E_d") && valueKey) ||
                !keysNotUsedFromToml.includes(key)
            );
        })
        .reduce((acc, [key, val]) => {
            return {
                ...acc,
                [key]: val,
            };
        }, {}) as InitialConditions;
};
// export default createChunkDependentTime;
