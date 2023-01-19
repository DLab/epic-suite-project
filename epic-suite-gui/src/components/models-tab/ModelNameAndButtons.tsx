import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { Flex, Input, Button, Stack, useToast } from "@chakra-ui/react";
import format from "date-fns/fp/format";
import React, { useContext } from "react";
import { useSelector } from "react-redux";

import { NewModelSetted } from "context/NewModelsContext";
import { TabIndex } from "context/TabContext";
import { RootState } from "store/store";
import { NewModelsAllParams, NewModelsParams } from "types/SimulationTypes";

import DeleteModelAlert from "./DeleteModelAlert";
import UpdateButton from "./UpdateButton";

interface Props {
    actualModelName: string;
    setActualModelName: (value: string) => void;
}
const ModelNameAndButtons = ({
    actualModelName,
    setActualModelName,
}: Props) => {
    const {
        newModel,
        setNewModel,
        completeModel,
        setCompleteModel,
        mode: modelMode,
        setMode: setModelMode,
        idModelUpdate: id,
        setName,
        name,
    } = useContext(NewModelSetted);
    const toast = useToast();
    const parameters = useSelector((state: RootState) => state.controlPanel);
    const { setIndex } = useContext(TabIndex);

    const getModelCompleteObj = () => {
        const modelInfo = newModel.find(
            (model: NewModelsParams) => model.idNewModel === id
        );

        const newNameModel = { ...modelInfo };
        newNameModel.name = name;

        const allModelInfo = {
            ...newNameModel,
            parameters,
        };
        const modelExist = completeModel.find(
            (model: NewModelsAllParams) => +model.idNewModel === id
        );
        if (modelExist !== undefined) {
            setCompleteModel({
                type: "update-all",
                id,
                payload: allModelInfo,
            });
            const modelsAux = [...completeModel].map(
                (e: NewModelsAllParams, i) => {
                    if (e.idNewModel === id) {
                        return allModelInfo;
                    }
                    return e;
                }
            );
            localStorage.setItem("newModels", JSON.stringify(modelsAux));
        } else {
            setCompleteModel({
                type: "add",
                payload: allModelInfo,
            });

            localStorage.setItem(
                "newModels",
                JSON.stringify([...completeModel, allModelInfo])
            );
        }
    };

    const saveModel = () => {
        const modelForSim = newModel.findIndex(
            (mod: NewModelsParams) => mod.idNewModel === id
        );
        const isInitialConditionsVoid = newModel[
            modelForSim
        ].initialConditions.some((init) => {
            if (
                Object.values(init.conditionsValues).every(
                    (values) => values === 0
                )
            ) {
                return true;
            }
            return false;
        });
        if (isInitialConditionsVoid) {
            toast({
                position: "bottom-left",
                title: "Updated failed",
                description:
                    "There is one or more nodes with all initial conditions values as zero ",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } else {
            getModelCompleteObj();
            setModelMode("initial");
            setIndex(0);
            toast({
                position: "bottom-left",
                title: "Model is ready",
                description: "Model is enabled to simulate",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const getPreviusInitialConditions = () => {
        const { initialConditions } = completeModel.find(
            (model: NewModelsParams) =>
                model.idNewModel.toString() === id.toString()
        );

        setNewModel({
            type: "update-initial-conditions",
            payloadInitialConditions: initialConditions,
            id,
        });
    };

    // const saveActualName = () => {
    //     setNewModel({
    //         type: "update-all",
    //         id,
    //         payload: {
    //             idNewModel: id,
    //             name: modelName,
    //             modelType: modelValue,
    //             populationType: populationValue,
    //             typeSelection: dataSourceValue,
    //             idGeo: idGeo,
    //             idGraph: graphId,
    //             numberNodes: numberOfGraphs,
    //             t_init: format(new Date(2021, 11, 31), "yyyy/MM/dd"),
    //             initialConditions:
    //                 getInitialConditionsGraphsArray(graphsValuesArray),
    //         },
    //     });
    // };

    return (
        <Flex p="0 2%" mt="20px">
            {modelMode !== "Initial" && (
                <Input
                    size="sm"
                    mr="2%"
                    w="350px"
                    bg="#ffffff"
                    fontSize="14px"
                    placeholder="Name"
                    value={actualModelName}
                    onChange={(e) => {
                        setActualModelName(e.target.value);
                        setName(e.target.value);
                    }}
                />
            )}
            <>
                <Stack spacing={4} direction="row" align="center">
                    {modelMode === "add" && (
                        <>
                            <Button
                                leftIcon={<CheckIcon />}
                                onClick={() => {
                                    saveModel();
                                }}
                                bg="#016FB9"
                                color="#FFFFFF"
                                size="sm"
                                borderRadius="4px"
                                fontSize="10px"
                            >
                                SAVE MODEL
                            </Button>
                            <Button
                                leftIcon={<CloseIcon />}
                                onClick={() => {
                                    setNewModel({
                                        type: "remove",
                                        element: id,
                                    });
                                    setModelMode("initial");
                                }}
                                bg="#B9B9C9"
                                color="#FFFFFF"
                                borderRadius="4px"
                                fontSize="10px"
                                size="sm"
                            >
                                CANCEL
                            </Button>
                        </>
                    )}
                    {modelMode === "update" && (
                        <>
                            <UpdateButton
                                actualModelName={actualModelName}
                                saveModel={saveModel}
                            />
                            <Button
                                leftIcon={<CloseIcon />}
                                bg="#B9B9C9"
                                color="#FFFFFF"
                                size="sm"
                                borderRadius="4px"
                                fontSize="10px"
                                // eslint-disable-next-line sonarjs/no-identical-functions
                                onClick={() => {
                                    getPreviusInitialConditions();
                                    setModelMode("initial");
                                }}
                            >
                                CANCEL
                            </Button>
                            <DeleteModelAlert setModelMode={setModelMode} />
                        </>
                    )}
                </Stack>
            </>
        </Flex>
    );
};

export default ModelNameAndButtons;
