import _ from "lodash";

import { InitialConditionsNewModel } from "types/ControlPanelTypes";
import VariableDependentTime from "types/VariableDependentTime";

import { convertTypeFunctionVDTForTomlFormat } from "./convertVDTForTomlFormat";

export type DynamicAttributes = Record<
    string,
    VariableDependentTime[] | number | VariableDependentTime
>;
/**
 * It converts a JSON object with a specific structure into a TOML object with a specific structure
 * @param {DynamicAttributes} DinamicAttribute - DynamicAttributes
 * @returns An object with the keys and values of the DynamicAttributes object.
 */
export const StringifyVariableDependentTime = (
    DinamicAttribute: DynamicAttributes
) => {
    return Object.entries(DinamicAttribute)
        .map(([keys, data]) => {
            if (_.isNumber(data)) {
                return { [keys]: data };
            }
            if (!_.isArray(data)) {
                const { rangeDays, type, isEnabled, val } = data;
                return {
                    [keys]: isEnabled
                        ? JSON.stringify({
                              function: "events",
                              values: convertTypeFunctionVDTForTomlFormat(
                                  type,
                                  rangeDays
                              ),
                              days: rangeDays,
                          })
                        : val,
                };
            }
            // util variable
            const med = data
                .map((u: VariableDependentTime) => {
                    const { rangeDays, type, isEnabled, val } = u;
                    return {
                        [keys]: isEnabled
                            ? JSON.stringify({
                                  function: "events",
                                  values: convertTypeFunctionVDTForTomlFormat(
                                      type,
                                      rangeDays
                                  ),
                                  days: rangeDays,
                              })
                            : val,
                    };
                })
                .reduce((ac, curr) => {
                    const saveValuesInArray =
                        _.isString(ac[keys]) ||
                        _.isNumber(ac[keys]) ||
                        _.isArray(ac[keys])
                            ? [ac[keys], curr[keys]].reduce(
                                  (acc, x) => acc.concat(x),
                                  []
                              )
                            : curr[keys];
                    return {
                        [keys]: saveValuesInArray,
                    };
                }, {});
            // if med array, fix it when it has mixed types before returning
            return {
                [keys]: med[keys],
            };
        })
        .reduce((acc, curr) => {
            return { ...acc, ...curr };
        }, {});
};

/**
 * It takes an array of initial conditions and a population type, and returns an object with the same
 * keys as the initial conditions, but with the values of each key being an array of the values of that
 * key in the initial conditions
 * @param {InitialConditionsNewModel[]} initCond - InitialConditionsNewModel[]
 * @param {string} populationType - string
 */
export const formatInitialConditionsForExport = (
    initCond: InitialConditionsNewModel[],
    populationType: string
) => {
    return {
        ...initCond
            .map((init) => init.conditionsValues)
            .reduce(
                (
                    accumCompartments,
                    currentCompartments,
                    _idx,
                    sourceConditionsValues
                ) => {
                    if (
                        sourceConditionsValues.length === 1 &&
                        populationType.replace("population", "") === "mono"
                    ) {
                        return {
                            ...accumCompartments,
                            ...currentCompartments,
                        };
                    }
                    return Object.entries(currentCompartments)
                        .map(([key, value]) => {
                            return {
                                [key]: accumCompartments[key]
                                    ? [...accumCompartments[key], value]
                                    : [value],
                            };
                        })
                        .reduce(
                            (subAccum, subCurrent) => ({
                                ...subAccum,
                                ...subCurrent,
                            }),
                            {}
                        );
                },
                {}
            ),
    };
};
