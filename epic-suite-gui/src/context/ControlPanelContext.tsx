import { string } from "prop-types";
import { createContext, useReducer, useState } from "react";

import {
    ActionsEpidemicData,
    Model,
    EpidemicsData,
    ActionsInitialConditions,
    InitialConditions,
    EpidemicAttributes,
    DescriptionParameters,
} from "types/ControlPanelTypes";
import VariableDependentTime, {
    NameFunction,
} from "types/VariableDependentTime";

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

const descriptionParameters: DescriptionParameters = {
    name_model: {
        description: "",
        values: {
            min: 0,
            max: 1,
            default: 1,
            step: 0,
        },
        alias: "Name Model",
    },
    name: {
        description: "",
        values: {
            min: 0,
            max: 1,
            default: 1,
            step: 0,
        },
        alias: "",
    },
    compartments: {
        description: "",
        values: {
            min: 0,
            max: 1,
            default: 1,
            step: 0,
        },
        alias: "Compartments",
    },
    t_init: {
        description: "",
        values: {
            min: 0,
            max: 1,
            default: 0,
            step: 0,
        },
        alias: "T init",
    },
    t_end: {
        description: "",
        values: {
            min: 0,
            max: Infinity,
            default: 1,
            step: 1,
        },
        alias: "Duration",
    },
    pI_det: {
        description: "Underreport",
        values: {
            min: 0,
            max: 1,
            default: 1,
            step: 0.01,
        },
        alias: "pI_det",
    },
    beta: {
        description: "Infection rate",
        values: {
            min: 0,
            max: 1,
            default: 0.2,
            step: 0.01,
        },
        alias: "Beta (β)",
    },
    mu: {
        description: "Exposed/Infected Initial rate",
        values: {
            min: 0,
            max: 20,
            default: 1,
            step: 0.01,
        },
        alias: "Mu (μ)",
    },
    rR_S: {
        description: "Average immunity loss rate",
        values: {
            min: 0,
            max: Infinity,
            default: 1,
            step: 0.01,
        },
        alias: "rR_S",
    },

    alpha: {
        description: "Mobility",
        values: {
            min: 0,
            max: 1,
            default: 1,
            step: 0.01,
        },
        alias: "Alpha (α)",
    },
    tE_I: {
        description: "Transition time between exposed and infectious",
        values: {
            min: 0,
            max: Infinity,
            default: 1,
            step: 1,
        },
        alias: "tE_I",
    },

    tI_R: {
        description: "Transition time between infectious and removed",
        values: {
            min: 0,
            max: Infinity,
            default: 1,
            step: 1,
        },
        alias: "tI_R",
    },

    Beta_v: {
        description: "Vaccinated infected Infection rate",
        values: {
            min: 0,
            max: 1,
            default: 1,
            step: 0.01,
        },
        alias: "Beta_v",
    },
    vac_d: {
        description: "Amount of vaccinated people per day",
        values: {
            min: 0,
            max: Infinity,
            default: 1,
            step: 1,
        },
        alias: "vac_d",
    },
    vac_eff: {
        description: "Vaccine effectivity",
        values: {
            min: 0,
            max: 1,
            default: 1,
            step: 0.05,
        },
        alias: "vac_eff",
    },
    pE_Im: {
        description: "Fraction of E that turn into Im",
        values: {
            min: 0,
            max: 1,
            default: 1,
            step: 0.01,
        },
        alias: "pE_Im",
    },
    tE_Im: {
        description: "Transition time between E and Im",
        values: {
            min: 0.01,
            max: Infinity,
            default: 1,
            step: 0.1,
        },
        alias: "tE_Im",
    },
    pE_Icr: {
        description: "Fraction of E that turn into Icr",
        values: {
            min: 0,
            max: 1,
            default: 1,
            step: 0.01,
        },
        alias: "pE_Icr",
    },
    tE_Icr: {
        description: "Transition time between E and Icr",
        values: {
            min: 0.01,
            max: Infinity,
            default: 1,
            step: 0.1,
        },
        alias: "tE_Icr",
    },
    tEv_Iv: {
        description: "Transition time between Ev and Iv",
        values: {
            min: 0.01,
            max: Infinity,
            default: 1,
            step: 0.1,
        },
        alias: "tEv_Iv",
    },
    tIm_R: {
        description: "Transition time between Im and R",
        values: {
            min: 0.01,
            max: Infinity,
            default: 1,
            step: 0.1,
        },
        alias: "tIm_R",
    },
    tIcr_H: {
        description: "Transition time between Icr and H",
        values: {
            min: 0.01,
            max: Infinity,
            default: 1,
            step: 0.1,
        },
        alias: "tIcr_H",
    },
    pIv_R: {
        description: "Fraction of Iv that turn into R",
        values: {
            min: 0,
            max: 1,
            default: 1,
            step: 0.01,
        },
        alias: "pIv_R",
    },
    tIv_R: {
        description: "Transition time between Iv and R",
        values: {
            min: 0.01,
            max: Infinity,
            default: 1,
            step: 0.1,
        },
        alias: "tIv_R",
    },
    pIv_H: {
        description: "Fraction of Iv that turn into H",
        values: {
            min: 0,
            max: 1,
            default: 1,
            step: 0.01,
        },
        alias: "pIv_H",
    },
    tIv_H: {
        description: "Transition time between Iv and H",
        values: {
            min: 0.01,
            max: Infinity,
            default: 1,
            step: 0.1,
        },
        alias: "tIv_H",
    },
    pH_R: {
        description: "Fraction of H that turn into R",
        values: {
            min: 0,
            max: 1,
            default: 1,
            step: 0.01,
        },
        alias: "pH_R",
    },
    tH_R: {
        description: "Transition time between H and R",
        values: {
            min: 0.01,
            max: Infinity,
            default: 1,
            step: 0.1,
        },
        alias: "tH_R",
    },
    pH_D: {
        description: "Fraction of H that turn into D",
        values: {
            min: 0,
            max: 1,
            default: 1,
            step: 0.01,
        },
        alias: "pH_D",
    },
    tH_D: {
        description: "Transition time between H and D",
        values: {
            min: 0,
            max: 1,
            default: 1,
            step: 0,
        },
        alias: "tH_D",
    },
    pR_S: {
        description: "Existence of immunity loss",
        values: {
            isTrue: 0,
        },
        alias: "pR_S",
    },
    tR_S: {
        description: "Transition time between R and S",
        values: {
            min: 0,
            max: 1,
            default: 1,
            step: 0,
        },
        alias: "tR_S",
    },
    population: {
        description: "",
        values: {
            min: 0,
            max: 1,
            default: 1,
            step: 0,
        },
        alias: "Population",
    },
    populationfraction: {
        description: "Population at the beginning of the simulation",
        values: {
            min: 0,
            max: 1,
            default: 1,
            step: 0.01,
        },
        alias: "Population Fraction",
    },
    pIcr_det: {
        description: "Subreport Icr",
        values: {
            min: 0,
            max: 1,
            default: 1,
            step: 0,
        },
        alias: "pIcr_det",
    },
    pIm_det: {
        description: "Subreport Im",
        values: {
            min: 0,
            max: 1,
            default: 1,
            step: 0,
        },
        alias: "pIcr_det",
    },
    pIv_det: {
        description: "Subreport Iv",
        values: {
            min: 0,
            max: 1,
            default: 1,
            step: 0,
        },
        alias: "pIv_vet",
    },
};

