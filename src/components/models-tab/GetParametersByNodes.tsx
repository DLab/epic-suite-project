import { EpidemicsData } from "types/ControlPanelTypes";
import { NameFunction } from "types/VariableDependentTime";

const paramsValues = {
    name_model: "Model 1",
    name: "SEIR",
    compartments: ["S", "E", "I", "R"],
    t_init: "",
    t_end: 500,
    pI_det: 1,
    beta: {
        rangeDays: [[0, 500]],
        type: [
            {
                name: NameFunction.static,
                value: 0.3,
            },
        ],
        name: "beta",
        default: 0.3,
        isEnabled: false,
        val: 0.3,
    },
    mu: 1.5,
    rR_S: {
        rangeDays: [[0, 500]],
        type: [
            {
                name: NameFunction.static,
                value: 0,
            },
        ],
        name: "rR_S",
        default: 0,
        isEnabled: false,
        val: 0,
    },
    alpha: {
        rangeDays: [[0, 500]],
        type: [
            {
                name: NameFunction.static,
                value: 1,
            },
        ],
        name: "alpha",
        default: 1,
        isEnabled: false,
        val: 1,
    },

    tE_I: {
        rangeDays: [[0, 500]],
        type: [
            {
                name: NameFunction.static,
                value: 4,
            },
        ],
        name: "tE_I",
        default: 5,
        isEnabled: false,
        val: 5,
    },
    tI_R: {
        rangeDays: [[0, 500]],
        type: [
            {
                name: NameFunction.static,
                value: 7,
            },
        ],
        name: "tI_R",
        default: 7,
        isEnabled: false,
        val: 7,
    },
    Beta_v: {
        rangeDays: [[0, 500]],
        type: [
            {
                name: NameFunction.static,
                value: 0.15,
            },
        ],
        name: "Beta_v",
        default: 1,
        isEnabled: false,
        val: 0.15,
    },
    vac_d: {
        rangeDays: [[0, 500]],
        type: [
            {
                name: NameFunction.static,
                value: 0,
            },
        ],
        name: "vac_d",
        default: 0,
        isEnabled: false,
        val: 0,
    },
    vac_eff: {
        rangeDays: [[0, 500]],
        type: [
            {
                name: NameFunction.static,
                value: 1,
            },
        ],
        name: "vac_eff",
        default: 1,
        isEnabled: false,
        val: 1,
    },

    pE_Im: {
        rangeDays: [[0, 500]],
        type: [
            {
                name: NameFunction.static,
                value: 0.85,
            },
        ],
        name: "pE_Im",
        default: 0.85,
        isEnabled: false,
        val: 0.85,
    },

    tE_Im: {
        rangeDays: [[0, 500]],
        type: [
            {
                name: NameFunction.static,
                value: 3,
            },
        ],
        name: "tE_Im",
        default: 3,
        isEnabled: false,
        val: 3,
    },

    pE_Icr: {
        rangeDays: [[0, 500]],
        type: [
            {
                name: NameFunction.static,
                value: 0.15,
            },
        ],
        name: "pE_Icr",
        default: 0.15,
        isEnabled: false,
        val: 0.15,
    },
    tE_Icr: {
        rangeDays: [[0, 500]],
        type: [
            {
                name: NameFunction.static,
                value: 3,
            },
        ],
        name: "tE_Icr",
        default: 3,
        isEnabled: false,
        val: 3,
    },
    tEv_Iv: {
        rangeDays: [[0, 500]],
        type: [
            {
                name: NameFunction.static,
                value: 3,
            },
        ],
        name: "tEv_Iv",
        default: 3,
        isEnabled: false,
        val: 3,
    },
    tIm_R: {
        rangeDays: [[0, 500]],
        type: [
            {
                name: NameFunction.static,
                value: 7,
            },
        ],
        name: "tIm_R",
        default: 7,
        isEnabled: false,
        val: 7,
    },
    tIcr_H: {
        rangeDays: [[0, 500]],
        type: [
            {
                name: NameFunction.static,
                value: 6,
            },
        ],
        name: "tIcr_H",
        default: 6,
        isEnabled: false,
        val: 6,
    },

    pIv_R: {
        rangeDays: [[0, 500]],
        type: [
            {
                name: NameFunction.static,
                value: 0.99,
            },
        ],
        name: "pIv_R",
        default: 0.99,
        isEnabled: false,
        val: 0.99,
    },

    tIv_R: {
        rangeDays: [[0, 500]],
        type: [
            {
                name: NameFunction.static,
                value: 7,
            },
        ],
        name: "tIv_R",
        default: 7,
        isEnabled: false,
        val: 7,
    },

    pIv_H: {
        rangeDays: [[0, 500]],
        type: [
            {
                name: NameFunction.static,
                value: 0.01,
            },
        ],
        name: "pIv_H",
        default: 0.01,
        isEnabled: false,
        val: 0.01,
    },

    tIv_H: {
        rangeDays: [[0, 500]],
        type: [
            {
                name: NameFunction.static,
                value: 7,
            },
        ],
        name: "tIv_H",
        default: 7,
        isEnabled: false,
        val: 7,
    },

    pH_R: {
        rangeDays: [[0, 500]],
        type: [
            {
                name: NameFunction.static,
                value: 0.99,
            },
        ],
        name: "pH_R",
        default: 0.99,
        isEnabled: false,
        val: 0.99,
    },
    tH_R: {
        rangeDays: [[0, 500]],
        type: [
            {
                name: NameFunction.static,
                value: 9,
            },
        ],
        name: "tH_R",
        default: 9,
        isEnabled: false,
        val: 9,
    },

    pH_D: {
        rangeDays: [[0, 500]],
        type: [
            {
                name: NameFunction.static,
                value: 0.01,
            },
        ],
        name: "pH_D",
        default: 0.01,
        isEnabled: false,
        val: 0.01,
    },

    tH_D: {
        rangeDays: [[0, 500]],
        type: [
            {
                name: NameFunction.static,
                value: 9,
            },
        ],
        name: "tH_D",
        default: 9,
        isEnabled: false,
        val: 9,
    },

    pR_S: {
        rangeDays: [[0, 500]],
        type: [
            {
                name: NameFunction.static,
                value: 0,
            },
        ],
        name: "pR_S",
        default: 0,
        isEnabled: false,
        val: 0,
    },

    tR_S: {
        rangeDays: [[0, 500]],
        type: [
            {
                name: NameFunction.static,
                value: 60,
            },
        ],
        name: "tR_S",
        default: 60,
        isEnabled: false,
        val: 60,
    },
    population: 100000,
    populationfraction: 1,
    pIcr_det: 1,
    pIm_det: 1,
    pIv_det: 1,
};

