import { AddIcon, InfoIcon } from "@chakra-ui/icons";
import {
    Checkbox,
    Text,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Button,
    useToast,
    Icon,
    Flex,
    Tooltip,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";

import { GraphicsData } from "context/GraphicsContext";
import { NewModelSetted } from "context/NewModelsContext";
import { TabIndex } from "context/TabContext";
import { NewModelsAllParams } from "types/SimulationTypes";
import createIdComponent from "utils/createIdcomponent";
import getNodeName from "utils/getNodeNames";

type ReducerForMetapopulationSelections = Record<number, boolean>;
type ReducerForAllLists = Record<number, boolean>;

/**
 * Table to select parameters to graph in metapopulation models.
 * @subcategory Results
 * @component
 */
const MetapopulationSelectTable = () => {
    const { aux } = useContext(TabIndex);
    const metaData = JSON.parse(aux);
    const toast = useToast();
    const [checkList, setCheckList] =
        useState<ReducerForMetapopulationSelections>({});
    const [checkAllList, setCheckAllList] = useState<ReducerForAllLists>({});
    const [displayedParameters, setDisplayedParameters] = useState([]);
    const { selectedModelsToSimulate } = useContext(NewModelSetted);
    const {
        allGraphicData,
        setAllGraphicData,
        setAllResults,
        dataToShowInMap,
        realDataSimulationKeys,
    } = useContext(GraphicsData);
    const [parametersNotDisplayed, setParametersNotDisplayed] = useState([]);
    const [realMetaData, setRealMetaData] = useState({});
    const [nodesNames, setNodesNames] = useState({});

    useEffect(() => {
        setRealMetaData(realDataSimulationKeys);
    }, [realDataSimulationKeys]);

    useEffect(() => {
        let nodesNamesAux = {};
        metaData.map((node) => {
            nodesNamesAux = {
                ...nodesNamesAux,
                [node.name]: getNodeName(node.name, false),
            };
            return nodesNamesAux;
        });
        setNodesNames(nodesNamesAux);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const { parameters } = selectedModelsToSimulate.filter(
            (sim: NewModelsAllParams) => {
                return sim.populationType === "metapopulation";
            }
        )[0];

        setDisplayedParameters(parameters.compartments);
    }, [selectedModelsToSimulate]);

    /**
     * Gets a list of simulated parameters that are not displayed in the table.
     * @returns {string[]} list of parameters.
     */
    const getNotDisplayedSimParameters = () => {
        return Object.keys(metaData[0]).filter((parameter) => {
            return !displayedParameters.includes(parameter);
        });
    };

    /**
     * Gets a list of real parameters that are not displayed in the table.
     * @returns {string[]} list of parameters.
     */
    const getNoDisplayedRealParameters = () => {
        if (!realMetaData[0]) return [];
        const notDisplayedRealDataList = Object.keys(realMetaData[0]).filter(
            (parameter) => {
                return parameter !== "name" && parameter !== "Compartment";
            }
        );
        const realDataList = notDisplayedRealDataList.map((parameter) => {
            return `${parameter} Real`;
        });

        return realDataList.filter((parameter) => {
            return !displayedParameters.includes(parameter);
        });
    };

    useEffect(() => {
        const notDisplayedPametersList = getNotDisplayedSimParameters();
        const realDataList = getNoDisplayedRealParameters();
        const allParametersList = notDisplayedPametersList.concat(realDataList);
        setParametersNotDisplayed(allParametersList);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [displayedParameters, realMetaData]);

    /**
     * Check the same parameter on all nodes.
     * @param isCheckedListUpdate list with parent parameters checked.
     * @param value parent parameter to check.
     */
    const checkAllParameters = (isCheckedListUpdate, value) => {
        let checkListAux = checkList;
        const allCheckListFiltered = Object.keys(isCheckedListUpdate).filter(
            (param) => {
                return param === value;
            }
        );
        allCheckListFiltered.forEach((elem) => {
            if (isCheckedListUpdate[elem]) {
                metaData.forEach((node) => {
                    const newCheckList = {
                        ...checkListAux,
                        [`${elem}-${node.name}`]: true,
                    };
                    checkListAux = newCheckList;
                    // setCheckList(newCheckList);
                });
            } else {
                metaData.forEach((node) => {
                    const newCheckList2 = {
                        ...checkListAux,
                        [`${elem}-${node.name}`]: false,
                    };
                    checkListAux = newCheckList2;
                    // setCheckList(newCheckList2);
                });
            }
        });
        return checkListAux;
    };

    /**
     * Sort the parameters according to their nodes.
     * @param checkedList =list with selected parameters.
     * @returns {SavedSimulationData[]} list with name of the node and its selected parameters.
     */
    const getLeftAxis = (checkedList) => {
        let savedMetaSimulation = [];
        checkedList.map((parameterSaved) => {
            const hyphenIndex = parameterSaved.indexOf("-");
            const parameterName = parameterSaved.slice(0, hyphenIndex);
            const nodeName = parameterSaved.slice(
                hyphenIndex + 1,
                parameterSaved.length
            );

            const isSimulationSaved = savedMetaSimulation.filter(
                (simulation) => {
                    return simulation.name === nodeName;
                }
            );

            if (isSimulationSaved.length === 0) {
                savedMetaSimulation = [
                    ...savedMetaSimulation,
                    { name: nodeName, keys: [parameterName] },
                ];
            } else {
                savedMetaSimulation = savedMetaSimulation.map((simulation) => {
                    let simulationAux = simulation;
                    if (simulation.name === isSimulationSaved[0].name) {
                        simulationAux = {
                            name: simulation.name,
                            keys: [...simulation.keys, parameterName],
                        };
                    }
                    return simulationAux;
                });
            }

            return savedMetaSimulation;
        });

        return savedMetaSimulation;
    };

    /**
     * @returns {string[]} returns a list with the keys of the parameters marked true.
     */
    const getGraphicMetaSelections = () => {
        let checkedList = [];

        Object.keys(checkList).forEach((parameter) => {
            if (checkList[parameter]) {
                checkedList = [...checkedList, parameter];
            }
        });

        return checkedList;
    };

    /**
     * Save the selected parameters and their values in the "Results" context to display them on the chart.
     */
    const getGraphicValues = () => {
        try {
            const selectedParametersArray = getGraphicMetaSelections();
            if (selectedParametersArray.length < 1) {
                throw new Error("Choose at least one parameter");
            }

            const graphicDataAux = [
                ...allGraphicData,
                [
                    {
                        graphicName: "",
                        graphicId: createIdComponent(),
                        leftAxis: getLeftAxis(selectedParametersArray),
                        rightAxis: [],
                    },
                ],
            ];
            setAllGraphicData(graphicDataAux);
            setAllResults([].concat(dataToShowInMap, graphicDataAux));
        } catch (error) {
            toast({
                position: "bottom-left",
                title: "Error when graphing",
                description: `${error.message}`,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    /**
     * Deletes the column parameter from the table.
     * Marks the parameter to be deleted as false.
     * @param parameter parameter to delete.
     */
    const deleteFromDisplayedList = (parameter) => {
        setDisplayedParameters(
            displayedParameters.filter(
                (displayedParam) => displayedParam !== parameter
            )
        );
        setCheckAllList({
            ...checkAllList,
            [`${parameter}`]: false,
        });
        const listParametersByNodes = checkAllParameters(
            {
                ...checkAllList,
                [`${parameter}`]: false,
            },
            parameter
        );
        setCheckList({
            ...listParametersByNodes,
            [`${parameter}-Global`]: false,
        });
    };

    return (
        <>
            <Flex align="center">
                <Icon as={InfoIcon} color="teal" />
                <Text ml="2%">
                    Select parameters of the metapopulation simulation to graph.
                </Text>
            </Flex>
            <TableContainer
                variant="simple"
                bg="white"
                overflowY="auto"
                m="2% 0"
                maxH="70vh"
            >
                <Table size="sm" m="1% 0">
                    <Thead>
                        <Tr>
                            <Th>Node</Th>
                            {displayedParameters.map((parameter) => {
                                return (
                                    <Th key={parameter}>
                                        <Checkbox
                                            onChange={(e) => {
                                                setCheckAllList({
                                                    ...checkAllList,
                                                    [`${parameter}`]:
                                                        e.target.checked,
                                                });
                                                const getAllParametersChilds =
                                                    checkAllParameters(
                                                        {
                                                            ...checkAllList,
                                                            [`${parameter}`]:
                                                                e.target
                                                                    .checked,
                                                        },
                                                        parameter
                                                    );
                                                setCheckList(
                                                    getAllParametersChilds
                                                );
                                            }}
                                        >
                                            <Tooltip label="Delete parameter from table">
                                                <Button
                                                    bg="transparent"
                                                    p="0"
                                                    onClick={() => {
                                                        deleteFromDisplayedList(
                                                            parameter
                                                        );
                                                    }}
                                                >
                                                    {parameter}
                                                </Button>
                                            </Tooltip>
                                        </Checkbox>
                                    </Th>
                                );
                            })}
                            <Th>
                                <Menu>
                                    <MenuButton
                                        as={IconButton}
                                        aria-label="Options"
                                        icon={<AddIcon />}
                                        variant="outline"
                                        bg="#16609e"
                                        color="white"
                                    />
                                    <MenuList>
                                        {parametersNotDisplayed.map(
                                            (parameter) => {
                                                if (
                                                    parameter !== "node" &&
                                                    parameter !== "name" &&
                                                    parameter !== "t"
                                                ) {
                                                    return (
                                                        <MenuItem
                                                            style={{
                                                                color: "black",
                                                                fontSize:
                                                                    "16px",
                                                            }}
                                                            value={parameter}
                                                            key={parameter}
                                                            onClick={(e) => {
                                                                setDisplayedParameters(
                                                                    [
                                                                        ...displayedParameters,
                                                                        parameter,
                                                                    ]
                                                                );
                                                            }}
                                                        >
                                                            {parameter}
                                                        </MenuItem>
                                                    );
                                                }
                                                return false;
                                            }
                                        )}
                                    </MenuList>
                                </Menu>
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>Global results</Td>
                            {displayedParameters.map((parameter) => {
                                return (
                                    <Td key={parameter}>
                                        <Checkbox
                                            bg="white"
                                            isChecked={
                                                checkList[`${parameter}-Global`]
                                            }
                                            onChange={(e) => {
                                                setCheckList({
                                                    ...checkList,
                                                    [`${parameter}-Global`]:
                                                        e.target.checked,
                                                });
                                            }}
                                        />
                                    </Td>
                                );
                            })}
                        </Tr>
                        {metaData.map((elem) => {
                            return (
                                <Tr key={elem.name}>
                                    <Td>{nodesNames[elem.name]}</Td>
                                    {displayedParameters.map((parameter) => {
                                        return (
                                            <Td key={parameter}>
                                                <Checkbox
                                                    isChecked={
                                                        checkList[
                                                            `${parameter}-${elem.name}`
                                                        ]
                                                    }
                                                    value={parameter}
                                                    onChange={(e) => {
                                                        setCheckList({
                                                            ...checkList,
                                                            [`${parameter}-${elem.name}`]:
                                                                e.target
                                                                    .checked,
                                                        });
                                                    }}
                                                />
                                            </Td>
                                        );
                                    })}
                                </Tr>
                            );
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
            <Button
                colorScheme="teal"
                onClick={() => {
                    getGraphicValues();
                }}
            >
                Chart
            </Button>
        </>
    );
};

export default MetapopulationSelectTable;
