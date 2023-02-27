import { Button } from "@chakra-ui/react";
import _ from "lodash";
import React, { useContext, useState, useEffect } from "react";

import { MobilityMatrix } from "context/MobilityMatrixContext";
import { NewModelSetted } from "context/NewModelsContext";
import { InterventionsTypes } from "types/MobilityMatrixTypes";
import { NewModelsAllParams } from "types/SimulationTypes";

interface Props {
    nodesLocalValue: number | undefined;
    graphTypeLocal: string;
    popPercentage: number;
    isDynamical: boolean;
    modulationLocalValue: string;
    daysCicleLocalValue: number;
    interventionList: InterventionsTypes[];
    matrixNameLocal: string;
    matrixType: string;
    saveMobilityMatrix: () => void;
}

const UpdateMatrixButton = ({
    nodesLocalValue,
    graphTypeLocal,
    popPercentage,
    isDynamical,
    modulationLocalValue,
    daysCicleLocalValue,
    interventionList,
    matrixNameLocal,
    matrixType,
    saveMobilityMatrix,
}: Props) => {
    const [isModelSavedLocal, setIsModelSavedLocal] = useState(false);
    const { completeModel, idModelUpdate: id } = useContext(NewModelSetted);

    const { idMobilityMatrixUpdate, mobilityMatrixList, idMatrixModel } =
        useContext(MobilityMatrix);

    useEffect(() => {
        try {
            const matrixSaved = mobilityMatrixList.find((matrix) => {
                return matrix.id === idMobilityMatrixUpdate;
            });

            const modelSaved = completeModel.find(
                (model: NewModelsAllParams) => {
                    return model.idNewModel === idMatrixModel;
                }
            );
            const newMatrix = {
                id: idMobilityMatrixUpdate,
                populationData: modelSaved?.typeSelection,
                geoId: modelSaved?.idGeo,
                modelId: idMatrixModel,
                nodes: nodesLocalValue,
                populationPercentage: popPercentage,
                graphTypes: graphTypeLocal,
                dynamical: isDynamical,
                cicleDays: daysCicleLocalValue,
                modulationOption: modulationLocalValue,
                interventions: interventionList,
                nameMobilityMatrix: matrixNameLocal,
                type: matrixType,
            };

            if (_.isEqual(matrixSaved, newMatrix)) {
                setIsModelSavedLocal(true);
            } else {
                setIsModelSavedLocal(false);
            }
        } catch (error) {
            setIsModelSavedLocal(false);
        }
    }, [
        completeModel,
        daysCicleLocalValue,
        graphTypeLocal,
        id,
        idMatrixModel,
        idMobilityMatrixUpdate,
        interventionList,
        isDynamical,
        matrixNameLocal,
        mobilityMatrixList,
        modulationLocalValue,
        nodesLocalValue,
        popPercentage,
        matrixType,
    ]);

    return (
        <Button
            size="sm"
            fontSize="10px"
            bg="#016FB9"
            color="#FFFFFF"
            isDisabled={isModelSavedLocal}
            onClick={() => saveMobilityMatrix()}
        >
            SAVE CHANGES
        </Button>
    );
};

export default UpdateMatrixButton;
