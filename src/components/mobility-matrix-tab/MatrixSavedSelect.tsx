import { Select } from "@chakra-ui/react";
import React, { useContext } from "react";

import { MobilityMatrix } from "context/MobilityMatrixContext";
import { MobilityModes } from "types/MobilityMatrixTypes";

const MatrixSavedSelect = () => {
    const {
        setMatrixMode,
        mobilityMatrixList,
        setIdMatrixModel,
        setIdMobilityMatrixUpdate,
        setOriginOfMatrixCreation,
    } = useContext(MobilityMatrix);

    const updateModelId = (matrixId) => {
        const { modelId } = mobilityMatrixList.find(
            (matrix) => matrix.id === matrixId
        );
        setIdMatrixModel(modelId);
    };

    return (
        <Select
            w="50%"
            size="sm"
            mr="15px"
            placeholder="Select mobility matrix"
            bg="#F4F4F4"
            borderColor="#F4F4F4"
            borderRadius="8px"
            onChange={(e) => {
                setMatrixMode(MobilityModes.Update);
                setOriginOfMatrixCreation("matrixTab");
                setIdMobilityMatrixUpdate(+e.target.value);
                updateModelId(+e.target.value);
            }}
        >
            {mobilityMatrixList.map((matrix) => {
                return (
                    <option key={matrix.id} value={matrix.id}>
                        {matrix.nameMobilityMatrix}
                    </option>
                );
            })}
        </Select>
    );
};

export default MatrixSavedSelect;
