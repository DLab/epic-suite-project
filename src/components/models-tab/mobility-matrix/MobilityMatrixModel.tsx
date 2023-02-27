import { Select, Text, Flex, RadioGroup, Stack, Radio } from "@chakra-ui/react";
import React, { useContext, useState, useEffect } from "react";

import { ControlPanel } from "context/ControlPanelContext";
import { MobilityMatrix } from "context/MobilityMatrixContext";
import { NewModelSetted } from "context/NewModelsContext";
import { TabIndex } from "context/TabContext";
import { MobilityModes } from "types/MobilityMatrixTypes";

interface Props {
    matrixId: number;
    setMatrixId: (value: number) => void;
}

const MobilityMatrixModel = ({ matrixId, setMatrixId }: Props) => {
    const { idModelUpdate } = useContext(ControlPanel);
    const { setIdMobility } = useContext(NewModelSetted);
    const {
        mobilityMatrixList,
        setMatrixMode,
        setIdMatrixModel,
        setIdMobilityMatrixUpdate,
        setOriginOfMatrixCreation,
    } = useContext(MobilityMatrix);
    const { setIndex } = useContext(TabIndex);
    const [matrixByModel, setMatrixByModel] = useState([]);

    useEffect(() => {
        const matrixList = mobilityMatrixList.filter(
            (matrix) => +matrix.modelId === +idModelUpdate
        );
        setMatrixByModel(matrixList);
    }, [idModelUpdate, mobilityMatrixList]);

    return (
        <>
            <Text fontSize="1rem" fontWeight={700} mb="5%" mt="5%">
                Mobility Data
            </Text>
            <Flex direction="column">
                <Flex justify="space-between">
                    <Text
                        color="#016FB9"
                        fontSize="0.875rem"
                        textDecorationLine="underline"
                        cursor="pointer"
                        ml="4%"
                        onClick={() => {
                            setIdMatrixModel(idModelUpdate);
                            setMatrixMode(MobilityModes.Add);
                            setIndex(5);
                            setOriginOfMatrixCreation("modelsTab");
                        }}
                    >
                        + Add mobility matrix
                    </Text>
                </Flex>
                {matrixByModel.length > 0 && (
                    <Flex mt="15px">
                        <Select
                            w="10rem"
                            mb="2%"
                            size="sm"
                            mr="15px"
                            placeholder="Select mobility matrix"
                            bg="#F4F4F4"
                            borderColor="#F4F4F4"
                            borderRadius="8px"
                            value={matrixId}
                            onChange={(e) => {
                                setIdMobilityMatrixUpdate(+e.target.value);
                                setMatrixId(+e.target.value);
                                setIdMobility(+e.target.value);
                            }}
                        >
                            {matrixByModel.map((matrix) => {
                                return (
                                    <option key={matrix.id} value={matrix.id}>
                                        {matrix.nameMobilityMatrix}
                                    </option>
                                );
                            })}
                        </Select>
                        <Text
                            color={matrixId ? "#016FB9" : "#7f8387"}
                            fontSize="0.875rem"
                            textDecorationLine="underline"
                            cursor="pointer"
                            ml="4%"
                            onClick={() => {
                                if (matrixId) {
                                    setIdMatrixModel(idModelUpdate);
                                    setIndex(5);
                                    setMatrixMode(MobilityModes.Update);
                                    setOriginOfMatrixCreation("modelsTab");
                                    setIdMobilityMatrixUpdate(matrixId);
                                }
                            }}
                        >
                            View / Edit Mobility Matrix
                        </Text>
                    </Flex>
                )}
            </Flex>
        </>
    );
};

export default MobilityMatrixModel;