const initialConditions: InitialConditions = {
    population: 0,
    R: 0,
    I: 0,
    I_d: 0,
    I_ac: 0,
    E: 0,
    H: 0,
    H_acum: 0,
    V: 0,
    V_acum: 0,
    D: 0,
    D_acum: 0,
    Iv: 10,
    Iv_d: 2,
    Iv_ac: 20,
    H_cap: 2000,
    H_d: 1,
    D_d: 0,
};
const initDataViewVariable: VariableDependentTime = {
    rangeDays: [[0, 500]],
    type: [{ name: NameFunction.static, value: 0 }],
    name: "nothing",
    default: 0.3,
    isEnabled: false,
    val: 0.3,
};
export const ControlPanel = createContext<EpidemicAttributes>({
    mode: Model.Add,
    setMode: () => {},
    parameters: initialState,
    setParameters: () => {},
    description: descriptionParameters,
    dataViewVariable: initDataViewVariable,
    setDataViewVariable: () => {},
    idModelUpdate: 0,
    setIdModelUpdate: () => {},
    initialConditions,
    setInitialConditions: () => {},
    idSimulation: 0,
    setIdSimulation: () => {},
});

// eslint-disable-next-line react/prop-types
const ControlPanelContext: React.FC = ({ children }) => {
    const initialStateRed: EpidemicsData = initialState;

    const reducerControlPanel = (
        state: EpidemicsData,
        action: ActionsEpidemicData
    ) => {
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
                newState[action.target][action.positionVariableDependentTime] =
                    {
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

    const reducerInitCond = (
        state: InitialConditions,
        actions: ActionsInitialConditions
    ) => {
        switch (actions.type) {
            case "set":
                return {
                    ...state,
                    [actions.target]: actions.payload,
                };
            case "real-conditions":
                return actions.real;
            default:
                return state;
        }
    };

    const [initCond, setInitCond] = useReducer(
        reducerInitCond,
        initialConditions
    );
    const [params, setParameters] = useReducer(
        reducerControlPanel,
        initialStateRed
    );
    const [mode, setMode] = useState<Model>(Model.Add);
    const [idModelUpdate, setIdModelUpdate] = useState(0);
    const [idSimulation, setIdSimulation] = useState(0);
    const [dataViewVariable, setDataViewVariable] =
        useState<VariableDependentTime>(initDataViewVariable);
    return (
        <ControlPanel.Provider
            value={{
                dataViewVariable,
                setDataViewVariable,
                parameters: params,
                setParameters,
                description: descriptionParameters,
                mode,
                setMode,
                idModelUpdate,
                setIdModelUpdate,
                initialConditions: initCond,
                setInitialConditions: setInitCond,
                idSimulation,
                setIdSimulation,
            }}
        >
            {children}
        </ControlPanel.Provider>
    );
};

export default ControlPanelContext;
