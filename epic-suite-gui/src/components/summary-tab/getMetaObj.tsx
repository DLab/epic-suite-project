/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */

import VariableDependentTime, {
    NameFunction,
    Sine,
    Square,
    StaticValue,
    Transition,
} from "types/VariableDependentTime";

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

const initialConditionsArray = (initCondModel, param) => {
    return initCondModel.map((initCond) => {
        return +initCond.conditionsValues[param];
    });
};

const getParametersArray = (parametersValue) => {
    return parametersValue.map((param) => {
        return !param.isEnabled
            ? +param.val
            : createObjectVariableDependent(param);
        // return +initCond.conditionsValues[param];
    });
};

/**
 * It provides the data for the metapopulation models.
 * @param  {NewModelsAllParams[]} model
 * @returns {Object}
 */
const getMetaObj = (model, scale, featureSelected) => {
    return {
        // idSim: model.idNewModel,
        model: {
            model: "SEIRMETA",
            id: model.idNewModel,
            name: model.parameters.name,
            compartments: model.parameters.compartments,
            EDOs: true,
            RBM: false,
            RBM_N: 1,
        },
        data: {
            datafile: false,
            importdata: false,
            initdate: "",
            country: "USA",
            state: scale === "States" ? featureSelected : "",
            county: scale === "Counties" ? featureSelected : "",
            healthservice: "",
            loc_name: "",
            geo_topology: "meta",
        },
        parameters: {
            static: {
                t_init: 0,
                t_end: +model.parameters.t_end,
                mu: model.parameters.mu,
                pI_det: +model.parameters.pI_det,
                // populationfraction: +model.parameters.populationfraction,
                k_I: 0,
                k_R: 0,
            },
            dynamic: {
                beta: getParametersArray(model.parameters.beta),
                alpha: getParametersArray(model.parameters.alpha),
                Phi: false,
                tE_I: !model.parameters.tE_I.isEnabled
                    ? +model.parameters.tE_I.val
                    : createObjectVariableDependent(model.parameters.tE_I),
                tI_R: !model.parameters.tI_R.isEnabled
                    ? +model.parameters.tI_R.val
                    : createObjectVariableDependent(model.parameters.tI_R),
                rR_S: !model.parameters.rR_S.isEnabled
                    ? +model.parameters.rR_S.val
                    : createObjectVariableDependent(model.parameters.rR_S),
                // beta_v: !model.parameters.Beta_v[0].isEnabled
                //     ? +model.parameters.Beta_v[0].val
                //     : createObjectVariableDependent(model.parameters.Beta_v[0]),
                // vac_d: !model.parameters.vac_d[0].isEnabled
                //     ? +model.parameters.vac_d[0].val
                //     : createObjectVariableDependent(model.parameters.vac_d[0]),
                // vac_eff: !model.parameters.vac_eff[0].isEnabled
                //     ? +model.parameters.vac_eff[0].val
                //     : createObjectVariableDependent(
                //           model.parameters.vac_eff[0]
                //       ),
                // pE_Im: !model.parameters.pE_Im[0].isEnabled
                //     ? +model.parameters.pE_Im[0].val
                //     : createObjectVariableDependent(model.parameters.pE_Im[0]),
                // tE_Im: !model.parameters.tE_Im[0].isEnabled
                //     ? +model.parameters.tE_Im[0].val
                //     : createObjectVariableDependent(model.parameters.tE_Im[0]),
                // pE_Icr: !model.parameters.pE_Icr[0].isEnabled
                //     ? +model.parameters.pE_Icr[0].val
                //     : createObjectVariableDependent(model.parameters.pE_Icr[0]),
                // tE_Icr: !model.parameters.tE_Icr[0].isEnabled
                //     ? +model.parameters.tE_Icr[0].val
                //     : createObjectVariableDependent(model.parameters.tE_Icr[0]),
                // tEv_Iv: !model.parameters.tEv_Iv[0].isEnabled
                //     ? +model.parameters.tEv_Iv[0].val
                //     : createObjectVariableDependent(model.parameters.tEv_Iv[0]),
                // tIm_R: !model.parameters.tIm_R[0].isEnabled
                //     ? +model.parameters.tIm_R[0].val
                //     : createObjectVariableDependent(model.parameters.tIm_R[0]),
                // tIcr_H: !model.parameters.tIcr_H[0].isEnabled
                //     ? +model.parameters.tIcr_H[0].val
                //     : createObjectVariableDependent(model.parameters.tIcr_H[0]),
                // pIv_R: !model.parameters.pIv_R[0].isEnabled
                //     ? +model.parameters.pIv_R[0].val
                //     : createObjectVariableDependent(model.parameters.pIv_R[0]),
                // tIv_R: !model.parameters.tIv_R[0].isEnabled
                //     ? +model.parameters.tIv_R[0].val
                //     : createObjectVariableDependent(model.parameters.tIv_R[0]),
                // pIv_H: !model.parameters.pIv_H[0].isEnabled
                //     ? +model.parameters.pIv_H[0].val
                //     : createObjectVariableDependent(model.parameters.pIv_H[0]),
                // tIv_H: !model.parameters.tIv_H[0].isEnabled
                //     ? +model.parameters.tIv_H[0].val
                //     : createObjectVariableDependent(model.parameters.tIv_H[0]),
                // pH_R: !model.parameters.pH_R[0].isEnabled
                //     ? +model.parameters.pH_R[0].val
                //     : createObjectVariableDependent(model.parameters.pH_R[0]),
                // tH_R: !model.parameters.tH_R[0].isEnabled
                //     ? +model.parameters.tH_R[0].val
                //     : createObjectVariableDependent(model.parameters.tH_R[0]),
                // pH_D: !model.parameters.pH_D[0].isEnabled
                //     ? +model.parameters.pH_D[0].val
                //     : createObjectVariableDependent(model.parameters.pH_D[0]),
                // tH_D: !model.parameters.tH_D[0].isEnabled
                //     ? +model.parameters.tH_D[0].val
                //     : createObjectVariableDependent(model.parameters.tH_D[0]),
                // pR_S: !model.parameters.pR_S[0].isEnabled
                //     ? +model.parameters.pR_S[0].val
                //     : createObjectVariableDependent(model.parameters.pR_S[0]),
                // tR_S: !model.parameters.tR_S[0].isEnabled
                //     ? +model.parameters.tR_S[0].val
                //     : createObjectVariableDependent(model.parameters.tR_S[0]),
                // pIcr_det: +model.parameters.pIcr_det,
                // pIm_det: +model.parameters.pIm_det,
                // pIv_det: +model.parameters.pIv_det,
            },
        },
        initialconditions: {
            I: initialConditionsArray(model.initialConditions, "I"),
            I_d: initialConditionsArray(model.initialConditions, "I_d"),
            I_ac: initialConditionsArray(model.initialConditions, "I_ac"),
            population: initialConditionsArray(
                model.initialConditions,
                "population"
            ),
            R: initialConditionsArray(model.initialConditions, "R"),
            E: false,
            E_d: false,
            // Iv_d: +e.initialConditions[0].conditionsValues.Iv_d,
            // Iv_ac: +e.initialConditions[0].conditionsValues.Iv_ac,
            // H: +e.initialConditions[0].conditionsValues.H,
            // H_d: +e.initialConditions[0].conditionsValues.H_d,
            // D: +e.initialConditions[0].conditionsValues.D,
            // D_d: +e.initialConditions[0].conditionsValues.D_d,
            // H_cap: +e.initialConditions[0].conditionsValues.H_cap,
            // Iv: +e.initialConditions[0].conditionsValues.Iv,
            // Sv: +e.initialConditions[0].conditionsValues.Sv,
        },
    };
};

export default getMetaObj;
