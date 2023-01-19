import { EditIcon, InfoIcon, WarningIcon } from "@chakra-ui/icons";
import {
    Box,
    Text,
    RadioGroup,
    Stack,
    Radio,
    Select,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    IconButton,
    Flex,
    Tooltip,
    Button,
    Divider,
} from "@chakra-ui/react";
import { format } from "date-fns";
import React, { useCallback, useContext, useEffect, useState } from "react";

import { NewModelSetted } from "context/NewModelsContext";
import { SelectFeature } from "context/SelectFeaturesContext";
import { TabIndex } from "context/TabContext";
import countiesData from "data/counties.json";
import stateData from "data/states.json";
import { Model } from "types/ControlPanelTypes";

import getInitialConditionsByModel, {
    getPreviusInitialConditions,
} from "./initialConditionsByModel";

interface Props {
    modelName: string;
    setModelName: (value: string) => void;
    modelValue: string;
    setModelValue: (value: string) => void;
    populationValue: string;
    setPopulationValue: (value: string) => void;
    numberOfNodes: number;
    setNumberOfNodes: (value: number) => void;
    dataSourceValue: undefined | string;
    setDataSourceValue: (value: string) => void;
    areaSelectedValue: undefined | string | number;
    setAreaSelectedValue: (value: number | string) => void;
    graphId: number;
    setGraphId: (value: number) => void;
    showSectionInitialConditions: boolean;
    setShowSectionInitialConditions: (value: boolean) => void;
    graphsSelectedValue: undefined | string[];
    setGraphsSelectedValue: (value: string[]) => void;
}

/**
 * Accordion with the necessary configurations to create a model.
 * @subcategory NewModel
 * @component
 */
