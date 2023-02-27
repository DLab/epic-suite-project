import { Select } from "@chakra-ui/react";
import React, { useContext } from "react";

import { NewModelSetted } from "context/NewModelsContext";
import { NewModelsAllParams } from "types/SimulationTypes";

interface Props {
    setModelMode: (value: string) => void;
}

const ModelsSavedSelect = ({ setModelMode }: Props) => {
    const { completeModel, setIdModelUpdate: setModelId } =
        useContext(NewModelSetted);
    return (
        <Select
            w="50%"
            size="sm"
            mr="15px"
            placeholder="Select model"
            bg="#F4F4F4"
            borderColor="#F4F4F4"
            borderRadius="8px"
            onChange={(e) => {
                setModelMode("update");
                setModelId(+e.target.value);
            }}
        >
            {completeModel.map((model: NewModelsAllParams) => {
                return (
                    <option key={model.idNewModel} value={model.idNewModel}>
                        {model.name}
                    </option>
                );
            })}
        </Select>
    );
};

export default ModelsSavedSelect;
