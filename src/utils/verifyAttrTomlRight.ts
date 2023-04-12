/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    MAINKEYS,
    MODELKEYS,
    INITIALCONDITIONSKEYS,
    DATAKEYS,
    DYNAMICKEYS,
    STATICKEYS,
} from "constants/verifyAttrTomlConstants";
import type { Fields } from "types/importTypes";

/**
 * It takes a length and an array of strings and returns a function that takes a string and returns a
 * boolean
 * @param {number} lenght - number - the number of fields that must be in the object
 * @param {string[]} fields - string[] - an array of strings that are the keys that we want to check
 * for
 * @returns A function that takes a key and returns a boolean.
 */
export const verifyMainKeys = (lenght: number, fields: string[]) => {
    const countFields = {
        count: 0,
    };
    return (key) => {
        if (fields.includes(key)) {
            countFields.count += 1;
        }
        return lenght === countFields.count;
    };
};

/**
 * It throws an error if the data object doesn't have the required attributes
 * @param {unknown} data - unknown - the data that we want to check
 * @param [mainKeys=Epic TOML] - The name of the main key in the TOML file.
 */
const returnErrorByWrongAttribute = (data: unknown, mainKeys = "Epic TOML") => {
    const attr = mainKeys !== "Epic TOML" ? `in ${mainKeys}` : "";
    throw new Error(
        `Your config file hasn't required attributes ${attr}, got: ${Object.keys(
            data
        )}`
    );
};
/**
 * It returns an array of strings, which are the keys of the object that will be passed to the model
 * @param {string} typeCompartment - string - the type of compartmental model you want to use.
 * @param {Fields} fields - Fields
 * @returns An array of strings
 */
const keysByCompartments = (
    typeCompartment: string,
    fields: Fields,
    excludeByModel = false
): string[] => {
    const regex = /(sir|seirhvd|seir)/gi;
    const typeModel = typeCompartment.match(regex)[0];
    switch (typeModel) {
        case "seir":
            return fields.must;
        case "sir":
            return fields.must;
        case "seirhvd":
            if (excludeByModel) {
                return [...fields.must, ...fields.seirhvd];
            }
            return [...fields.must, ...fields.seir, ...fields.seirhvd];
        default:
            throw new Error("Type model is wrong");
    }
};
/**
 * It verifies that the keys in the TOML file are correct
 * @param {any} obj - the object to be verified
 * @returns A function that takes in two arguments, the length of the array and the array itself.
 */
const verifyAttrTomlRight = (obj: any) => {
    const statusFieldsVerified = verifyMainKeys(
        MAINKEYS.must.length,
        MAINKEYS.must
    );
    const mainKeysInToml = Object.keys(obj)
        .map((key) => statusFieldsVerified(key))
        .some((verified) => verified);
    if (!mainKeysInToml) {
        returnErrorByWrongAttribute(obj);
    }
    const {
        model,
        parameters: { static: staticAttr, dynamic },
        initialconditions,
        data,
    } = obj;
    const statusModelKeysVerified = verifyMainKeys(
        MODELKEYS.must.length,
        MODELKEYS.must
    );
    const statusDataKeysVerified = verifyMainKeys(
        DATAKEYS.must.length,
        DATAKEYS.must
    );
    const compartments = keysByCompartments(
        model.model,
        INITIALCONDITIONSKEYS,
        true
    );
    const statusInitialConditionsVerified = verifyMainKeys(
        compartments.length,
        compartments
    );
    const staticStatus = keysByCompartments(model.model, STATICKEYS, true);
    const statusStaticKeys = verifyMainKeys(staticStatus.length, staticStatus);
    const dynamicStatus = keysByCompartments(model.model, DYNAMICKEYS, true);
    const statusDynamicKeys = verifyMainKeys(
        dynamicStatus.length,
        dynamicStatus
    );
    const areModelKeysRight = Object.keys(model)
        .map((mod) => statusModelKeysVerified(mod))
        .some((isInObj) => isInObj);
    const areDataModelKeysRight = Object.keys(data)
        .map((mod) => statusDataKeysVerified(mod))
        .some((isInObj) => isInObj);
    const areInitialConditiosnKeysRight = Object.keys(initialconditions)
        .map((mod) => statusInitialConditionsVerified(mod))
        .some((isInObj) => isInObj);
    const areStaticKeysRight = Object.keys(staticAttr)
        .map((mod) => statusStaticKeys(mod))
        .some((isInObj) => isInObj);
    const areDynamicKeysRight = Object.keys(dynamic)
        .map((mod) => statusDynamicKeys(mod))
        .some((isInObj) => isInObj);

    if (!areDataModelKeysRight) {
        returnErrorByWrongAttribute(data, "Data");
    }
    if (!areStaticKeysRight) {
        returnErrorByWrongAttribute(staticAttr, "Static Parameters");
    }
    if (!areDynamicKeysRight) {
        returnErrorByWrongAttribute(dynamic, "Dynamic Parameters");
    }
    if (!areModelKeysRight) {
        returnErrorByWrongAttribute(model, "Model");
    }
    if (!areInitialConditiosnKeysRight) {
        returnErrorByWrongAttribute(initialconditions, "Initial Conditions");
    }
    return true;
};

export default verifyAttrTomlRight;
