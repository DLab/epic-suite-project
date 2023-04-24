import { CheckIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import _ from "lodash";
import React, { useContext, useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";

import { NewModelSetted } from "context/NewModelsContext";
import type { RootState } from "store/store";
import type {
    NewModelsAllParams,
    NewModelsParams,
} from "types/SimulationTypes";

interface Props {
    actualModelName: string;
    saveModel: () => void;
    matrixId: number;
    verifyName: (
        name: string,
        contextValue: NewModelsAllParams[] | NewModelsAllParams
    ) => boolean;
    verifySelfName: (
        num: number,
        name: string,
        contextValue: NewModelsAllParams[] | NewModelsAllParams
    ) => boolean;
    isEmpty: boolean;
}

const UpdateButton = ({
    actualModelName,
    saveModel,
    matrixId,
    verifyName,
    verifySelfName,
    isEmpty,
}: Props) => {
    const {
        newModel,
        completeModel,
        idModelUpdate: id,
        setName,
    } = useContext(NewModelSetted);
    const [isModelSavedLocal, setIsModelSavedLocal] = useState(false);
    const [modelValue, setModelValue] = useState(undefined);
    const [numberOfNodes, setNumberOfNodes] = useState(0);
    const [dataSourceValue, setDataSourceValue] = useState(undefined);
    const [areaSelectedValue, setAreaSelectedValue] = useState(undefined);
    const [populationValue, setPopulationValue] = useState(undefined);
    const [graphId, setGraphId] = useState(undefined);
    const parameters = useSelector((state: RootState) => state.controlPanel);

    /**
     * Gets the saved value of the requested parameter.
     */
    const getDefaultValueParameters = useCallback(
        (field) => {
            return newModel.find(({ idNewModel }) => idNewModel === id)[field];
        },
        [newModel, id]
    );
    useEffect(() => {
        try {
            const { name } = completeModel.find((model: NewModelsAllParams) => {
                return model.idNewModel === id;
            });
            setName(name);
        } catch (error) {
            // asdf
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        try {
            const modelSaved = completeModel.find(
                (model: NewModelsAllParams) => {
                    return model.idNewModel === id;
                }
            );
            const savedObject = {
                idGeo: modelSaved?.idGeo,
                idGraph: modelSaved?.idGraph,
                idNewModel: modelSaved?.idNewModel,
                modelType: modelSaved?.modelType,
                name: modelSaved?.name,
                numberNodes: modelSaved?.numberNodes,
                populationType: modelSaved?.populationType,
                idMobilityMatrix: modelSaved?.idMobilityMatrix,
                typeSelection: modelSaved?.typeSelection,
            };

            const actualObject = {
                idGeo: areaSelectedValue,
                idGraph: graphId,
                idNewModel: id,
                modelType: modelValue,
                name: actualModelName,
                numberNodes: numberOfNodes,
                populationType: populationValue,
                idMobilityMatrix: matrixId,
                typeSelection: dataSourceValue,
            };

            const initialConditionsNew = newModel.find(
                (model: NewModelsParams) => {
                    return model.idNewModel === id;
                }
            );

            const previusInitialConditions =
                modelSaved.initialConditions[0].conditionsValues;

            const newsInitialConditions =
                initialConditionsNew.initialConditions[0].conditionsValues;

            if (
                _.isEqual(savedObject, actualObject) &&
                _.isEqual(previusInitialConditions, newsInitialConditions)
            ) {
                setIsModelSavedLocal(true);
            } else {
                setIsModelSavedLocal(false);
            }
        } catch (error) {
            setIsModelSavedLocal(false);
        }
    }, [
        areaSelectedValue,
        completeModel,
        dataSourceValue,
        graphId,
        id,
        actualModelName,
        modelValue,
        newModel,
        numberOfNodes,
        populationValue,
        matrixId,
    ]);

    useEffect(() => {
        const modelSaved = completeModel.find((model: NewModelsAllParams) => {
            return model.idNewModel === id;
        });
        if (modelSaved) {
            if (_.isEqual(modelSaved.parameters, parameters)) {
                // setIsModelSavedLocal(true);
                // setAllGraphicData([]);
                // setAllResults([]);
                // setDataToShowInMap([]);
                // setRealDataSimulationKeys([]);
            } else {
                setIsModelSavedLocal(false);
                // setAux("");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [completeModel, id, setIsModelSavedLocal, parameters]);

    useEffect(() => {
        setModelValue(getDefaultValueParameters("modelType"));
        setDataSourceValue(getDefaultValueParameters("typeSelection"));
        setPopulationValue(getDefaultValueParameters("populationType"));
        setAreaSelectedValue(getDefaultValueParameters("idGeo"));
        setNumberOfNodes(getDefaultValueParameters("numberNodes"));
        setGraphId(getDefaultValueParameters("idGraph"));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getDefaultValueParameters]);

    return (
        <Button
            leftIcon={<CheckIcon />}
            onClick={() => {
                if (
                    !isEmpty &&
                    (!verifyName(actualModelName, completeModel) ||
                        verifySelfName(id, actualModelName, completeModel))
                ) {
                    saveModel();
                }
            }}
            isDisabled={isModelSavedLocal || isEmpty}
            bg="#016FB9"
            color="#FFFFFF"
            size="sm"
            borderRadius="4px"
            fontSize="0.625rem"
        >
            SAVE CHANGES
        </Button>
    );
};

export default UpdateButton;
