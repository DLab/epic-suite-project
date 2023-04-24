import { useContext } from "react";

import { NewModelSetted } from "context/NewModelsContext";
import type { NewModelsAllParams } from "types/SimulationTypes";

export const VerifyIsRepeatName = (
    nameMod: string,
    contextValue: NewModelsAllParams[] | []
): boolean => {
    return contextValue.some((mod: NewModelsAllParams) => mod.name === nameMod);
};

export const VerifyIsSelfName = (
    idMod: number,
    currentNameModel: string,
    contextValue: NewModelsAllParams[] | []
) => {
    return Boolean(
        contextValue.find((mod: NewModelsAllParams) => mod.idNewModel === idMod)
            ?.name === currentNameModel
    );
};
