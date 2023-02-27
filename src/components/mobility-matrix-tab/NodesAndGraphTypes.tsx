import { Flex, Select } from "@chakra-ui/react";
import React from "react";

import NumberInputMobilityMatrix from "./NumberInputMobilityMatrix";

interface Props {
    nodesLocalValue: number;
    setNodesLocalValue: (value: number) => void;
    graphTypeLocal: string;
    setGraphTypeLocal: (value: string) => void;
    popPercentage: number;
    setPopPercentage: (value: number) => void;
}

const NodesAndGraphTypes = ({
    nodesLocalValue,
    setNodesLocalValue,
    graphTypeLocal,
    setGraphTypeLocal,
    popPercentage,
    setPopPercentage,
}: Props) => {
    return (
        <>
            <Flex mb="17px">
                <NumberInputMobilityMatrix
                    numberInputName="Nodes"
                    disabled
                    value={nodesLocalValue}
                    setValue={setNodesLocalValue}
                />
            </Flex>
            <Flex
                mb="17px"
                display="grid"
                gridTemplateColumns="auto auto"
                gridGap="15px"
            >
                <NumberInputMobilityMatrix
                    numberInputName="Population"
                    value={popPercentage}
                    setValue={setPopPercentage}
                />
                <Select
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
                </Select>
            </Flex>
            {graphTypeLocal && (
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
            )}
        </>
    );
};

export default NodesAndGraphTypes;
