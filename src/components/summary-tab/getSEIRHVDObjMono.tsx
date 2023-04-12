/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */

import type VariableDependentTime from "types/VariableDependentTime";
import type {
    Sine,
    Square,
    StaticValue,
    Transition,
} from "types/VariableDependentTime";
import { NameFunction } from "types/VariableDependentTime";

const createObjectVariableDependent = (params: VariableDependentTime) => {
    const variableDependent = {
        function: "events",
        values: [],
        days: [],
        default: params.default,
    };
    params.type.forEach((p: Sine | Square | Transition | StaticValue, i) => {
        variableDependent.days.push(params.rangeDays[i]);
        switch (p.name) {
            case NameFunction.sinusoidal:
                variableDependent.values.push({
                    function: "sine",
                    min_val: p["min"],
                    max_val: p["max"],
                    period: p["period"],
                    initphase: p["initPhase"],
                });
                break;
            case NameFunction.square:
                variableDependent.values.push({
                    function: "square",
                    min_val: p["min"],
                    max_val: p["max"],
                    period: p["period"],
                    initphase: p["initPhase"],
                    duty: p["duty"],
                    t_init: params.rangeDays[i][0],
                    t_end: params.rangeDays[i][1],
                });
                break;
            default:
                variableDependent.values.push(p["value"]);
                break;
        }
    });
    return variableDependent;
};

/**
 * Provides data for SEIRHVD type models.
 * @param {NewModelsAllParams[]} e
 * @param {EpidemicsData} modelParameters
 * @param scale geographic scale of the model.
 * @param featureSelected fips of geographic areas selected in the model.
 * @returns {Object}
 */
