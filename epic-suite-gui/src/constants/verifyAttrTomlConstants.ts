import countiesData from "data/counties.json";
import statesData from "data/states.json";
import type { Fields } from "types/importTypes";

export const TYPEMODEL = ["sir", "seir", "seirhvd"];
export const TYPECOMPARTMENTS = {
    sir: ["S", "I", "R"],
    seir: ["S", "E", "I", "R"],
    seirhvd: ["S", "S_v", "E", "E_v", "Im", "Icr", "Iv", "R", "H", "D"],
};
export const MAINKEYS: Fields = {
    must: ["model", "data", "parameters", "initialconditions"],
    optional: ["title", "date", "user"],
};
export const MODELKEYS: Fields = {
    must: ["name", "compartments", "model"],
    type: ["string", "array"],
    optional: ["EDOs", "RBM", "RBM_N"],
};
export const DATAKEYS: Fields = {
    must: [
        "initdate",
        "country",
        "state",
        "county",
        "healthservice",
        "loc_name",
        "geo_topology",
    ],
    optional: ["datafile", "importdata"],
};
export const INITIALCONDITIONSKEYS: Fields = {
    must: ["population", "I", "I_d", "I_ac", "R"],
    // seir: ["E"],
    seirhvd: [
        "H",
        // "H_d",
        // "H_ac",
        // "H_cap,",
        // "Iv",
        "Iv_d",
        "Iv_ac",
        // "V",
        // "V_ac",
        "D",
        // "D_d",
        // "D_ac",
    ],
};
export const STATICKEYS: Fields = {
    must: ["t_init", "t_end", "mu"],
    optional: ["timestep", "k_I", "k_R", "seroprevfactor", "expinfection"],
    seir: ["pI_det"],
    seirhvd: ["pIcr_det", "pIm_det", "pIv_det", "populationfraction"],
};

export const DYNAMICKEYS: Fields = {
    must: ["beta", "alpha"],
    seir: ["rR_S", "tE_I", "tI_R"],
    seirhvd: [
        "Beta_v",
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
    ],
};
export const REGEXTRANSITIONFUNCTION = /(static|square|sine|transition)/gi;
export const REGEXTYPEMODEL = /(sir|seirhvd|seir)/gi;
export const COUNTYCODES = countiesData.data.map((county) => county[5]);
export const COUNTYNAMES = countiesData.data.map((county) => `${county[7]}`);
export const STATECODES = statesData.data.map((state) => state[0]);
export const STATENAMES = statesData.data.map((state) => `${state[2]}`);

export const EVENTFUNCTION = {
    must: ["function", "values", "days"],
    values: {
        must: ["min_val", "max_val", "function"],
        sine: ["period", "initPhase"],
        square: ["period", "duty", "initPhase"],
        transition: {
            must: ["t_init", "t_end", "type"],
            quadratic: ["concavity"],
        },
    },
};
export const TYPESEVENTFUNCTION = {
    min_val: "number",
    max_val: "number",
    t_init: "number",
    function: "string",
    t_end: "number",
    period: "number",
    duty: "",
    concavity: "boolean",
    type: "string",
    initPhase: "boolean",
};
