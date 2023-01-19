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
} from "@chakra-ui/react";
import React, { useState } from "react";

import { InitialConditionsNewModel } from "types/ControlPanelTypes";

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
        <Box
            maxH="100%"
            // bg="#FAFAFA"
            borderRadius="8px"
            p="2%"
            border="1px solid #DDDDDD"
            // boxShadow="sm"
            // overflowY="auto"
        >
            <Flex justify="space-between">
                <Flex>
                    <Text
                        fontSize="14px"
                        fontWeight={500}
                        mr="15px"
                        alignSelf="center"
                    >
                        Initial Conditions
                    </Text>
                    {(idGraph !== 0 || idGeo !== 0) && !initialConditionsMode && (
                        <IconButton
                            bg="#16609E"
                            color="#FFFFFF"
                            aria-label="Call Segun"
                            size="sm"
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
                                    fontSize="14px"
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

            {initialConditionsGraph.length === 1 && (
                <InitialConditions
                    modelValue={modelValue}
                    nodeName={initialConditionsGraph[0].name}
                    initialConditions={
                        initialConditionsGraph[0].conditionsValues
                    }
                    initialConditionsMode={initialConditionsMode}
                    setInitialConditionsMode={setInitialConditionsMode}
                    populationValue={populationValue}
                />
            )}
            {initialConditionsGraph.length > 1 &&
                initialConditionsGraph.map((node) => {
                    return (
                        <Accordion
                            key={`initial-conditions-accordion-${node.name}`}
                            allowMultiple
                        >
                            <AccordionItem>
                                <h2>
                                    <AccordionButton
                                        color="#16609E"
                                        border="none"
                                        borderBottom="2px solid #16609E"
                                        _focus={{
                                            boxShadow: "none",
                                        }}
                                    >
                                        <Box flex="1" textAlign="left">
                                            {node.name}
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4} bg="#FFFFFF">
                                    <InitialConditions
                                        modelValue={modelValue}
                                        nodeName={node.name}
                                        initialConditions={
                                            node.conditionsValues
                                        }
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
                        </Accordion>
                    );
                })}
        </Box>
    );
};

export default InitialConditiosModels;
