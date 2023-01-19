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

/**
 * Provides data for SIR type models.
 * @param {NewModelsAllParams[]} e
 * @param {EpidemicsData} modelParameters
 * @param scale geographic scale of the model.
 * @param featureSelected fips of geographic areas selected in the model.
 * @returns {Object}
 */
const getSIRObjMono = (e, modelParameters, scale, featureSelected) => {
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
                pI_det: +modelParameters.pI_det,
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
            },
        },
        initialconditions: {
            I: +e.initialConditions[0].conditionsValues.I,
            I_d: +e.initialConditions[0].conditionsValues.I_d,
            I_ac: +e.initialConditions[0].conditionsValues.I_ac,
            population: +e.initialConditions[0].conditionsValues.population,
            R: +e.initialConditions[0].conditionsValues.R,
        },
    };
};

export default getSIRObjMono;
