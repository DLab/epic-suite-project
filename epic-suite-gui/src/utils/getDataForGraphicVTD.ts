/* eslint-disable @typescript-eslint/dot-notation */

import VariableDependentTime, {
    NameFunction,
    Sine,
    Square,
    StaticValue,
    Transition,
} from "../types/VariableDependentTime";

import postData from "./fetchData";

// Format Dependent Time Variable and sending it to endpoint [POST] /functions
export const formatVariableDependentTime = (
    data:
        | VariableDependentTime
        | {
              default: string;
              rangeDays: number[][];
              type: (Sine | Square | Transition | StaticValue)[];
              name: string;
              isEnabled: boolean;
              val: number;
          }
): unknown => {
    const { rangeDays, type } = data;
    return type.map((t, i) => {
        let newType = {
            ...t,
            t_init: rangeDays[i][0],
            t_end: rangeDays[i][1],
        };
        if (newType.name === NameFunction.static) {
            newType = newType["value"];
        }
        if (
            t.name === NameFunction.sinusoidal ||
            t.name === NameFunction.square
        ) {
            const newValues = {
                ...t,
                function: t.name === NameFunction.sinusoidal ? "sine" : t.name,
                initphase: t["initPhase"],
                min_val: t["min"],
                max_val: t["max"],
                ...newType,
            };
            delete newValues["initPhase"];
            delete newValues.name;
            delete newValues["max"];
            delete newValues["min"];
            return newValues;
        }
        if (t.name === NameFunction.transition) {
            const transitionValues = {
                ...t,
                function: t.name,
                ...newType,
            };
            delete transitionValues.name;
            return transitionValues;
        }
        delete newType.name;
        return newType;
    });
};

// get series from formatted variable dependent time

export const createSeries = async (
    data,
    url,
    duration,
    defaultNum: number,
    range
) => {
    const dataForSending = {
        t_init: 0,
        t_end: +duration,
        function: {
            function: "events",
            values: data,
            default: defaultNum,
            days: range,
        },
    };
    const { results } = await postData(url, dataForSending);
    // reduce all objects to one.

    return results;
};
