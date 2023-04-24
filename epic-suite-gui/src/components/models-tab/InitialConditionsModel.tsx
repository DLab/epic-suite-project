import { EditIcon } from "@chakra-ui/icons";
import {
    Box,
    Flex,
    Text,
    IconButton,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Heading,
} from "@chakra-ui/react";
import React, { useState } from "react";

import type { InitialConditionsNewModel } from "types/ControlPanelTypes";
import createIdComponent from "utils/createIdcomponent";

import InitialConditions from "./InitialConditions";
import SelectDate from "./SelectDate";

interface Props {
    modelName: string;
    modelValue: string;
    populationValue: string;
    dataSourceValue: string;
    idGeo: number;
    idGraph: number;
    initialConditionsGraph: InitialConditionsNewModel[];
    startDate: Date;
    setStartDate: (value: Date) => void;
}

/**
 * Controls the mode in which the initial conditions will be displayed: view or edit.
 * @subcategory NewModel
 * @component
 */
const InitialConditiosModels = ({
    modelName,
    modelValue,
    populationValue,
    dataSourceValue,
    idGeo,
    idGraph,
    initialConditionsGraph,
    startDate,
    setStartDate,
}: Props) => {
    const [initialConditionsMode, setInitialConditionsMode] = useState(false);

    /**
     * Switches to view or edit mode of the initial conditions.
     */
    const editInitialConditions = () => {
        setInitialConditionsMode(true);
    };

    return (
        <Box maxH="100%" borderRadius="8px" p="2%" border="1px solid #DDDDDD">
            <Flex justify="space-between" mb="1rem">
                <Flex>
                    <Text fontSize="1rem" fontWeight={700} alignSelf="center">
                        Initial Conditions
                    </Text>
                    {(idGraph !== 0 || idGeo !== 0) &&
                        !initialConditionsMode && (
                            <IconButton
                                bg="#016FB9"
                                color="#FFFFFF"
                                aria-label="Call Segun"
                                size="xs"
                                ml="1rem"
                                alignSelf="center"
                                cursor="pointer"
                                _hover={{ bg: "blue.500" }}
                                icon={<EditIcon />}
                                onClick={() => {
                                    editInitialConditions();
                                }}
                            />
                        )}
                </Flex>
                <Flex>
                    {dataSourceValue === "geographic" &&
                        !initialConditionsMode && (
                            <>
                                <Text
                                    fontSize="0.875rem"
                                    fontWeight={500}
                                    mr="15px"
                                    alignSelf="center"
                                >
                                    Date
                                </Text>
                                <SelectDate
                                    modelName={modelName}
                                    modelValue={modelValue}
                                    idGeo={idGeo}
                                    startDate={startDate}
                                    setStartDate={setStartDate}
                                    populationValue={populationValue}
                                    initialConditionsGraph={
                                        initialConditionsGraph
                                    }
                                />
                            </>
                        )}
                </Flex>
            </Flex>
            <Accordion allowToggle>
                {initialConditionsGraph.map((node, _i, array) => {
                    if (array.length === 1) {
                        return (
                            <InitialConditions
                                key={createIdComponent()}
                                modelValue={modelValue}
                                nodeName={initialConditionsGraph[0].name}
                                initialConditions={
                                    initialConditionsGraph[0].conditionsValues
                                }
                                initialConditionsMode={initialConditionsMode}
                                setInitialConditionsMode={
                                    setInitialConditionsMode
                                }
                                populationValue={populationValue}
                            />
                        );
                    }
                    return (
                        <AccordionItem key={createIdComponent()}>
                            <Heading>
                                <AccordionButton>
                                    <Box
                                        flex="1"
                                        textAlign="left"
                                        fontSize="0.875rem"
                                    >
                                        {node.name}
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                            </Heading>
                            <AccordionPanel pb={4} bg="#FFFFFF">
                                <InitialConditions
                                    modelValue={modelValue}
                                    nodeName={node.name}
                                    initialConditions={node.conditionsValues}
                                    initialConditionsMode={
                                        initialConditionsMode
                                    }
                                    setInitialConditionsMode={
                                        setInitialConditionsMode
                                    }
                                    populationValue={populationValue}
                                />
                            </AccordionPanel>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </Box>
    );
};

export default InitialConditiosModels;
