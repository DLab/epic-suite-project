/* eslint-disable complexity */
import { AddIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
    Button,
    Flex,
    HStack,
    Select,
    Stack,
    useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import type React from "react";

import { InterventionColection } from "../../context/InterventionsContext";
import { NewModelSetted } from "context/NewModelsContext";
import { TabIndex } from "context/TabContext";
import {
    Actions,
    InterventionsModes,
    NonpharmaceuticalSubStrategy,
    PharmaceuticalSubStrategy,
    TypeStrategy,
} from "types/InterventionsTypes";
import type { InterventionsTypes } from "types/InterventionsTypes";
import type { NewModelsParams } from "types/SimulationTypes";
import createIdComponent from "utils/createIdcomponent";

import strategyFactory from "./strategyFactory";

interface Props {
    setStrategy: (val: unknown) => void;
    strategy: unknown[];
    setData: React.Dispatch<React.SetStateAction<[] | InterventionsTypes[]>>;
    data: [] | InterventionsTypes[];
}

const InterventionsNameAndButtons = ({
    setStrategy,
    strategy,
    setData,
    data,
}: Props) => {
    const toast = useToast();
    const {
        interventionsMode,
        setInterventionMode,
        interventionsCreated,
        setInterventionsCreated,
        originOfInterventionCreation,
        setOriginOfInterventionCreation,
        setIdInterventionToUpdate,
        idInterventionModel,
        setIdInterventionModel,
    } = useContext(InterventionColection);
    const { newModel, setNewModel } = useContext(NewModelSetted);
    const { setIndex } = useContext(TabIndex);
    const [isModelChoose, setIsModelChoose] = useState(false);
    const [typeIntervention, setTypeIntervention] = useState("");
    const [selectedModel, setSelectedModel] = useState(
        idInterventionModel ?? 0
    );

    const [strategyLocal, setStrategyLocal] = useState("");
    useEffect(() => {
        if (strategy.length === 0) {
            setIsModelChoose(false);
        }
    }, [strategy]);

    const handleCancel = () => {
        setInterventionMode(InterventionsModes.Initial);
        setIdInterventionToUpdate(0);
        setStrategy([]);
        // setIdInterventionModel(0);
    };
    useEffect(() => {
        setSelectedModel(idInterventionModel);
    }, [idInterventionModel]);

    return (
        <Flex w="100%" p="0 2%" mt="1.25rem" justify="space-between">
            <Flex
                p="5px"
                border="1px"
                borderRadius="10px"
                borderColor="#DDDDDD"
                w="60%"
                justify="space-between"
            >
                <HStack w="80%">
                    <Select
                        onChange={(e) => setSelectedModel(+e.target.value)}
                        placeholder="Select a model"
                        size="sm"
                        w="25%"
                        isDisabled={isModelChoose || Boolean(selectedModel)}
                        value={selectedModel}
                    >
                        {newModel.map(
                            (model: NewModelsParams, i: React.Key) => (
                                <option
                                    key={createIdComponent()}
                                    value={model.idNewModel}
                                >
                                    {model.name !== ""
                                        ? model.name
                                        : "Model without name"}
                                </option>
                            )
                        )}
                    </Select>
                    <Select
                        size="sm"
                        onChange={(e) => {
                            setStrategyLocal(e.target.value);
                            setTypeIntervention("");
                        }}
                        placeholder="Select strategy of intervention"
                        w="25%"
                    >
                        <option value={TypeStrategy.Pharmaceutical}>
                            {TypeStrategy.Pharmaceutical}
                        </option>
                        <option value={TypeStrategy.Nonpharmaceutical}>
                            {TypeStrategy.Nonpharmaceutical}
                        </option>
                    </Select>
                    {strategyLocal === TypeStrategy.Pharmaceutical && (
                        <Select
                            size="sm"
                            onChange={(e) =>
                                setTypeIntervention(e.target.value)
                            }
                            placeholder="Select type of Pharmaceutical Intervention "
                            w="25%"
                        >
                            <option
                                value={PharmaceuticalSubStrategy.Vaccination}
                            >
                                {PharmaceuticalSubStrategy.Vaccination}
                            </option>
                        </Select>
                    )}
                    {strategyLocal === TypeStrategy.Nonpharmaceutical && (
                        <Select
                            size="sm"
                            onChange={(e) =>
                                setTypeIntervention(e.target.value)
                            }
                            placeholder="Select type of Nonpharmaceutical Intervention "
                            w="25%"
                        >
                            <option
                                value={NonpharmaceuticalSubStrategy.LockDown}
                            >
                                {NonpharmaceuticalSubStrategy.LockDown}
                            </option>
                            <option
                                value={
                                    NonpharmaceuticalSubStrategy.CordonSanitaire
                                }
                            >
                                Sanitaire Cordon
                            </option>
                        </Select>
                    )}
                </HStack>
                <Button
                    size="sm"
                    fontSize="0.625rem"
                    bg="#3EBFE0"
                    color="#FFFFFF"
                    onClick={() => {
                        setData((prev) => [
                            ...prev,
                            {
                                ...strategyFactory[strategyLocal][
                                    typeIntervention
                                ],
                            },
                        ]);
                        setStrategy((prev) => [
                            ...prev,
                            {
                                type: strategyLocal,
                                subtype: typeIntervention,
                            },
                        ]);
                        setIsModelChoose(true);
                    }}
                    isDisabled={Boolean(
                        !selectedModel ||
                            !strategyLocal ||
                            (strategyLocal === "pharmaceutical" &&
                                !typeIntervention)
                    )}
                >
                    <AddIcon />
                </Button>
            </Flex>
            <Stack spacing={4} direction="row" align="center">
                {interventionsMode === InterventionsModes.Add && (
                    <>
                        <Button
                            size="sm"
                            fontSize="0.625rem"
                            bg="#016FB9"
                            color="#FFFFFF"
                            leftIcon={<CheckIcon />}
                            onClick={() => {
                                setInterventionsCreated({
                                    type: Actions.add,
                                    payload: {
                                        id: selectedModel,
                                        modelId: selectedModel,
                                        name: `${selectedModel}`,
                                        interventions: data,
                                    },
                                });
                                setNewModel({
                                    type: "update",
                                    id: selectedModel,
                                    target: "idIntervention",
                                    element: selectedModel,
                                });

                                // -----> DESCOMENTAR CUANDO HAYA FINALIZADO EL UPDATE
                                //
                                // window.localStorage.setItem(
                                //     "Interventions",
                                //     JSON.stringify([
                                //         ...interventionsCreated,
                                //         {
                                //             id: selectedModel,
                                //             modelId: selectedModel,
                                //             name: "asdf",
                                //             interventions: data,
                                //         },
                                //     ])
                                // );

                                setIdInterventionToUpdate(0);
                                setIdInterventionModel(0);
                                setInterventionMode(InterventionsModes.Initial);
                                setData([]);
                                setStrategy([]);
                                if (
                                    originOfInterventionCreation === "modelsTab"
                                ) {
                                    setIndex(1);
                                } else {
                                    setIndex(0);
                                }
                            }}
                            isDisabled={Boolean(
                                !selectedModel ||
                                    !strategyLocal ||
                                    (strategyLocal === "pharmaceutical" &&
                                        !typeIntervention)
                            )}
                        >
                            Apply
                        </Button>
                        <Button
                            leftIcon={<CloseIcon />}
                            onClick={() => {
                                handleCancel();
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
                {interventionsMode === InterventionsModes.Update && (
                    <>
                        <Button
                            size="sm"
                            fontSize="0.625rem"
                            bg="#016FB9"
                            color="#FFFFFF"
                            leftIcon={<CheckIcon />}
                            onClick={() => {
                                if (data.length === 0) {
                                    setInterventionsCreated({
                                        type: Actions.remove,
                                        id: selectedModel,
                                    });
                                } else {
                                    setInterventionsCreated({
                                        type: Actions.update,
                                        payload: {
                                            id: selectedModel,
                                            modelId: selectedModel,
                                            name: `${selectedModel}`,
                                            interventions: data,
                                        },
                                        id: selectedModel,
                                    });
                                    // window.localStorage.setItem(
                                    //     "Interventions",
                                    //     JSON.stringify([
                                    //         ...interventionsCreated,
                                    //         {
                                    //             id: selectedModel,
                                    //             modelId: selectedModel,
                                    //             name: "asdf",
                                    //             interventions: data,
                                    //         },
                                    //     ])
                                    // );
                                }

                                setIdInterventionToUpdate(0);
                                setIdInterventionModel(0);
                                setInterventionMode(InterventionsModes.Initial);
                                setData([]);
                                setStrategy([]);
                                if (
                                    originOfInterventionCreation === "modelsTab"
                                ) {
                                    setIndex(1);
                                } else {
                                    setIndex(0);
                                }
                            }}
                        >
                            UPDATE CHANGES
                        </Button>
                        <Button
                            leftIcon={<CloseIcon />}
                            onClick={() => {
                                handleCancel();
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
            </Stack>
        </Flex>
    );
};

export default InterventionsNameAndButtons;