/**
 * Returns all the information of each of the nodes that make up the model.
 * @param {string} name model name.
 * @param {string} modelValue compartments.
 * @param {string} startDate model start day.
 * @param {string[]} nodesValues node name list.
 * @returns {EpidemicsData}
 */
const getArrayParametersByNode = (
    name,
    modelValue,
    startDate,
    nodesValues
): EpidemicsData => {
    return {
        name_model: name,
        name: modelValue,
        compartments: Array.from(modelValue),
        t_init: `${startDate}`,
        t_end: 500,
        pI_det: 1,
        beta: new Array(nodesValues.length).fill(paramsValues.beta),
        mu: new Array(nodesValues.length).fill(paramsValues.mu),
        rR_S: {
            rangeDays: [[0, 500]],
            type: [
                {
                    name: NameFunction.static,
                    value: 0,
                },
            ],
            name: "rR_S",
            default: 0,
            isEnabled: false,
            val: 0,
        },
        alpha: new Array(nodesValues.length).fill(paramsValues.alpha),
        tE_I: {
            rangeDays: [[0, 500]],
            type: [
                {
                    name: NameFunction.static,
                    value: 4,
                },
            ],
            name: "tE_I",
            default: 5,
            isEnabled: false,
            val: 5,
        },
        tI_R: {
            rangeDays: [[0, 500]],
            type: [
                {
                    name: NameFunction.static,
                    value: 7,
                },
            ],
            name: "tI_R",
            default: 7,
            isEnabled: false,
            val: 7,
        },
        Beta_v: new Array(nodesValues.length).fill(paramsValues.Beta_v),
        vac_d: new Array(nodesValues.length).fill(paramsValues.vac_d),
        vac_eff: new Array(nodesValues.length).fill(paramsValues.vac_eff),
        pE_Im: new Array(nodesValues.length).fill(paramsValues.pE_Im),
        tE_Im: new Array(nodesValues.length).fill(paramsValues.tE_Im),
        pE_Icr: new Array(nodesValues.length).fill(paramsValues.pE_Icr),
        tE_Icr: new Array(nodesValues.length).fill(paramsValues.tE_Icr),
        tEv_Iv: new Array(nodesValues.length).fill(paramsValues.tEv_Iv),
        tIm_R: new Array(nodesValues.length).fill(paramsValues.tIm_R),
        tIcr_H: new Array(nodesValues.length).fill(paramsValues.tIcr_H),
        pIv_R: new Array(nodesValues.length).fill(paramsValues.pIv_R),
        tIv_R: new Array(nodesValues.length).fill(paramsValues.tIv_R),
        pIv_H: new Array(nodesValues.length).fill(paramsValues.pIv_H),
        tIv_H: new Array(nodesValues.length).fill(paramsValues.tIv_H),
        pH_R: new Array(nodesValues.length).fill(paramsValues.pH_R),
        tH_R: new Array(nodesValues.length).fill(paramsValues.tH_R),
        pH_D: new Array(nodesValues.length).fill(paramsValues.pH_D),
        tH_D: new Array(nodesValues.length).fill(paramsValues.tH_D),
        pR_S: new Array(nodesValues.length).fill(paramsValues.pR_S),
        tR_S: new Array(nodesValues.length).fill(paramsValues.tR_S),
        population: 100000,
        populationfraction: 1,
        pIcr_det: 1,
        pIm_det: 1,
        pIv_det: 1,
    };
};

