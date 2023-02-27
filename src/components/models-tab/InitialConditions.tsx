/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
import {
    Box,
    Button,
    useToast,
    Flex,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
} from "@chakra-ui/react";
import React, { useContext, useState, useEffect } from "react";

import { NewModelSetted } from "context/NewModelsContext";
import { InitialConditions as InitialConditionsContext } from "types/ControlPanelTypes";
import { NewModelsParams } from "types/SimulationTypes";
import createIdComponent from "utils/createIdcomponent";

import NumberInputInitialConditions from "./NumberInputInitialConditions";

interface Props {
    modelValue: string;
    nodeName: string;
    initialConditions: InitialConditionsContext;
    initialConditionsMode: boolean;
    setInitialConditionsMode: (val: boolean) => void;
    populationValue: string;
}

const InitialConditionsModel = ({
    modelValue,
    nodeName,
    initialConditions,
    initialConditionsMode,
    setInitialConditionsMode,
    populationValue,
}: Props) => {
    const {
        newModel,
        setNewModel,
        idModelUpdate: id,
    } = useContext(NewModelSetted);
    const RealConditions = "real-conditions";
    const toast = useToast();
    const [value, setValue] = useState({
        I: 0,
        I_d: 0,
        I_ac: 0,
        R: 0,
        population: 0,
        Iv_d: 0,
        Iv_ac: 0,
        H_d: 0,
        H: 0,
        D: 0,
        H_cap: 0,
        Iv: 0,
        Sv: 0,
        D_d: 0,
    });
    useEffect(() => {
        if (modelValue === "seirhvd") {
            setValue({
                population: initialConditions.population,
                R: initialConditions.R,
                I: initialConditions.I,
                I_d: initialConditions.I_d,
                I_ac: initialConditions.I_ac,
                Iv_d: initialConditions.Iv_d,
                Iv_ac: initialConditions.Iv_ac,
                H_d: initialConditions.H_d,
                H: initialConditions.H,
                D: initialConditions.D,
                H_cap: initialConditions.H_cap,
                Iv: initialConditions.Iv,
                Sv: initialConditions.Sv,
                D_d: initialConditions.D_d,
            });
        } else {
            setValue({
                I: initialConditions.I,
                I_d: initialConditions.I_d,
                I_ac: initialConditions.I_ac,
                R: initialConditions.R,
                population: initialConditions.population,
                Iv_d: 0,
                Iv_ac: 0,
                H_d: 0,
                H: 0,
                D: 0,
                H_cap: 0,
                Iv: 0,
                Sv: 0,
                D_d: initialConditions.D_d,
            });
        }
    }, [initialConditions, modelValue]);

    return (
        <Flex direction="column">
            <Flex m="2% 1%" flexWrap="wrap">
                {!initialConditionsMode && (
                    <Flex wrap="wrap" w="100%">
                        <Box w="25%">
                            <Stat>
                                <StatLabel fontSize="0.75rem">Total</StatLabel>
                                <StatLabel fontSize="0.75rem">
                                    (Population)
                                </StatLabel>
                                <StatNumber fontSize="xl">
                                    {new Intl.NumberFormat().format(
                                        initialConditions.population
                                    )}
                                </StatNumber>
                            </Stat>
                        </Box>
                        <Box w="25%">
                            <Stat>
                                <StatLabel fontSize="0.75rem">
                                    Removed
                                </StatLabel>
                                <StatLabel fontSize="0.75rem">(R)</StatLabel>
                                <StatNumber fontSize="xl">
                                    {new Intl.NumberFormat().format(
                                        initialConditions.R
                                    )}
                                </StatNumber>
                            </Stat>
                        </Box>
                        <Box w="25%">
                            <Stat>
                                <StatLabel fontSize="0.75rem">
                                    Infected actives
                                </StatLabel>
                                <StatLabel fontSize="0.75rem">(I)</StatLabel>
                                <StatNumber fontSize="xl">
                                    {new Intl.NumberFormat().format(
                                        initialConditions.I
                                    )}
                                </StatNumber>
                            </Stat>
                        </Box>
                        <Box w="25%">
                            <Stat>
                                <StatLabel fontSize="0.75rem">
                                    Infected daily
                                </StatLabel>
                                <StatLabel fontSize="0.75rem">(I_d)</StatLabel>
                                <StatNumber fontSize="xl">
                                    {new Intl.NumberFormat().format(
                                        initialConditions.I_d
                                    )}
                                </StatNumber>
                            </Stat>
                        </Box>
                        <Box w="25%">
                            <Stat>
                                <StatLabel fontSize="0.75rem">
                                    {" "}
                                    Infected accumulated
                                </StatLabel>
                                <StatLabel fontSize="0.75rem">(I_ac)</StatLabel>
                                <StatNumber fontSize="xl">
                                    {new Intl.NumberFormat().format(
                                        initialConditions.I_ac
                                    )}
                                </StatNumber>
                            </Stat>
                        </Box>
                        {modelValue === "seirhvd" && (
                            <>
                                <Box w="25%">
                                    <Stat>
                                        <StatLabel fontSize="0.75rem">
                                            {" "}
                                            Vaccinated Inffected
                                        </StatLabel>
                                        <StatLabel fontSize="0.75rem">
                                            (Iv)
                                        </StatLabel>
                                        <StatNumber fontSize="xl">
                                            {new Intl.NumberFormat().format(
                                                initialConditions.Iv
                                            )}
                                        </StatNumber>
                                    </Stat>
                                </Box>
                                <Box w="25%">
                                    <Stat>
                                        <StatLabel fontSize="0.75rem">
                                            {" "}
                                            Daily new Vaccinated Infected
                                        </StatLabel>
                                        <StatLabel fontSize="0.75rem">
                                            (Iv_d)
                                        </StatLabel>
                                        <StatNumber fontSize="xl">
                                            {new Intl.NumberFormat().format(
                                                initialConditions.Iv_d ?? 0
                                            )}
                                        </StatNumber>
                                    </Stat>
                                </Box>
                                <Box w="25%">
                                    <Stat>
                                        <StatLabel fontSize="0.75rem">
                                            Accumulated Vaccinated Infected
                                        </StatLabel>
                                        <StatLabel fontSize="0.75rem">
                                            (Iv_ac)
                                        </StatLabel>
                                        <StatNumber fontSize="xl">
                                            {new Intl.NumberFormat().format(
                                                initialConditions.Iv_ac ?? 0
                                            )}
                                        </StatNumber>
                                    </Stat>
                                </Box>
                                <Box w="25%">
                                    <Stat>
                                        <StatLabel fontSize="0.75rem">
                                            {" "}
                                            Infected Susceptible
                                        </StatLabel>
                                        <StatLabel fontSize="0.75rem">
                                            (Sv)
                                        </StatLabel>
                                        <StatNumber fontSize="xl">
                                            {new Intl.NumberFormat().format(
                                                initialConditions.Sv
                                            )}
                                        </StatNumber>
                                    </Stat>
                                </Box>
                                <Box w="25%">
                                    <Stat>
                                        <StatLabel fontSize="0.75rem">
                                            Hospitalization Capacity
                                        </StatLabel>
                                        <StatLabel fontSize="0.75rem">
                                            (H_cap)
                                        </StatLabel>
                                        <StatNumber fontSize="xl">
                                            {new Intl.NumberFormat().format(
                                                initialConditions.H_cap
                                            )}
                                        </StatNumber>
                                    </Stat>
                                </Box>
                                <Box w="25%">
                                    <Stat>
                                        <StatLabel fontSize="0.75rem">
                                            {" "}
                                            Daily new Hospitalized
                                        </StatLabel>
                                        <StatLabel fontSize="0.75rem">
                                            (H_d)
                                        </StatLabel>
                                        <StatNumber fontSize="xl">
                                            {new Intl.NumberFormat().format(
                                                initialConditions.H_d ?? 0
                                            )}
                                        </StatNumber>
                                    </Stat>
                                </Box>
                                <Box w="25%">
                                    <Stat>
                                        <StatLabel fontSize="0.75rem">
                                            Hospitalized
                                        </StatLabel>
                                        <StatLabel fontSize="0.75rem">
                                            (H_ac)
                                        </StatLabel>
                                        <StatNumber fontSize="xl">
                                            {new Intl.NumberFormat().format(
                                                initialConditions.H ?? 0
                                            )}
                                        </StatNumber>
                                    </Stat>
                                </Box>
                                <Box w="25%">
                                    <Stat>
                                        <StatLabel fontSize="0.75rem">
                                            Daily new Deaths
                                        </StatLabel>
                                        <StatLabel fontSize="0.75rem">
                                            (D_d)
                                        </StatLabel>
                                        <StatNumber fontSize="xl">
                                            {new Intl.NumberFormat().format(
                                                initialConditions.D_d
                                            )}
                                        </StatNumber>
                                    </Stat>
                                </Box>
                                <Box w="25%">
                                    <Stat>
                                        <StatLabel fontSize="0.75rem">
                                            Deaths
                                        </StatLabel>
                                        <StatLabel fontSize="0.75rem">
                                            (D)
                                        </StatLabel>
                                        <StatNumber fontSize="xl">
                                            {new Intl.NumberFormat().format(
                                                initialConditions.D ?? 0
                                            )}
                                        </StatNumber>
                                    </Stat>
                                </Box>
                            </>
                        )}
                    </Flex>
                )}
                {initialConditionsMode && (
                    <>
                        <NumberInputInitialConditions
                            value={value}
                            setValue={setValue}
                            name="population"
                            description="Total population"
                        />
                        <NumberInputInitialConditions
                            value={value}
                            setValue={setValue}
                            name="R"
                            description="Recovered"
                        />
                        <NumberInputInitialConditions
                            value={value}
                            setValue={setValue}
                            name="I"
                            description="Active infected"
                        />
                        <NumberInputInitialConditions
                            value={value}
                            setValue={setValue}
                            name="I_d"
                            description="New daily infected"
                        />
                        <NumberInputInitialConditions
                            value={value}
                            setValue={setValue}
                            name="I_ac"
                            description="Accumulated infected"
                        />
                        {modelValue === "seirhvd" && (
                            <>
                                <NumberInputInitialConditions
                                    value={value}
                                    setValue={setValue}
                                    name="Iv"
                                    description="Iv"
                                />
                                <NumberInputInitialConditions
                                    value={value}
                                    setValue={setValue}
                                    // name="V"
                                    name="Iv_d"
                                    description="Daily new Vaccinated Infected"
                                />
                                <NumberInputInitialConditions
                                    value={value}
                                    setValue={setValue}
                                    // name="V_acum"
                                    name="Iv_ac"
                                    description="Accumulated Vaccinated Infected"
                                />
                                <NumberInputInitialConditions
                                    value={value}
                                    setValue={setValue}
                                    name="Sv"
                                    description="Sv"
                                />
                                <NumberInputInitialConditions
                                    value={value}
                                    setValue={setValue}
                                    name="H_cap"
                                    description="H_cap"
                                />
                                <NumberInputInitialConditions
                                    value={value}
                                    setValue={setValue}
                                    name="H_d"
                                    description="Daily new Hospitalized"
                                />
                                <NumberInputInitialConditions
                                    value={value}
                                    setValue={setValue}
                                    // name="H_acum"
                                    name="H"
                                    description="Hospitalized"
                                />
                                <NumberInputInitialConditions
                                    value={value}
                                    setValue={setValue}
                                    name="D_d"
                                    // name="D"
                                    description="D_d"
                                />
                                <NumberInputInitialConditions
                                    value={value}
                                    setValue={setValue}
                                    name="D"
                                    // name="D_d"
                                    description="D_acum"
                                />
                            </>
                        )}
                    </>
                )}
            </Flex>
            {initialConditionsMode && (
                <Flex justify="center">
                    <Button
                        id={createIdComponent()}
                        mr="10%"
                        bg="#016FB9"
                        color="#ffffff"
                        onClick={() => {
                            const isAllZero = Object.values(value).every(
                                (element: number) => element === 0
                            );
                            if (!isAllZero) {
                                if (populationValue === "monopopulation") {
                                    setNewModel({
                                        type: "update-initial-conditions",
                                        payloadInitialConditions: [
                                            {
                                                name: nodeName,
                                                conditionsValues: value,
                                            },
                                        ],
                                        id,
                                    });
                                }
                                if (populationValue === "metapopulation") {
                                    let initialConditionsNews = [];

                                    const newModelAux = newModel;
                                    const initialConditionsModel = [
                                        ...newModelAux,
                                    ].filter((model: NewModelsParams) => {
                                        return model.idNewModel === id;
                                    })[0].initialConditions;

                                    initialConditionsModel.forEach((icNode) => {
                                        if (icNode.name === nodeName) {
                                            initialConditionsNews = [
                                                ...initialConditionsNews,
                                                {
                                                    name: icNode.name,
                                                    conditionsValues: value,
                                                },
                                            ];
                                            return initialConditionsNews;
                                        }
                                        initialConditionsNews = [
                                            ...initialConditionsNews,
                                            icNode,
                                        ];
                                        return initialConditionsNews;
                                    });
                                    setNewModel({
                                        type: "update-initial-conditions",
                                        payloadInitialConditions:
                                            initialConditionsNews,
                                        id,
                                    });
                                }
                                toast({
                                    position: "bottom-left",
                                    title: "Updated successful",
                                    description:
                                        "Updating Initial conditions was successful",
                                    status: "success",
                                    duration: 3000,
                                    isClosable: true,
                                });
                                setInitialConditionsMode(false);
                            } else {
                                toast({
                                    position: "bottom-left",
                                    title: "Updated failed",
                                    description:
                                        "Initial conditions can't be all zero.",
                                    status: "error",
                                    duration: 3000,
                                    isClosable: true,
                                });
                                setInitialConditionsMode(false);
                            }
                        }}
                    >
                        Update
                    </Button>
                    <Button
                        ml="0.5rem"
                        colorScheme="gray"
                        onClick={() => {
                            setInitialConditionsMode(false);
                        }}
                    >
                        Cancel
                    </Button>
                </Flex>
            )}
        </Flex>
    );
};

export default InitialConditionsModel;
