import { ArrowLeftIcon, ArrowRightIcon, InfoIcon } from "@chakra-ui/icons";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Icon,
    Flex,
    Text,
    Button,
    Tag,
    TagLabel,
    TagRightIcon,
    IconButton,
    Tooltip,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";

import DoubleYaxisIcon from "../icons/DoubleYaxisIcon";
import RightArrow from "../icons/RightArrow";
import LeftArrow from "components/icons/LeftArrow";
import { GraphicsData } from "context/GraphicsContext";
import { DoubleYAxisData, SavedSimulationData } from "types/GraphicsTypes";
import createIdComponent from "utils/createIdcomponent";

interface Props {
    savedKeys?: DoubleYAxisData[];
    index: number;
}

/**
 * Modal to select the parameters that will be plotted on the left and right axis of the graph.
 * @subcategory Results
 * @component
 */
const DoubleYAxis = ({ savedKeys, index }: Props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [leftAxis, setLeftAxis] = useState<SavedSimulationData[]>([]);
    const [rightAxis, setRightAxis] = useState<SavedSimulationData[]>([]);
    const [graphicId, setGraphicId] = useState("");
    const {
        allGraphicData,
        setAllGraphicData,
        setAllResults,
        dataToShowInMap,
    } = useContext(GraphicsData);

    useEffect(() => {
        setLeftAxis(savedKeys[0].leftAxis);
        setRightAxis(savedKeys[0].rightAxis);
        setGraphicId(savedKeys[0].graphicId);
    }, [savedKeys]);

    /**
     * Entrega una lista con los parámetros guardados en un eje.
     * @param {SavedSimulationData[]} axis lista con el nombre de la simulación y sus parámetros a graficar.
     * @param {string} name nombre de la simulación.
     * @param k parámetro a insertar.
     * @returns {SavedSimulationData[]}
     */
    const getParametersSetted = (axis, name, k) => {
        return axis.map((e) => {
            if (e.name === name) {
                e.keys = [...e.keys, k];
            }
            return e;
        });
    };

    /**
     * Inserta el primer parámetro de una simulación.
     * @param {string} name nombre de la simulación.
     * @param {string} k parámetro a insertar.
     * @param axisName eje derecho o izquierdo del gráfico.
     */
    const setAxis = (name, k, axisName) => {
        if (axisName === "right") {
            setRightAxis([...rightAxis, { name, keys: [k] }]);
        } else {
            setLeftAxis([...leftAxis, { name, keys: [k] }]);
        }
    };

    /**
     * Inserta un parámetro en un eje.     
     * @param {SavedSimulationData[]} axis lista con el nombre de la simulación y sus parámetros a graficar.
     * @param {string} name nombre de le simulación.
     * @param {string} k parámetro a insertar.
     * @param axisName eje derecho o izquierdo del gráfico.

     */
    const setParametersToAxis = (axis, name, k, axisName) => {
        if (axis.length === 0) {
            setAxis(name, k, axisName);
        } else {
            const nameSimExists = axis.some((e) => {
                return e.name === name;
            });
            if (nameSimExists) {
                const paramsSetted = getParametersSetted(axis, name, k);
                if (axisName === "right") {
                    setRightAxis(paramsSetted);
                } else {
                    setLeftAxis(paramsSetted);
                }
            } else {
                setAxis(name, k, axisName);
            }
        }
    };

    /**
     * Borra un parámetro desde un eje del gráfico y lo inserta en el otro eje.
     * @param {SavedSimulationData[]} axis lista con el nombre de la simulación y sus parámetros a graficar.
     * @param {string} name nombre de le simulación
     * @param {string} k parámetro a borrar
     * @param axisName eje derecho o izquierdo del gráfico.
     */
    const deleteParameterFromAxis = (axis, name, k, axisName) => {
        const simByName = axis.filter((param) => {
            return param.name === name;
        });
        const simKeys = simByName[0].keys;
        const simKeysFilter = simKeys.filter((simKey) => {
            return simKey !== k;
        });
        if (axisName === "left") {
            setParametersToAxis(rightAxis, name, k, "right");
        } else {
            setParametersToAxis(leftAxis, name, k, "left");
        }

        let newParamsSim = axis.map((e) => {
            if (e.name === name) {
                e.keys = simKeysFilter;
            }
            return e;
        });

        newParamsSim = newParamsSim.filter((sim) => {
            return sim.keys.length > 0;
        });

        if (axisName === "left") {
            setLeftAxis(newParamsSim);
        } else {
            setRightAxis(newParamsSim);
        }
    };

    let rightAxisAux = rightAxis;
    let leftAxisAux = leftAxis;

    /**
     * Inserts the first parameter of a simulation.
     * @param {string} name simulation name.
     * @param {string} k parameter to enter.
     * @param axisName right or left axis of the graph.
     */
    const setAuxAxis = (name, k, axisName) => {
        if (axisName === "right") {
            rightAxisAux = [...rightAxisAux, { name, keys: [k] }];
        } else {
            leftAxisAux = [...leftAxisAux, { name, keys: [k] }];
        }
    };

    /**
     * Inserts all the parameters in an axis.
     * @param {SavedSimulationData[]} axis list with the name of the simulation and its parameters to graph.
     * @param {string} name simulation name.
     * @param {string} k parameter to enter.
     * @param axisName right or left axis of the graph.
     */
    const setAllParametersToAxis = (axis, name, k, axisName) => {
        if (axis.length === 0) {
            setAuxAxis(name, k, axisName);
        } else {
            const nameSimExists = axis.some((e) => {
                return e.name === name;
            });
            if (nameSimExists) {
                const paramsSetted = getParametersSetted(axis, name, k);
                if (axisName === "right") {
                    rightAxisAux = paramsSetted;
                } else {
                    leftAxisAux = paramsSetted;
                }
            } else {
                setAuxAxis(name, k, axisName);
            }
        }
    };
    /**
     * Move all parameters from one axis to the other.
     * @param {SavedSimulationData[]} axis list with the name of the simulation and its parameters to graph.
     * @param {string} axisName right or left axis of the graph.
     */
    const removeAllParameters = (axis, axisName) => {
        if (axisName === "left") {
            axis.forEach((sim) => {
                return sim.keys.forEach((k) => {
                    return setAllParametersToAxis(
                        rightAxisAux,
                        sim.name,
                        k,
                        "right"
                    );
                });
            });
            setRightAxis(rightAxisAux);
            setLeftAxis([]);
        } else {
            axis.forEach((sim) => {
                return sim.keys.forEach((k) => {
                    return setAllParametersToAxis(
                        leftAxisAux,
                        sim.name,
                        k,
                        "left"
                    );
                });
            });
            setLeftAxis(leftAxisAux);
            setRightAxis([]);
        }
    };

    /**
     * Saves the information to display a graph in the "Results" context.
     * @param {string} name chart name.
     */
    const setParametersToAllGraphicData = (name) => {
        const auxAllGraphicData = allGraphicData;
        auxAllGraphicData[index] = [
            { graphicName: name, leftAxis, rightAxis, graphicId },
        ];

        setAllGraphicData([...auxAllGraphicData]);
        setAllResults([].concat(dataToShowInMap, auxAllGraphicData));
        onClose();
    };

    return (
        <>
            <Icon
                p="0 1% 1% 0"
                as={DoubleYaxisIcon}
                onClick={onOpen}
                cursor="pointer"
                fontSize="1.2rem"
                fill="none"
                key="double-axis-open-icon"
            />
            {savedKeys.map((e) => {
                return (
                    <Modal
                        isOpen={isOpen}
                        onClose={onClose}
                        size="xl"
                        key={`${e.leftAxis[0]?.name}`}
                    >
                        <ModalOverlay />
                        <ModalContent
                            textAlign="center"
                            key="double-axis-content"
                            maxW="70vw"
                            m="3%"
                        >
                            <ModalCloseButton />
                            <ModalBody>
                                <Flex
                                    alignItems="center"
                                    justifyContent="space-between"
                                    pt="1%"
                                >
                                    <Tooltip label="Change Y axis side">
                                        <Icon
                                            as={InfoIcon}
                                            fontSize="25px"
                                            color="#16609e"
                                        />
                                    </Tooltip>
                                    <Text w="100%" fontSize="20px">
                                        {e.graphicName}
                                    </Text>
                                </Flex>
                                <Flex justifyContent="space-around" h="81%">
                                    <Flex direction="column" w="35%" p="2%">
                                        <Flex
                                            alignItems="center"
                                            m="3% 0"
                                            justifyContent="center"
                                        >
                                            <Text m="0 5%">Left Axis</Text>
                                            <IconButton
                                                colorScheme="blue"
                                                aria-label="Search database"
                                                icon={<ArrowRightIcon />}
                                                size="sm"
                                                onClick={() => {
                                                    removeAllParameters(
                                                        leftAxis,
                                                        "left"
                                                    );
                                                }}
                                            />
                                        </Flex>
                                        <Flex
                                            bg="#dcdcdc"
                                            p="3%"
                                            borderRadius="10px"
                                            flexDirection="column"
                                            h="93%"
                                        >
                                            {leftAxis.map((key) => {
                                                const savedKey = key.keys;
                                                const { name } = key;
                                                return savedKey.map((k) => {
                                                    return (
                                                        <Tag
                                                            key={`${k} ${name}`}
                                                            size="lg"
                                                            borderRadius="full"
                                                            variant="solid"
                                                            bg="#16609E"
                                                            justifyContent="space-between"
                                                            m="2% 0"
                                                            cursor="pointer"
                                                            onClick={() => {
                                                                deleteParameterFromAxis(
                                                                    leftAxis,
                                                                    name,
                                                                    k,
                                                                    "left"
                                                                );
                                                            }}
                                                        >
                                                            <TagLabel>
                                                                {`${k} ${name}`}
                                                            </TagLabel>
                                                            <TagRightIcon
                                                                as={RightArrow}
                                                                fontSize="1.3rem"
                                                            />
                                                        </Tag>
                                                    );
                                                });
                                            })}
                                        </Flex>
                                    </Flex>
                                    <Flex direction="column" w="35%" p="2%">
                                        <Flex
                                            alignItems="center"
                                            m="3% 0"
                                            justifyContent="center"
                                        >
                                            <IconButton
                                                colorScheme="blue"
                                                aria-label="Search database"
                                                icon={<ArrowLeftIcon />}
                                                size="sm"
                                                onClick={() => {
                                                    removeAllParameters(
                                                        rightAxis,
                                                        "right"
                                                    );
                                                }}
                                            />
                                            <Text m="0 5%">Right Axis</Text>
                                        </Flex>
                                        <Flex
                                            bg="#dcdcdc"
                                            p="3%"
                                            borderRadius="10px"
                                            flexDirection="column"
                                            h="93%"
                                        >
                                            {rightAxis.map((key) => {
                                                const savedKey = key.keys;
                                                const { name } = key;
                                                return savedKey.map((k) => {
                                                    return (
                                                        <Tag
                                                            key={`${k} ${name}`}
                                                            size="lg"
                                                            borderRadius="full"
                                                            variant="solid"
                                                            bg="#16609E"
                                                            justifyContent="space-between"
                                                            m="2% 0"
                                                            cursor="pointer"
                                                            onClick={() => {
                                                                deleteParameterFromAxis(
                                                                    rightAxis,
                                                                    name,
                                                                    k,
                                                                    "right"
                                                                );
                                                            }}
                                                        >
                                                            <TagRightIcon
                                                                as={LeftArrow}
                                                                fontSize="1.3rem"
                                                            />
                                                            <TagLabel>
                                                                {`${k} ${name}`}
                                                            </TagLabel>
                                                        </Tag>
                                                    );
                                                });
                                            })}
                                        </Flex>
                                    </Flex>
                                </Flex>
                                <Button
                                    colorScheme="teal"
                                    size="sm"
                                    mt="15px"
                                    key={createIdComponent()}
                                    onClick={() => {
                                        setParametersToAllGraphicData(
                                            e.graphicName
                                        );
                                    }}
                                >
                                    Set
                                </Button>
                                <Button
                                    colorScheme="teal"
                                    variant="outline"
                                    size="sm"
                                    mt="15px"
                                    ml="20px"
                                    key={createIdComponent()}
                                    onClick={() => {
                                        onClose();
                                    }}
                                >
                                    Cancel
                                </Button>
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                );
            })}
        </>
    );
};

export default DoubleYAxis;
