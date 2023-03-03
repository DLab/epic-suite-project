/* eslint-disable no-nested-ternary */
/* A React component that is used to save a model. */
import { CheckIcon, CloseIcon, SmallCloseIcon } from "@chakra-ui/icons";
import {
    Flex,
    Input,
    Button,
    Stack,
    useToast,
    InputGroup,
    InputRightElement,
    Tooltip,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";

import { InterventionColection } from "context/InterventionsContext";
import { MobilityMatrix } from "context/MobilityMatrixContext";
import { NewModelSetted } from "context/NewModelsContext";
import { TabIndex } from "context/TabContext";
import { RootState } from "store/store";
import { Actions } from "types/InterventionsTypes";
import { NewModelsAllParams, NewModelsParams } from "types/SimulationTypes";

import DeleteModelAlert from "./DeleteModelAlert";
import UpdateButton from "./UpdateButton";

interface Props {
    actualModelName: string;
    setActualModelName: (value: string) => void;
    matrixId: number;
}
const bottomLeft = "bottom-left";
// eslint-disable-next-line complexity
const ModelNameAndButtons = ({
    actualModelName,
    setActualModelName,
    matrixId,
}: Props) => {
    const {
        newModel,
        setNewModel,
        completeModel,
        setCompleteModel,
        mode: modelMode,
        setMode: setModelMode,
        idModelUpdate: id,
        name: nameModel,
        setName,
        idMobility,
    } = useContext(NewModelSetted);
    const { setInterventionsCreated } = useContext(InterventionColection);
    const toast = useToast();
    const parameters = useSelector((state: RootState) => state.controlPanel);
    const { setIndex } = useContext(TabIndex);
    const { setMobilityMatrixList, mobilityMatrixList } =
        useContext(MobilityMatrix);
    const verifyIsRepeatName = (nameMod: string): boolean => {
        return completeModel.some(
            (mod: NewModelsAllParams) => mod.name === nameMod
        );
    };
    const [isRepeatedName, setIsRepeatedName] = useState(
        verifyIsRepeatName(actualModelName)
    );
    const [isEmpty, setIsEmpty] = useState(
        modelMode === "add" ? !actualModelName : !!actualModelName
    );
    const getModelCompleteObj = () => {
        const modelInfo = newModel.find(
            (model: NewModelsParams) => model.idNewModel === id
        );

        const newNameModel = { ...modelInfo };
        newNameModel.name = actualModelName;
        newNameModel.idMobilityMatrix = matrixId;

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
                (e: NewModelsAllParams) => {
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

    // eslint-disable-next-line sonarjs/cognitive-complexity
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
        const isRightKeyModels = Object.keys(
            newModel[modelForSim]
            // eslint-disable-next-line complexity
        ).every((key) => {
            if (
                ["idGeo", "idGraph", "idMobilityMatrix", "name"].includes(key)
            ) {
                if (key === "idGeo") {
                    if (
                        newModel[modelForSim][key] &&
                        !newModel[modelForSim].idGraph
                    ) {
                        return true;
                    }
                    if (
                        !newModel[modelForSim][key] &&
                        newModel[modelForSim].idGraph
                    ) {
                        return true;
                    }
                    return false;
                }
                if (key === "idMobilityMatrix") {
                    // if (
                    //     !newModel[modelForSim][key] &&
                    //     newModel[modelForSim].populationType ===
                    //         "monopopulation"
                    // ) {
                    //     return true;
                    // }
                    // if (
                    //     newModel[modelForSim][key] &&
                    //     newModel[modelForSim].populationType ===
                    //         "metapopulation" &&
                    //     newModel[modelForSim].modelType !== "seirvhd"
                    // ) {
                    //     return true;
                    // }
                    // return false;
                    return true;
                }
                return true;
            }
            return Boolean(newModel[modelForSim][key]);
        });

        if (isInitialConditionsVoid) {
            toast({
                position: bottomLeft,
                title: "Updated failed",
                description:
                    "There is one or more nodes with all initial conditions values as zero ",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } else if (!isRightKeyModels) {
            toast({
                position: bottomLeft,
                title: "Updated failed",
                description: "There is empty parameters setted ",
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

    const deleteMatrix = () => {
        localStorage.removeItem("mobilityMatrixList");
        const mobilityMatrixFiltered = mobilityMatrixList.filter(
            (matrix) => matrix.id !== +idMobility
        );
        localStorage.setItem(
            "mobilityMatrixList",
            JSON.stringify(mobilityMatrixFiltered)
        );
        setMobilityMatrixList({
            type: "remove",
            element: idMobility,
        });
    };

    const veryfyIsSelfName = (idMod: number, currentNameModel: string) => {
        return Boolean(
            completeModel.find(
                (mod: NewModelsAllParams) => mod.idNewModel === idMod
            )?.name === currentNameModel
        );
    };
    return (
        <Flex p="0 2%" mt="20px">
            {modelMode !== "Initial" && (
                <Stack>
                    <InputGroup>
                        <Input
                            size="sm"
                            mr="2%"
                            w="350px"
                            bg="#ffffff"
                            fontSize="0.875rem"
                            placeholder="Name"
                            value={actualModelName}
                            isInvalid={
                                (isRepeatedName &&
                                    !veryfyIsSelfName(id, actualModelName)) ||
                                isEmpty
                            }
                            errorBorderColor="red.300"
                            onChange={(e) => {
                                setActualModelName(e.target.value);
                                setName(e.target.value);
                                setIsRepeatedName(
                                    verifyIsRepeatName(e.target.value)
                                );
                                setIsEmpty(!e.target.value);
                            }}
                        />
                        <Tooltip
                            hasArrow
                            label={
                                isEmpty
                                    ? "model name can't be empty"
                                    : isRepeatedName &&
                                      !veryfyIsSelfName(id, actualModelName)
                                    ? "model name is repeated"
                                    : "Valid name"
                            }
                        >
                            <InputRightElement
                                // eslint-disable-next-line react/no-children-prop
                                children={
                                    // eslint-disable-next-line no-nested-ternary
                                    (isRepeatedName &&
                                        !veryfyIsSelfName(
                                            id,
                                            actualModelName
                                        )) ||
                                    isEmpty ? (
                                        <SmallCloseIcon color="red.300" />
                                    ) : (
                                        <CheckIcon color="green.500" />
                                    )
                                }
                            />
                        </Tooltip>
                    </InputGroup>
                </Stack>
            )}
            <>
                <Stack spacing={4} direction="row" align="center">
                    {modelMode === "add" && (
                        <>
                            <Button
                                leftIcon={<CheckIcon />}
                                onClick={() => {
                                    if (
                                        !isEmpty &&
                                        (!verifyIsRepeatName(actualModelName) ||
                                            veryfyIsSelfName(
                                                id,
                                                actualModelName
                                            ))
                                    ) {
                                        saveModel();
                                    }
                                }}
                                isDisabled={isEmpty}
                                bg="#016FB9"
                                color="#FFFFFF"
                                size="sm"
                                borderRadius="4px"
                                fontSize="0.625rem"
                            >
                                SAVE MODEL
                            </Button>
                            <Button
                                leftIcon={<CloseIcon />}
                                onClick={() => {
                                    deleteMatrix();
                                    setNewModel({
                                        type: "remove",
                                        element: id,
                                    });
                                    setInterventionsCreated({
                                        type: Actions.remove,
                                        id,
                                    });
                                    setModelMode("initial");
                                }}
                                bg="#B9B9C9"
                                color="#FFFFFF"
                                borderRadius="4px"
                                fontSize="0.625rem"
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
                                matrixId={matrixId}
                                verifyName={verifyIsRepeatName}
                                verifySelfName={veryfyIsSelfName}
                                isEmpty={isEmpty}
                            />
                            <Button
                                leftIcon={<CloseIcon />}
                                bg="#B9B9C9"
                                color="#FFFFFF"
                                size="sm"
                                borderRadius="4px"
                                fontSize="0.625rem"
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