const getSEIRHVDObjMono = (e, modelParameters, scale, featureSelected) => {
    return {
        idSim: e.idNewModel,
        model: {
            model: modelParameters.name,
            name: modelParameters.name,
            compartments: modelParameters.compartments,
        },
        data: {
            datafile: false,
            importdata: false,
            initdate: "2020-03-22",
            country: "USA",
            state: scale === "States" ? featureSelected : "",
            county: scale === "Counties" ? featureSelected : "",
            healthservice: "",
            loc_name: "",
        },
        parameters: {
            static: {
                t_init: 0,
                t_end: +modelParameters.t_end,
                mu: +modelParameters.mu[0],
                populationfraction: +modelParameters.populationfraction,
            },
            dynamic: {
                beta: !modelParameters.beta[0].isEnabled
                    ? +modelParameters.beta[0].val
                    : createObjectVariableDependent(modelParameters.beta[0]),
                alpha: !modelParameters.alpha[0].isEnabled
                    ? +modelParameters.alpha[0].val
                    : createObjectVariableDependent(modelParameters.alpha[0]),
                tE_I: !modelParameters.tE_I.isEnabled
                    ? +modelParameters.tE_I.val
                    : createObjectVariableDependent(modelParameters.tE_I),
                tI_R: !modelParameters.tI_R.isEnabled
                    ? +modelParameters.tI_R.val
                    : createObjectVariableDependent(modelParameters.tI_R),
                rR_S: !modelParameters.rR_S.isEnabled
                    ? +modelParameters.rR_S.val
                    : createObjectVariableDependent(modelParameters.rR_S),
                beta_v: !modelParameters.Beta_v[0].isEnabled
                    ? +modelParameters.Beta_v[0].val
                    : createObjectVariableDependent(modelParameters.Beta_v[0]),
                vac_d: !modelParameters.vac_d[0].isEnabled
                    ? +modelParameters.vac_d[0].val
                    : createObjectVariableDependent(modelParameters.vac_d[0]),
                vac_eff: !modelParameters.vac_eff[0].isEnabled
                    ? +modelParameters.vac_eff[0].val
                    : createObjectVariableDependent(modelParameters.vac_eff[0]),
                pE_Im: !modelParameters.pE_Im[0].isEnabled
                    ? +modelParameters.pE_Im[0].val
                    : createObjectVariableDependent(modelParameters.pE_Im[0]),
                tE_Im: !modelParameters.tE_Im[0].isEnabled
                    ? +modelParameters.tE_Im[0].val
                    : createObjectVariableDependent(modelParameters.tE_Im[0]),
                pE_Icr: !modelParameters.pE_Icr[0].isEnabled
                    ? +modelParameters.pE_Icr[0].val
                    : createObjectVariableDependent(modelParameters.pE_Icr[0]),
                tE_Icr: !modelParameters.tE_Icr[0].isEnabled
                    ? +modelParameters.tE_Icr[0].val
                    : createObjectVariableDependent(modelParameters.tE_Icr[0]),
                tEv_Iv: !modelParameters.tEv_Iv[0].isEnabled
                    ? +modelParameters.tEv_Iv[0].val
                    : createObjectVariableDependent(modelParameters.tEv_Iv[0]),
                tIm_R: !modelParameters.tIm_R[0].isEnabled
                    ? +modelParameters.tIm_R[0].val
                    : createObjectVariableDependent(modelParameters.tIm_R[0]),
                tIcr_H: !modelParameters.tIcr_H[0].isEnabled
                    ? +modelParameters.tIcr_H[0].val
                    : createObjectVariableDependent(modelParameters.tIcr_H[0]),
                pIv_R: !modelParameters.pIv_R[0].isEnabled
                    ? +modelParameters.pIv_R[0].val
                    : createObjectVariableDependent(modelParameters.pIv_R[0]),
                tIv_R: !modelParameters.tIv_R[0].isEnabled
                    ? +modelParameters.tIv_R[0].val
                    : createObjectVariableDependent(modelParameters.tIv_R[0]),
                pIv_H: !modelParameters.pIv_H[0].isEnabled
                    ? +modelParameters.pIv_H[0].val
                    : createObjectVariableDependent(modelParameters.pIv_H[0]),
                tIv_H: !modelParameters.tIv_H[0].isEnabled
                    ? +modelParameters.tIv_H[0].val
                    : createObjectVariableDependent(modelParameters.tIv_H[0]),
                pH_R: !modelParameters.pH_R[0].isEnabled
                    ? +modelParameters.pH_R[0].val
                    : createObjectVariableDependent(modelParameters.pH_R[0]),
                tH_R: !modelParameters.tH_R[0].isEnabled
                    ? +modelParameters.tH_R[0].val
                    : createObjectVariableDependent(modelParameters.tH_R[0]),
                pH_D: !modelParameters.pH_D[0].isEnabled
                    ? +modelParameters.pH_D[0].val
                    : createObjectVariableDependent(modelParameters.pH_D[0]),
                tH_D: !modelParameters.tH_D[0].isEnabled
                    ? +modelParameters.tH_D[0].val
                    : createObjectVariableDependent(modelParameters.tH_D[0]),
                pR_S: !modelParameters.pR_S[0].isEnabled
                    ? +modelParameters.pR_S[0].val
                    : createObjectVariableDependent(modelParameters.pR_S[0]),
                tR_S: !modelParameters.tR_S[0].isEnabled
                    ? +modelParameters.tR_S[0].val
                    : createObjectVariableDependent(modelParameters.tR_S[0]),
                pI_det: +modelParameters.pI_det,
                pIcr_det: +modelParameters.pIcr_det,
                pIm_det: +modelParameters.pIm_det,
                pIv_det: +modelParameters.pIv_det,
            },
        },
        initialconditions: {
            I: +e.initialConditions[0].conditionsValues.I,
            I_d: +e.initialConditions[0].conditionsValues.I_d,
            I_ac: +e.initialConditions[0].conditionsValues.I_ac,
            population: +e.initialConditions[0].conditionsValues.population,
            R: +e.initialConditions[0].conditionsValues.R,
            Iv_d: +e.initialConditions[0].conditionsValues.Iv_d,
            Iv_ac: +e.initialConditions[0].conditionsValues.Iv_ac,
            H: +e.initialConditions[0].conditionsValues.H,
            H_d: +e.initialConditions[0].conditionsValues.H_d,
            D: +e.initialConditions[0].conditionsValues.D,
            D_d: +e.initialConditions[0].conditionsValues.D_d,
            H_cap: +e.initialConditions[0].conditionsValues.H_cap,
            Iv: +e.initialConditions[0].conditionsValues.Iv,
            Sv: +e.initialConditions[0].conditionsValues.Sv,
        },
    };
};

export default getSEIRHVDObjMono;
