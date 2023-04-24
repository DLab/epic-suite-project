import { Flex, Select, Switch, Text, Input, Box } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";

import { MobilityMatrix } from "../../context/MobilityMatrixContext";
import { NewModelSetted } from "context/NewModelsContext";
import { SelectFeature } from "context/SelectFeaturesContext";
import type { InterventionsTypes } from "types/MobilityMatrixTypes";
import { MobilityModes } from "types/MobilityMatrixTypes";
import type { NewModelsParams } from "types/SimulationTypes";

import MatrixTypesOptions from "./MatrixTypesOptions";
import MobilityInterventions from "./MobilityInterventions";
import ModelsMobilityMatrixSelect from "./ModelsMobilityMatrixSelect";
import NodesAndGraphTypes from "./NodesAndGraphTypes";
import RealMobilityMatrix from "./RealMobilityMatrix";

interface Props {
    nodesLocalValue: number | undefined;
    setNodesLocalValue: (value: number | undefined) => void;
    graphTypeLocal: string;
    setGraphTypeLocal;
    popPercentage: number;
    setPopPercentage: (value: number) => void;
    isDynamical: boolean;
    setIsDynamical: (value: boolean) => void;
    modulationLocalValue: string;
    setModulationLocalValue: (value: string) => void;
    daysCicleLocalValue: number;
    setDaysCicleLocalValue: (value: number) => void;
    interventionList: InterventionsTypes[] | [];
    setInterventionList: (value: InterventionsTypes[] | []) => void;
    matrixType: string;
    setMatrixType: (value: string) => void;
    valNodes: number[] | [];
    setValNodes: (value: number[] | []) => void;
    mobilityModel: string;
    setMobilityModel: (value: string) => void;
}

const MobilityConstructorContainer = ({
    nodesLocalValue,
    setNodesLocalValue,
    graphTypeLocal,
    setGraphTypeLocal,
    popPercentage,
    setPopPercentage,
    isDynamical,
    setIsDynamical,
    modulationLocalValue,
    setModulationLocalValue,
    daysCicleLocalValue,
    setDaysCicleLocalValue,
    interventionList,
    setInterventionList,
    matrixType,
    setMatrixType,
    valNodes,
    setValNodes,
    mobilityModel,
    setMobilityModel,
}: Props) => {
    const { matrixMode, idMatrixModel } = useContext(MobilityMatrix);
    const { newModel } = useContext(NewModelSetted);
    const { geoSelections } = useContext(SelectFeature);
    const [nameNodes, setNameNodes] = useState([]);
    useEffect(() => {
        if (idMatrixModel !== 0) {
            const { numberNodes, initialConditions } = newModel.find(
                (model: NewModelsParams) => {
                    return model.idNewModel === idMatrixModel;
                }
            );

            setNodesLocalValue(numberNodes);
            setValNodes(
                initialConditions.map(
                    (cond) => cond.conditionsValues.population
                )
            );
            setNameNodes(initialConditions.map((cond) => cond.name));
        }
    }, [
        newModel,
        geoSelections,
        idMatrixModel,
        setNodesLocalValue,
        setValNodes,
    ]);

    return (
        <Flex
            direction="column"
            w="38%"
            borderRadius="8px"
            boxShadow="sm"
            border="1px solid #DDDDDD"
            p="2%"
            h="75vh"
            overflowY="auto"
        >
            {matrixMode !== MobilityModes.Initial && (
                <>
                    <ModelsMobilityMatrixSelect
                        setMatrixType={setMatrixType}
                        setIsDynamical={setIsDynamical}
                    />
                    <MatrixTypesOptions
                        matrixType={matrixType}
                        setMatrixType={setMatrixType}
                        setIsDynamical={setIsDynamical}
                    />
                    {idMatrixModel !== 0 && matrixType === "real" && (
                        <RealMobilityMatrix
                            interventionList={interventionList}
                            setInterventionList={setInterventionList}
                        />
                    )}
                    {idMatrixModel !== 0 && matrixType === "artificial" && (
                        <>
                            <NodesAndGraphTypes
                                nodesLocalValue={nodesLocalValue}
                                setNodesLocalValue={setNodesLocalValue}
                                graphTypeLocal={graphTypeLocal}
                                setGraphTypeLocal={setGraphTypeLocal}
                                popPercentage={popPercentage}
                                setPopPercentage={setPopPercentage}
                                valNodes={valNodes}
                                mobilityModel={mobilityModel}
                                setMobilityModel={setMobilityModel}
                                nameNodes={nameNodes}
                            />
                            {/* {graphTypeLocal && (
                                <Flex
                                    mb="17px"
                                    display="grid"
                                    gridTemplateColumns="auto auto"
                                    gridGap="15px"
                                    alignItems="center"
                                >
                                    <Flex>
                                        <Switch
                                            mr="7px"
                                            isChecked={isDynamical}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setIsDynamical(true);
                                                } else {
                                                    setIsDynamical(false);
                                                }
                                            }}
                                        />
                                        <Text fontSize="14px">Dynamical</Text>
                                    </Flex>
                                    {isDynamical && (
                                        <Select
                                            size="sm"
                                            mr="15px"
                                            borderRadius="8px"
                                            bg="#F4F4F4"
                                            borderColor="#F4F4F4"
                                            placeholder="Modulation options"
                                            value={modulationLocalValue}
                                            onChange={(e) => {
                                                setModulationLocalValue(
                                                    e.target.value
                                                );
                                            }}
                                        >
                                            <option key="Weekly" value="weekly">
                                                Weekly
                                            </option>
                                            <option
                                                key="Monthly"
                                                value="monthly"
                                            >
                                                Monthly
                                            </option>
                                            <option key="Custom" value="custom">
                                                Custom
                                            </option>
                                        </Select>
                                    )}
                                </Flex>
                            )} */}
                            {/* {modulationLocalValue === "custom" && (
                                <Flex mb="10px" alignItems="center">
                                    <Box>
                                        <Text
                                            align="left"
                                            fontSize="14px"
                                            mr="7px"
                                        >
                                            Days of cicle
                                        </Text>
                                    </Box>
                                    <Box>
                                        <Input
                                            size="sm"
                                            borderRadius="6px"
                                            value={daysCicleLocalValue}
                                            onChange={(e) => {
                                                setDaysCicleLocalValue(
                                                    +e.target.value
                                                );
                                            }}
                                        />
                                    </Box>
                                </Flex>
                            )} */}
                            {/* {modulationLocalValue && (
                                <MobilityInterventions
                                    interventionList={interventionList}
                                    setInterventionList={setInterventionList}
                                />
                            )} */}
                        </>
                    )}
                </>
            )}
        </Flex>
    );
};

export default MobilityConstructorContainer;
