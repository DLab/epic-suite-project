import type {
    EpidemicsData,
    ActionsEpidemicData,
} from "types/ControlPanelTypes";
import { NameFunction } from "types/VariableDependentTime";

export const initialState: EpidemicsData = {
    name_model: "Model 1",
    name: "SEIR",
    compartments: ["S", "E", "I", "R"],
    t_init: "",
    t_end: 500,
    pI_det: 1,
    beta: [
        {
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
    ],
    mu: [1.5],
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

    alpha: [
        {
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
    ],
    tE_I: {
        rangeDays: [[0, 500]],
        type: [
            {
                name: NameFunction.static,
                value: 4,
            },
        ],
        name: "tE_I",
        default: 4,
        isEnabled: false,
        val: 0.3,
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

    Beta_v: [
        {
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
    ],
    vac_d: [
        {
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
    ],
    vac_eff: [
        {
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
    ],
    pE_Im: [
        {
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
    ],
    tE_Im: [
        {
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
    ],
    pE_Icr: [
        {
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
    ],
    tE_Icr: [
        {
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
    ],
    tEv_Iv: [
        {
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
    ],
    tIm_R: [
        {
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
    ],
    tIcr_H: [
        {
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
    ],
    pIv_R: [
        {
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
    ],
    tIv_R: [
        {
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
    ],
    pIv_H: [
        {
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
    ],
    tIv_H: [
        {
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
    ],
    pH_R: [
        {
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
    ],
    tH_R: [
        {
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
    ],
    pH_D: [
        {
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
    ],
    tH_D: [
        {
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
    ],
    pR_S: [
        {
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
    ],
    tR_S: [
        {
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
    ],
    population: 100000,
    populationfraction: 1,
    pIcr_det: 1,
    pIm_det: 1,
    pIv_det: 1,
};
const reducerControlPanel = (
    old_state: EpidemicsData | undefined,
    action: ActionsEpidemicData
) => {
    const state = old_state || initialState;
    if (action.type === "set") {
        if (action.positionVariableDependentTime >= 0) {
            const newState = {
                ...state,
            };
            newState[action.target][action.positionVariableDependentTime] =
                action.payload;
            return newState;
        }
        return {
            ...state,
            [action.target]: action.payload,
        };
    }
    if (action.type === "setVariableDependent") {
        if (action.positionVariableDependentTime >= 0) {
            const newState = {
                ...state,
            };
            newState[action.target][action.positionVariableDependentTime] =
                action.payloadVariableDependent;
            return newState;
        }
        return {
            ...state,
            [action.target]: action.payloadVariableDependent,
        };
    }
    if (action.type === "update") {
        return action.updateData;
    }
    if (action.type === "switch") {
        if (action.positionVariableDependentTime >= 0) {
            const newState = {
                ...state,
            };
            newState[action.target][action.positionVariableDependentTime] = {
                ...newState[action.target][
                    action.positionVariableDependentTime
                ],
                isEnabled: action.switch,
            };
            return newState;
        }
        return {
            ...state,
            [action.target]: {
                ...state[action.target],
                isEnabled: action.switch,
            },
        };
    }
    return state;
};

export default reducerControlPanel;
