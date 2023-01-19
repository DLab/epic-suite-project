import VariableDependentTime from "./VariableDependentTime";

// Updated into ActionsEpidemicData payload: add string[] type
export interface ActionsEpidemicData {
    type: string;
    payload?: string | number | EpidemicsData | string[];
    payloadVariableDependent?: VariableDependentTime;
    positionVariableDependentTime?: number;
    target?: string;
    updateData?: EpidemicsData;
    switch?: boolean;
}

export enum Model {
    Update = "Update",
    Add = "Add",
    Initial = "Initial",
}

export interface EpidemicsData {
    name_model: string;
    name: string;
    compartments?: string[];
    t_init: string;
    t_end: number;
    pI_det: number;
    beta: VariableDependentTime[];
    Beta_v?: VariableDependentTime[];
    mu: number[];
    rR_S: VariableDependentTime;
    alpha: VariableDependentTime[];
    tE_I?: VariableDependentTime;
    tI_R: VariableDependentTime;
    population: number;
    populationfraction?: number;
    pIcr_det?: number;
    pIm_det?: number;
    pIv_det?: number;
    vac_d?: VariableDependentTime[];
    vac_eff?: VariableDependentTime[];
    pE_Im?: VariableDependentTime[];
    tE_Im?: VariableDependentTime[];
    pE_Icr?: VariableDependentTime[];
    tE_Icr?: VariableDependentTime[];
    tEv_Iv?: VariableDependentTime[];
    tIm_R?: VariableDependentTime[];
    tIcr_H?: VariableDependentTime[];
    pIv_R?: VariableDependentTime[];
    tIv_R?: VariableDependentTime[];
    pIv_H?: VariableDependentTime[];
    tIv_H?: VariableDependentTime[];
    pH_R?: VariableDependentTime[];
    tH_R?: VariableDependentTime[];
    pH_D?: VariableDependentTime[];
    tH_D?: VariableDependentTime[];
    pR_S?: VariableDependentTime[];
    tR_S?: VariableDependentTime[];
}

// actions
export interface ActionsInitialConditions {
    type: string;
    payload?: number;
    target?: string;
    real?: InitialConditions;
}
// initialConditions
export interface InitialConditions {
    population?: number;
    R?: number;
    I?: number;
    I_d?: number;
    I_ac?: number;
    E?: number;
    H?: number;
    H_acum?: number;
    V?: number;
    V_acum?: number;
    D?: number;
    D_acum?: number;
    Iv?: number;
    Iv_d?: number;
    Iv_ac?: number;
    H_cap?: number;
    H_d?: number;
    D_d?: number;
    Sv?: number;
}

export interface InitialConditionsNewModel {
    name: string;
    conditionsValues: InitialConditions;
}

// types for Description Parameters Object
export type OptionDetails<Type> = {
    [Property in keyof Type]: DetailDescription;
};
export type DetailDescription = {
    description: string;
    values: Record<string, number>;
    alias: string;
};
export type DescriptionParameters = OptionDetails<EpidemicsData>;

// Context Attr.
export interface EpidemicAttributes {
    mode: Model;
    parameters?: EpidemicsData;
    description: DescriptionParameters;
    setParameters: (values: ActionsEpidemicData) => void;
    dataViewVariable: VariableDependentTime;
    setDataViewVariable: (dataView: VariableDependentTime) => void;
    setMode: (value: Model) => void;
    idModelUpdate: number;
    setIdModelUpdate: (value: number) => void;
    initialConditions: InitialConditions;
    setInitialConditions: (value: ActionsInitialConditions) => void;
    idSimulation: number;
    setIdSimulation: (value: number) => void;
}
