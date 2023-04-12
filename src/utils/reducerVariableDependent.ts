import {
    NameFunction,
    TransitionFunction,
    TypePhase,
} from "../types/VariableDependentTime";
import type VariableDependentTime from "../types/VariableDependentTime";
import type {
    Sine,
    Square,
    StaticValue,
    Transition,
} from "../types/VariableDependentTime";

export interface Actions {
    type: string;
    index?: string;
    payloadType?: VariableDependentTime["type"];
    range?: number[];
    payloadTypeElement?: Sine | Square | StaticValue | Transition;
    payloadVariableDependent?: PayloadVariableDependent;
}
export interface PayloadVariableDependent {
    type: Sine | Square | StaticValue | Transition;
    rangeDays: number[];
}
const reducer = (state: VariableDependentTime, actions: Actions) => {
    if (actions.type === "edit") {
        return {
            ...state,
            type: actions.payloadType,
        };
    }
    if (actions.type === "editElement") {
        const newType = state.type.map(
            (e: Sine | Square | StaticValue | Transition, i: number) => {
                if (i === +actions.index) {
                    return actions.payloadTypeElement;
                }
                return e;
            }
        );
        return {
            ...state,
            type: newType,
        };
    }
    if (actions.type === "add") {
        return {
            ...state,
            rangeDays: [
                ...state.rangeDays,
                actions.payloadVariableDependent.rangeDays,
            ],
            type: [...state.type, actions.payloadVariableDependent.type],
        };
    }
    if (actions.type === "editDefault") {
        return {
            ...state,
            default: actions.index,
        };
    }
    if (actions.type === "delete") {
        return {
            ...state,
            rangeDays: state.rangeDays.filter((_e, i) => i !== +actions.index),
            type: state.type.filter((e, i) => i !== +actions.index),
        };
    }
    if (actions.type === "updateDay") {
        return {
            ...state,
            rangeDays: state.rangeDays.map((e, i) => {
                if (i === +actions.index) {
                    return actions.range;
                }
                return e;
            }),
        };
    }
    return state;
};

export const handleNameFunctionSelect = (e, i, setValues) => {
    switch (e) {
        case "static":
            setValues({
                type: "editElement",
                payloadTypeElement: {
                    name: NameFunction.static,
                    value: 1,
                },
                index: i,
            });
            break;
        case "sinusoidal":
            setValues({
                type: "editElement",
                payloadTypeElement: {
                    name: NameFunction.sinusoidal,
                    min: 0,
                    max: 1,
                    period: 1,
                    initPhase: TypePhase.min,
                },

                index: i,
            });
            break;
        case "square":
            setValues({
                type: "editElement",
                payloadTypeElement: {
                    name: NameFunction.square,
                    min: 0,
                    max: 1,
                    period: 1,
                    initPhase: TypePhase.min,
                    duty: 1,
                },

                index: i,
            });
            break;
        case "transition":
            setValues({
                type: "editElement",
                payloadTypeElement: {
                    name: NameFunction.transition,
                    ftype: TransitionFunction.linear,
                    initvalue: 0,
                    endvalue: 1,
                    concavity: 0,
                },

                index: i,
            });
            break;
        default:
            break;
    }
};

export const lastValueInMatrix = (range: number[][]): number => {
    const lastArray = range[range.length - 1];
    return lastArray[lastArray.length - 1];
};

export default reducer;
