import { Button, Flex, FormControl, Select, Text } from "@chakra-ui/react";
import React, { useContext, useState } from "react";

import { MobilityMatrix } from "context/MobilityMatrixContext";
import { getRealMatrix } from "utils/fetchData";

import NumberInputMobilityMatrix from "./NumberInputMobilityMatrix";

interface Props {
    nodesLocalValue: number;
    setNodesLocalValue: (value: number) => void;
    graphTypeLocal: string;
    setGraphTypeLocal: (value: string) => void;
    popPercentage: number;
    setPopPercentage: (value: number) => void;
    valNodes: number[] | [];
    mobilityModel: string;
    setMobilityModel: (value: string) => void;
    nameNodes: string[] | [];
}

const NodesAndGraphTypes = ({
    nodesLocalValue,
    setNodesLocalValue,
    graphTypeLocal,
    setGraphTypeLocal,
    popPercentage,
    setPopPercentage,
    valNodes,
    mobilityModel,
    setMobilityModel,
    nameNodes,
}: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const { setMatrix } = useContext(MobilityMatrix);
    return (
        <>
            <Flex justifyContent="space-between" wrap="wrap">
                <FormControl display="flex" alignItems="center">
                    <Flex w="50%" h="2rem" alignItems="center">
                        <NumberInputMobilityMatrix
                            numberInputName="Nodes"
                            disabled
                            value={nodesLocalValue}
                            setValue={setNodesLocalValue}
                        />
                    </Flex>
                </FormControl>
            </Flex>
            <Flex justifyContent="space-between" wrap="wrap">
                <FormControl display="flex" alignItems="center">
                    <Flex w="50%" h="2rem" alignItems="center">
                        <NumberInputMobilityMatrix
                            numberInputName="Population Fraction"
                            value={popPercentage}
                            setValue={setPopPercentage}
                        />
                    </Flex>
                </FormControl>
            </Flex>
            <Flex justifyContent="space-between" wrap="wrap">
                <FormControl display="flex" alignItems="center">
                    <Flex w="50%" h="2rem" alignItems="center">
                        <Text pr="2rem" fontSize="14px">
                            Mobility
                        </Text>
                        <Select
                            w="50%"
                            size="sm"
                            mr="15px"
                            placeholder="Select model"
                            bg="#F4F4F4"
                            borderColor="#F4F4F4"
                            borderRadius="8px"
                            value={mobilityModel}
                            onChange={(e) => {
                                setMobilityModel(e.target.value);
                            }}
                        >
                            <option value="random">Random</option>
                            <option value="gravity">Gravity Model</option>
                            <option value="radiation">Radiation Model</option>
                        </Select>
                    </Flex>
                </FormControl>
            </Flex>
            <Flex justifyContent="space-between" wrap="wrap" mt="1rem">
                <FormControl display="flex" alignItems="center">
                    <Flex w="50%" h="2rem" alignItems="center">
                        <Button
                            isLoading={isLoading}
                            loadingText="Submitting"
                            size="sm"
                            fontSize="10px"
                            bg="#016FB9"
                            color="#FFFFFF"
                            w="100px"
                            onClick={() => {
                                getRealMatrix(
                                    setMatrix,
                                    setIsLoading,
                                    {
                                        populations: valNodes,
                                        model: mobilityModel,
                                        fraction: popPercentage / 100,
                                        tags: nameNodes,
                                    },
                                    "http://localhost/covid19geomodeller/mobility/artificial"
                                );
                            }}
                        >
                            GET MATRIX
                        </Button>
                    </Flex>
                </FormControl>
            </Flex>
            {/* <Select
                    size="sm"
                    mr="15px"
                    placeholder="Graph type"
                    bg="#F4F4F4"
                    borderColor="#F4F4F4"
                    borderRadius="8px"
                    value={graphTypeLocal}
                    onChange={(e) => {
                        setGraphTypeLocal(e.target.value);
                    }}
                >
                    <option key="preferential" value="preferential">
                        Preferential attachment
                    </option>
                    <option key="small" value="small">
                        Small world
                    </option>
                    <option key="fully" value="fully">
                        Fully connected
                    </option>
                </Select> */}

            {/* {graphTypeLocal && (
                <Flex
                    mb="17px"
                    display="grid"
                    gridTemplateColumns="auto auto auto"
                    gridGap="10px"
                >
                    <NumberInputMobilityMatrix
                        numberInputName="Name"
                        disabled
                    />
                    <NumberInputMobilityMatrix
                        numberInputName="Name"
                        disabled
                    />
                    <NumberInputMobilityMatrix
                        numberInputName="Name"
                        disabled
                    />
                </Flex>
            )} */}
        </>
    );
};

export default NodesAndGraphTypes;