const ModelAccordion = ({
    modelName,
    setModelName,
    modelValue,
    setModelValue,
    populationValue,
    setPopulationValue,
    numberOfNodes,
    setNumberOfNodes,
    dataSourceValue,
    setDataSourceValue,
    areaSelectedValue,
    setAreaSelectedValue,
    graphId,
    setGraphId,
    showSectionInitialConditions,
    setShowSectionInitialConditions,
    graphsSelectedValue,
    setGraphsSelectedValue,
}: Props) => {
    const [numberOfGraphs, setNumberOfGraphs] = useState(undefined);
    const [isDisabled, setIsDisabled] = useState(false);
    const [geoSelections, setGeoSelections] = useState([]);
    const [minGraphValue, setMinGraphValue] = useState(2);
    const {
        geoSelections: allGeoSelections,
        setMode,
        setOriginOfGeoCreation,
    } = useContext(SelectFeature);
    const {
        newModel,
        setNewModel,
        idModelUpdate: id,
    } = useContext(NewModelSetted);
    const { setIndex } = useContext(TabIndex);

    useEffect(() => {
        if (populationValue === "monopopulation") {
            setIsDisabled(true);
            setNumberOfGraphs(1);
            setMinGraphValue(1);
        } else {
            setIsDisabled(false);
            setNumberOfGraphs(2);
            setMinGraphValue(2);
        }
    }, [populationValue]);

    /**
     * Returns the saved value of the requested parameter.
     */
    const getDefaultValueParameters = useCallback(
        (field) => {
            return newModel.find(({ idNewModel }) => idNewModel === id)[field];
        },
        [newModel, id]
    );

    useEffect(() => {
        if (
            dataSourceValue === "graph" &&
            graphId !== 0 &&
            graphId !== undefined
        ) {
            setNumberOfGraphs(getDefaultValueParameters("numberNodes"));
        }
    }, [dataSourceValue, getDefaultValueParameters, graphId]);

    useEffect(() => {
        if (modelValue === "seirhvd") {
            const getGeoSelectionNoCounties = [...allGeoSelections].filter(
                (e) => {
                    return e.scale !== "Counties";
                }
            );
            setGeoSelections(getGeoSelectionNoCounties);
        } else {
            setGeoSelections(allGeoSelections);
        }
    }, [modelValue, allGeoSelections]);

    let graphsArray = [];
    /**
     * Returns a list with the names of the nodes format: "Node + index of the node".
     * @param {number} graphsNumber number of model nodes.
     * @returns {string[]}
     */
    const getGraphsNamesArray = (graphsNumber) => {
        for (let i = 0; i < graphsNumber; i += 1) {
            const graphName = `Node ${i + 1}`;
            graphsArray = [...graphsArray, graphName];
        }
        return graphsArray;
    };

    /**
     * Returns the initial conditions for graphs.
     * @param {string[]} graphsValuesArray list with node names.
     * @returns {InitialConditionsNewModel}
     */
    const getInitialConditionsGraphsArray = (graphsValuesArray) => {
        const previusInitialConditions =
            getDefaultValueParameters("initialConditions");
        const previusTypeSelection = getDefaultValueParameters("typeSelection");

        if (
            previusInitialConditions.length > 0 &&
            previusTypeSelection !== "geographic"
        ) {
            return graphsValuesArray.map((graph, index) => {
                return {
                    name: graph,
                    conditionsValues: getPreviusInitialConditions(
                        modelValue,
                        previusInitialConditions[index].conditionsValues
                    ),
                };
            });
        }
        return graphsValuesArray.map((graph) => {
            return {
                name: graph,
                conditionsValues: getInitialConditionsByModel(modelValue),
            };
        });
    };

    useEffect(() => {
        if (areaSelectedValue !== "" && areaSelectedValue !== undefined) {
            setAreaSelectedValue(getDefaultValueParameters("idGeo"));
        } else {
            setAreaSelectedValue(getDefaultValueParameters(undefined));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getDefaultValueParameters, areaSelectedValue]);
    /* dispatch to simulationContext data about type selection 
  when select value is changed. Besides, modify other contexts values */

    /**
     * Provides the initial conditions for geographic areas.
     * @param scale scale of geographic selection.
     * @param {string[]} featureSelected list with county or state fips.
     * @returns {InitialConditionsNewModel}
     */
    const getInitialConditionsGeoArray = (scale, featureSelected) => {
        return featureSelected.map((feature) => {
            if (scale === "States") {
                return {
                    name: stateData.data.find(
                        (state) => state[0] === feature
                    )[2],
                    conditionsValues: getInitialConditionsByModel(modelValue),
                };
            }
            return {
                name: countiesData.data.find(
                    (state) => state[5] === feature
                )[7],
                conditionsValues: getInitialConditionsByModel(modelValue),
            };
        });
    };

    const getInitialConditions = (graphsValuesArray) => {
        let initialConditionsValue;
        const geoSelected = allGeoSelections.find((geoSelection) => {
            return geoSelection.id === +areaSelectedValue;
        });
        if (dataSourceValue === "graph") {
            initialConditionsValue =
                getInitialConditionsGraphsArray(graphsValuesArray);
        }
        if (dataSourceValue === "geographic") {
            initialConditionsValue =
                numberOfNodes === 1
                    ? [
                          {
                              name: geoSelected.name,
                              conditionsValues:
                                  getInitialConditionsByModel(modelValue),
                          },
                      ]
                    : getInitialConditionsGeoArray(
                          geoSelected.scale,
                          geoSelected.featureSelected
                      );
        }
        return initialConditionsValue;
    };

    return (
        <>
            <Box mb="3%">
                <Text fontSize="16px" fontWeight={700} mb="5%">
                    Model type
                </Text>
                <RadioGroup
                    size="sm"
                    mt="1%"
                    mb="5%"
                    value={modelValue}
                    onChange={(e) => {
                        setNumberOfNodes(0);
                        setModelValue(e);
                        setAreaSelectedValue("");
                        setGraphId(undefined);
                    }}
                >
                    <Stack direction="row" spacing="24px">
                        <Radio value="sir">SIR</Radio>
                        <Radio value="seir">SEIR</Radio>
                        <Radio value="seirhvd">SEIRHVD</Radio>
                    </Stack>
                </RadioGroup>
                <Divider orientation="horizontal" />
            </Box>
            <Box mb="3%">
                <Text fontSize="16px" fontWeight={700} mb="5%">
                    Population
                </Text>
                <RadioGroup
                    size="sm"
                    mt="1%"
                    mb="5%"
                    value={populationValue}
                    onChange={(e) => {
                        setPopulationValue(e);
                        setAreaSelectedValue("");
                        setNumberOfNodes(0);
                        setGraphId(undefined);
                    }}
                >
                    <Stack direction="row" spacing="24px">
                        <Radio value="monopopulation">Monopopulation</Radio>
                        <Radio value="metapopulation">Metapopulation</Radio>
                    </Stack>
                </RadioGroup>
                <Divider orientation="horizontal" />
            </Box>
            <Box mb="3%">
                <Text fontSize="16px" fontWeight={700} mb="5%">
                    Population Data
                </Text>
                <Flex>
                    <RadioGroup
                        size="sm"
                        mt="1%"
                        // mb="5%"
                        value={dataSourceValue}
                        onChange={(e) => {
                            setDataSourceValue(e);
                            setAreaSelectedValue("");
                            setNumberOfNodes(0);
                            setGraphId(undefined);
                        }}
                    >
                        <Stack direction="row" spacing="24px">
                            <Radio value="graph">Artificial</Radio>
                            <Radio value="geographic">Geographic</Radio>
                        </Stack>
                    </RadioGroup>
                    <Flex m="1% 0 0 6%" alignItems="center" w="100%">
                        <Tooltip
                            label="To build geographic models, first you have to create geographic selections."
                            bg="#016FB9"
                            fontSize="14px"
                        >
                            <WarningIcon color="#016FB9" />
                        </Tooltip>
                        <Text
                            color="#016FB9"
                            fontSize="14px"
                            textDecorationLine="underline"
                            cursor="pointer"
                            ml="4%"
                            onClick={() => {
                                setMode(Model.Add);
                                setOriginOfGeoCreation("modelsTab");
                                setIndex(2);
                            }}
                        >
                            + Add selection
                        </Text>
                    </Flex>
                </Flex>
                {/* <Divider orientation="horizontal" /> */}
            </Box>
            {dataSourceValue === "graph" && (
                <Flex mb="3%" alignItems="end">
                    <Box>
                        <Text fontSize="14px" fontWeight={500}>
                            Number of nodes
                        </Text>
                        <NumberInput
                            size="sm"
                            defaultValue={2}
                            min={minGraphValue}
                            max={30}
                            value={numberOfGraphs}
                            onChange={(e) => {
                                setNumberOfGraphs(+e);
                            }}
                            isDisabled={isDisabled}
                        >
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </Box>
                    <Button
                        aria-label="Search database"
                        bg="#16609E"
                        color="#FFFFFF"
                        size="sm"
                        ml="5%"
                        // icon={<EditIcon />}
                        onClick={() => {
                            setNumberOfNodes(numberOfGraphs);
                            const graphsValuesArray =
                                getGraphsNamesArray(numberOfGraphs);
                            setGraphsSelectedValue(graphsValuesArray);
                            setGraphId(1);
                            setShowSectionInitialConditions(true);
                            setAreaSelectedValue(undefined);
                            setNewModel({
                                type: "update-all",
                                id,
                                payload: {
                                    idNewModel: id,
                                    name: modelName,
                                    modelType: modelValue,
                                    populationType: populationValue,
                                    typeSelection: dataSourceValue,
                                    idGeo: undefined,
                                    idGraph: 1,
                                    numberNodes: numberOfGraphs,
                                    t_init: format(
                                        new Date(2021, 11, 31),
                                        "yyyy/MM/dd"
                                    ),
                                    initialConditions:
                                        getInitialConditionsGraphsArray(
                                            graphsValuesArray
                                        ),
                                },
                            });
                        }}
                    >
                        APPLY
                    </Button>
                    <Tooltip label="Set Initial conditions to register model">
                        <IconButton
                            aria-label="Search database"
                            bg="#FFFFFF"
                            color="#16609E"
                            size="sm"
                            ml="5%"
                            icon={<InfoIcon />}
                        />
                    </Tooltip>
                </Flex>
            )}
            {dataSourceValue === "geographic" && (
                <Box mb="3%">
                    <Flex>
                        <Select
                            w="13rem"
                            fontSize="14px"
                            size="sm"
                            placeholder="Select area"
                            value={areaSelectedValue}
                            onChange={(e) => {
                                if (e.target.value !== "") {
                                    setAreaSelectedValue(+e.target.value);
                                    const geoSelected = allGeoSelections.find(
                                        (geoSelection) => {
                                            return (
                                                geoSelection.id ===
                                                +e.target.value
                                            );
                                        }
                                    );
                                    const numberGeoNodes =
                                        populationValue === "monopopulation"
                                            ? 1
                                            : geoSelected.featureSelected
                                                  .length;
                                    setNumberOfNodes(numberGeoNodes);
                                    setNumberOfNodes(
                                        geoSelected.featureSelected.length
                                    );
                                    setGraphId(undefined);
                                    setNewModel({
                                        type: "update-all",
                                        id,
                                        payload: {
                                            idNewModel: id,
                                            name: modelName,
                                            modelType: modelValue,
                                            populationType: populationValue,
                                            typeSelection: dataSourceValue,
                                            idGeo: +e.target.value,
                                            idGraph: undefined,
                                            numberNodes: numberGeoNodes,
                                            t_init: format(
                                                new Date(2022, 4, 31),
                                                "yyyy/MM/dd"
                                            ),
                                            initialConditions:
                                                numberGeoNodes === 1
                                                    ? [
                                                          {
                                                              name: geoSelected.name,
                                                              conditionsValues:
                                                                  getInitialConditionsByModel(
                                                                      modelValue
                                                                  ),
                                                          },
                                                      ]
                                                    : getInitialConditionsGeoArray(
                                                          geoSelected.scale,
                                                          geoSelected.featureSelected
                                                      ),
                                        },
                                    });
                                } else {
                                    setAreaSelectedValue("");
                                    setNumberOfNodes(0);
                                }
                            }}
                        >
                            {allGeoSelections.length > 0 &&
                                geoSelections.map((e) => {
                                    return (
                                        <option key={e.id} value={e.id}>
                                            {e.name}
                                        </option>
                                    );
                                })}
                        </Select>
                        <IconButton
                            aria-label="Search database"
                            bg="#16609E"
                            color="#FFFFFF"
                            size="sm"
                            ml="5%"
                            icon={<EditIcon />}
                            onClick={() => {
                                setShowSectionInitialConditions(true);
                            }}
                        />
                        <Tooltip label="Set Initial conditions to register model">
                            <IconButton
                                aria-label="Search database"
                                bg="#FFFFFF"
                                color="#16609E"
                                size="sm"
                                ml="5%"
                                icon={<InfoIcon />}
                            />
                        </Tooltip>
                    </Flex>
                </Box>
            )}
        </>
    );
};

export default ModelAccordion;
