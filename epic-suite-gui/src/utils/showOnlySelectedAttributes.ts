import { TransitionFunction } from "types/VariableDependentTime";

const showOnlySelectedAttributes = (
    key: string,
    value: string | number,
    callback: (key: string, value: string | number) => unknown
): unknown => {
    return callback(key, value);
};

export const getSubTypeTransitionFunction = (
    key: string,
    value: string | number
): unknown => {
    if (key === "ftype") {
        if (value === 0) {
            return "Linear";
        }
        if (value === 1) {
            return "Quadratic";
        }
        return "Sigmoidal";
    }
    return value;
};
export const findValueByKeyInMatrix = (
    matrix: unknown[][],
    keyToVerify: string,
    expectedValue: string | number
): unknown => {
    return matrix.find(([key, value]): unknown => {
        if (key === keyToVerify && value === expectedValue) {
            return value;
        }
        return "";
    });
};
export default showOnlySelectedAttributes;
