/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/dot-notation */
import { NameFunction, TransitionFunction } from "types/VariableDependentTime";
import type {
    Sine,
    Square,
    StaticValue,
    Transition,
} from "types/VariableDependentTime";

export const convertTypeFunctionVDTForTomlFormat = (
    type: (Sine | Square | Transition | StaticValue)[],
    rangeDays?: number[][]
): unknown => {
    return type.map((val) => {
        if (val.name === NameFunction.sinusoidal) {
            return JSON.stringify({
                function: "sine",
                min_val: val["min"],
                max_val: val["max"],
                period: val["period"],
                initPhase: val["initPhase"] === 0 ? "min" : "max",
            });
        }
        if (val.name === NameFunction.square) {
            return JSON.stringify({
                function: NameFunction.square,
                min_val: val["min"],
                max_val: val["max"],
                period: val["period"],
                duty: val["duty"],
                initPhase: val["initPhase"] === 0 ? "min" : "max",
            });
        }
        if (val.name === NameFunction.transition) {
            return JSON.stringify({
                function: NameFunction.transition,
                min_val: val["initvalue"],
                max_val: val["endvalue"],
                t_init: rangeDays[0][0],
                t_end: rangeDays[rangeDays.length - 1][1],
                type:
                    val["ftype"] === TransitionFunction.linear
                        ? "linear"
                        : val["ftype"] === TransitionFunction.quadratic
                        ? "quadratic"
                        : "sigmoidal",
                ...(val["ftype"] === TransitionFunction.quadratic
                    ? { concavity: val["concavity"] }
                    : {}),
            });
        }
        return val["value"];
    });
};

export const fixMixTypeInArray = (data: Array<unknown>) => {
    const isMixTypeArray = data.every(
        (d, _i, array) => typeof array[0] === typeof d
    );
    if (!isMixTypeArray) return data.map((d) => `${d}`);
    return data;
};
