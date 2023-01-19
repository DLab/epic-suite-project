/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
import _ from "lodash";

import {
    EVENTFUNCTION,
    REGEXTRANSITIONFUNCTION,
    TYPESEVENTFUNCTION,
} from "constants/verifyAttrTomlConstants";
import { Fields } from "types/importTypes";

import { verifyMainKeys } from "./verifyAttrTomlRight";

export interface EventFunction {
    must: string[];
    values: ValuesEventFunction;
}
export interface ValuesEventFunction {
    must: string[];
    sine: string[];
    square: string[];
    transition: Fields;
}
export const keysByTypeFunction = (
    typeCompartment: string,
    fields: EventFunction,
    isQuadratic = false
) => {
    const typeModel = typeCompartment.match(REGEXTRANSITIONFUNCTION)[0];
    switch (typeModel) {
        case "square":
            return [...fields.values.must, ...fields.values.square];
        case "sine":
            return [...fields.values.must, ...fields.values.sine];
        case "transition":
            return isQuadratic
                ? [
                      ...fields.values.must,
                      ...fields.values.transition.must,
                      ...fields.values.transition.quadratic,
                  ]
                : [...fields.values.must, ...fields.values.transition.must];
        default:
            throw new Error("Type model is wrong");
    }
};
export const verifyInnertypesVDT = (innerValueVDT: unknown) => {
    if (_.isString(innerValueVDT)) {
        // esto debería estar en una función
        const valueParseToJson = JSON.parse(innerValueVDT);
        const AllParseToJson = {
            ...valueParseToJson,
            values: valueParseToJson.values.map((v) => JSON.parse(v)),
        };
        // verify is string contain EVENTFUNCTION.must properties
        const statusParseData = verifyMainKeys(
            EVENTFUNCTION.must.length,
            EVENTFUNCTION.must
        );

        const isRightMainKeysParseData = Object.keys(AllParseToJson)
            .map((key) => statusParseData(key))
            .some((verified) => verified);
        if (!isRightMainKeysParseData) {
            throw new Error(`It fault any main properties in event function`);
        }
        const { values, days } = AllParseToJson;
        const IsAllDaysArrayNumbers = days.every(
            ([init, end], index: number, arr: number[][]) => {
                if (init > end) {
                    throw new Error(
                        `Init day must to be lower than end day in range days`
                    );
                }
                return (
                    _.isNumber(init) &&
                    _.isNumber(end) &&
                    (index !== 0 ? arr[index - 1][1] < end : true)
                );
            }
        );
        if (!IsAllDaysArrayNumbers) {
            throw new Error(
                `Days into event function hasn't correct type. It must to  be numbers array`
            );
        }
        values.forEach((element) => {
            if (!_.isNumber(element)) {
                const keysEventFunction = keysByTypeFunction(
                    element.function,
                    EVENTFUNCTION,
                    element.function === "transition" &&
                        element.type === "quadratic"
                );
                const statusEventFunction = verifyMainKeys(
                    keysEventFunction.length,
                    keysEventFunction
                );
                const isRightEventFunctionProps = Object.keys(element)
                    .map((key) => statusEventFunction(key))
                    .some((verified) => verified);
                if (!isRightEventFunctionProps) {
                    throw new Error(
                        `Any properties in time variable dependent are lost`
                    );
                }
                // verify right values
                const functionKeys = ["transition", "sine", "square"];
                const typesKeys = ["sigmoidal", "quadratic", "linear"];
                Object.entries(element).forEach(([key, val]) => {
                    switch (TYPESEVENTFUNCTION[key]) {
                        case "number":
                            if (!_.isNumber(val) || val < 0) {
                                throw new Error(
                                    `In Time dependent value, ${key} must to be a number and greater or equal to zero. We recieved ${val}`
                                );
                            }
                            if (key === "min_val" && val > element.max_val) {
                                throw new Error(
                                    `min_val must to be lesser than max_val`
                                );
                            }
                            if (key === "max_val" && val < element.min_val) {
                                throw new Error(
                                    `max_val must to be greater than min_val error not number`
                                );
                            }
                            if (key === "t_end" && val < element.t_init) {
                                throw new Error(
                                    `t_end must to be greater than t_init`
                                );
                            }
                            if (key === "t_init" && val > element.t_end) {
                                throw new Error(
                                    `t_init must to be lesser than t_end`
                                );
                            }
                            break;
                        case "string":
                            if (
                                key === "function" &&
                                _.isString(val) &&
                                !functionKeys.includes(val)
                            ) {
                                throw new Error(
                                    `In Time Dependent variables, function value must to be "transition", "sine" or "square" but we recieved ${val}`
                                );
                            }
                            if (
                                key === "type" &&
                                _.isString(val) &&
                                !typesKeys.includes(val)
                            ) {
                                throw new Error(
                                    `In Time Dependent variables, function value must to be "sigmoidal", "quadratic", "linear" but we recieved ${val}`
                                );
                            }
                            break;
                        case "boolean":
                            if (!_.isNumber(val) && (val > 1 || val < 0)) {
                                throw new Error(`define error boolean`);
                            }
                            break;
                        default:
                            break;
                    }
                });
            }
        });
        return true;
    }
    if (_.isNumber(innerValueVDT) && innerValueVDT >= 0) {
        return true;
    }
    return false;
};
// export const deleteExtraParameters = (data: unknown) => {
// --> queda pendiente hacer función que elimine parámetros extras en TOML
// };