/**
 * It gives all the information to be able to save an adjusted model.
 * @param {EpidemicsData} originalParamsValue parameter values before being adjusted.
 * @param {Object} fittedData adjusted parameter values.
 * @returns {EpidemicsData}
 */
export const getParametersFitModel = (
    originalParamsValue,
    fittedData
): EpidemicsData => {
    const lengthData = Object.keys(fittedData.I).length;
    const parseParmDays = JSON.parse(fittedData.beta_days);
    const rangeArray = [0, ...parseParmDays, lengthData];

    let rangeDays = [];
    for (let i = 0; i < rangeArray.length - 1; i += 1) {
        rangeDays = [...rangeDays, [rangeArray[i], rangeArray[i + 1]]];
    }

    const fitBetaValue = {
        default: originalParamsValue.beta[0].default,
        isEnabled: true,
        name: "beta",
        rangeDays,
        type: JSON.parse(fittedData.beta).map((val: number) => {
            return {
                name: "static",
                value: val,
            };
        }),
        val: 0.3,
    };

    return {
        name_model: originalParamsValue.name,
        name: originalParamsValue.name,
        compartments: originalParamsValue.compartments,
        t_init: originalParamsValue.startDate,
        t_end: originalParamsValue.t_end,
        pI_det: originalParamsValue.pI_det,
        beta: [fitBetaValue],
        mu: [fittedData.mu],
        rR_S: originalParamsValue.rR_S,
        alpha: originalParamsValue.alpha,
        tE_I: originalParamsValue.tE_I,
        tI_R: originalParamsValue.tI_R,
        Beta_v: originalParamsValue.Beta_v,
        vac_d: originalParamsValue.vac_d,
        vac_eff: originalParamsValue.vac_eff,
        pE_Im: originalParamsValue.pE_Im,
        tE_Im: originalParamsValue.tE_Im,
        pE_Icr: originalParamsValue.pE_Icr,
        tE_Icr: originalParamsValue.tE_Icr,
        tEv_Iv: originalParamsValue.tEv_Iv,
        tIm_R: originalParamsValue.tIm_R,
        tIcr_H: originalParamsValue.tIcr_H,
        pIv_R: originalParamsValue.pIv_R,
        tIv_R: originalParamsValue.tIv_R,
        pIv_H: originalParamsValue.pIv_H,
        tIv_H: originalParamsValue.tIv_H,
        pH_R: originalParamsValue.pH_R,
        tH_R: originalParamsValue.tH_R,
        pH_D: originalParamsValue.pH_D,
        tH_D: originalParamsValue.tH_D,
        pR_S: originalParamsValue.pR_S,
        tR_S: originalParamsValue.tR_S,
        population: originalParamsValue.population,
        populationfraction: originalParamsValue.populationfraction,
        pIcr_det: originalParamsValue.pIcr_det,
        pIm_det: originalParamsValue.pIm_det,
        pIv_det: originalParamsValue.pIv_det,
    };
};

export default getArrayParametersByNode;
