import { Flex, Button, Icon, Box } from "@chakra-ui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import React, { useState, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import BreadCrumb from "components/BreadCrumb";
import { NewModelSetted } from "context/NewModelsContext";
import { update } from "store/ControlPanel";
import { initialState } from "store/reducer";
import type { NewModelsParams } from "types/SimulationTypes";

import ImportModels from "./ImportModels";
import ModelMainTab from "./ModelMainTab";
import ModelNameAndButtons from "./ModelNameAndButtons";
import ModelsSavedSelect from "./ModelsSavedSelect";

const ModelTab = () => {
    const {
        newModel,
        setNewModel,
        completeModel,
        mode: modelMode,
        setMode: setModelMode,
        idModelUpdate: modelId,
        setIdModelUpdate: setModelId,
    } = useContext(NewModelSetted);
    const [secondModelLink, setSecondModelLink] = useState(undefined);
    const [actualModelName, setActualModelName] = useState("");
    const [matrixId, setMatrixId] = useState(undefined);
    const dispatch = useDispatch();
    const addNewModel = () => {
        const id = Date.now();
        setModelId(id);
        setNewModel({
            type: "add",
            payload: {
                idNewModel: id,
                name: "",
                modelType: undefined,
                populationType: undefined,
                typeSelection: undefined,
                idGeo: undefined,
                idMobilityMatrix: undefined,
                idGraph: undefined,
                numberNodes: undefined,
                t_init: format(new Date(2022, 4, 31), "yyyy/MM/dd"),
                initialConditions: [],
            },
        });
        setModelMode("add");
    };

    useEffect(() => {
        if (modelMode === "initial") {
            setActualModelName("");
        }
        if (modelMode === "update") {
            const { name, idMobilityMatrix } = completeModel.find(
                (model: NewModelsParams) =>
                    model.idNewModel.toString() === modelId.toString()
            );
            setActualModelName(name);
            setMatrixId(idMobilityMatrix);
        }
        if (modelMode === "add") {
            dispatch(update({ type: "update", updateData: initialState }));
            setActualModelName("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modelMode, modelId]);

    return (
        <Flex direction="column">
            <BreadCrumb
                firstLink="Models"
                secondLink={secondModelLink}
                setSecondLink={setSecondModelLink}
            />
            {modelMode === "initial" && (
                <Flex w="40%" mt="15px">
                    <ModelsSavedSelect setModelMode={setModelMode} />
                    <Button
                        size="sm"
                        fontSize="0.625rem"
                        bg="#016FB9"
                        color="#FFFFFF"
                        onClick={() => {
                            addNewModel();
                        }}
                    >
                        <Icon
                            w="0.875rem"
                            h="0.875rem"
                            as={PlusIcon}
                            mr="5px"
                        />
                        ADD NEW
                    </Button>
                    {/* <ImportModels /> */}
                </Flex>
            )}
            {modelMode !== "initial" && newModel.length > 0 && (
                <>
                    {newModel.map((model) => {
                        if (model.idNewModel === modelId) {
                            return (
                                <Box key={model.idNewModel}>
                                    <ModelNameAndButtons
                                        actualModelName={actualModelName}
                                        setActualModelName={setActualModelName}
                                        matrixId={matrixId}
                                    />
                                    <ModelMainTab
                                        id={modelId}
                                        initialConditions={
                                            model.initialConditions
                                        }
                                        actualModelName={actualModelName}
                                        setActualModelName={setActualModelName}
                                        matrixId={matrixId}
                                        setMatrixId={setMatrixId}
                                    />
                                </Box>
                            );
                        }
                        return false;
                    })}
                </>
            )}
        </Flex>
    );
};

export default ModelTab;
