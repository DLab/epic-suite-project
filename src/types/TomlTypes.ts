import { InitialConditions } from "./SimulationTypes";

export interface EpicConfigToml {
    title?: string;
    date?: string;
    user?: string;
    model: Model;
    data: DataModel;
    parameters: ParametersConfig;
    initialconditions: InitialConditions;
}

export interface Model {
    name: string;
    compartments: string[];
    id?: number;
    model: string;
    EDOs?: boolean;
    RBM?: boolean;
    RBM_N?: boolean;
}
export interface DataModel {
    initdate: string;
    country: string;
    state: string | string[];
    county: string | string[];
    healthservice: string;
    loc_name: string;
    geo_topology: string;
    datafile?: boolean;
    importdata?: boolean;
}
interface ParametersConfig {
    static: StaticParameters;
    dynamic: DynamicParameters;
}

export interface StaticParameters {
    t_init: string;
    t_end: number;
    mu: number | number[];
    timestep?: number;
    k_I?: number;
    k_R?: number;
    seroprevfactor?: number;
    populationfraction?: number;
    expinfection?: number;
    pI_det?: number;
    pIcr_det?: number;
    pIm_det?: number;
    pIv_det?: number;
}
export interface DynamicParameters {
    beta: string | number | Array<number | string>;
    alpha: string | number | Array<number | string>;
    Beta_v?: string | number | Array<number | string>;
    phi?: boolean;
    rR_S?: string | number;
    tE_I?: string | number;
    tI_R?: string | number;
    vac_d?: string | number | Array<number | string>;
    vac_eff?: string | number | Array<number | string>;
    pE_Im?: string | number | Array<number | string>;
    tE_Im?: string | number | Array<number | string>;
    pE_Icr?: string | number | Array<number | string>;
    tE_Icr?: string | number | Array<number | string>;
    tEv_Iv?: string | number | Array<number | string>;
    tIm_R?: string | number | Array<number | string>;
    tIcr_H?: string | number | Array<number | string>;
    pIv_R?: string | number | Array<number | string>;
    tIv_R?: string | number | Array<number | string>;
    pIv_H?: string | number | Array<number | string>;
    tIv_H?: string | number | Array<number | string>;
    pH_R?: string | number | Array<number | string>;
    tH_R?: string | number | Array<number | string>;
    pH_D?: string | number | Array<number | string>;
    tH_D?: string | number | Array<number | string>;
    pR_S?: string | number | Array<number | string>;
    tR_S?: string | number | Array<number | string>;
}
