import { Flex, Button, Icon } from "@chakra-ui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import React, { useState, useContext, useEffect } from "react";

import { MobilityMatrix as MobilityMatrixContext } from "../../context/MobilityMatrixContext";
import BreadCrumb from "components/BreadCrumb";
import { InterventionsTypes, MobilityModes } from "types/MobilityMatrixTypes";

import MatrixNameAndButtons from "./MatrixNameAndButtons";
import MatrixSavedSelect from "./MatrixSavedSelect";
import MobilityConstructorContainer from "./MobilityConstructorContainer";
import MobiltyOutputContainer from "./MobiltyOutputContainer";

const MobilityMatrix = () => {
    const {
        matrixMode,
        idMobilityMatrixUpdate,
        mobilityMatrixList,
        setMatrixMode,
        setIdMatrixModel,
        setOriginOfMatrixCreation,
    } = useContext(MobilityMatrixContext);
    const [nodesLocalValue, setNodesLocalValue] = useState<
        number | undefined
    >();
    const [graphTypeLocal, setGraphTypeLocal] = useState<string>();
    const [popPercentage, setPopPercentage] = useState<number>(0);
    const [isDynamical, setIsDynamical] = useState(false);
    const [modulationLocalValue, setModulationLocalValue] = useState<string>();
    const [daysCicleLocalValue, setDaysCicleLocalValue] = useState<number>(0);
    const [interventionList, setInterventionList] = useState<
        InterventionsTypes[]
    >([]);
    const [matrixNameLocal, setMatrixNameLocal] = useState("");
    const [matrixTypeLocal, setMatrixTypeLocal] = useState("");
    const [secondModelLink, setSecondModelLink] = useState(undefined);

    useEffect(() => {
        if (matrixMode === MobilityModes.Initial) {
            setGraphTypeLocal("");
            setPopPercentage(0);
            setIsDynamical(false);
            setModulationLocalValue("");
            setInterventionList([]);
            setDaysCicleLocalValue(0);
            setIdMatrixModel(0);
            setMatrixNameLocal("");
            setNodesLocalValue(undefined);
            setMatrixTypeLocal("");
        }
        if (matrixMode === MobilityModes.Update) {
            const {
                populationPercentage,
                dynamical,
                modulationOption,
                interventions,
                graphTypes,
                cicleDays,
                nameMobilityMatrix,
                type,
            } = mobilityMatrixList.find(
                (matrix) => matrix.id === idMobilityMatrixUpdate
            );
            setGraphTypeLocal(graphTypes);
            setPopPercentage(populationPercentage);
            setIsDynamical(dynamical);
            setModulationLocalValue(modulationOption);
            setInterventionList(interventions);
            setDaysCicleLocalValue(cicleDays);
            setMatrixNameLocal(nameMobilityMatrix);
            setMatrixTypeLocal(type);
        }
    }, [
        idMobilityMatrixUpdate,
        matrixMode,
        mobilityMatrixList,
        setIdMatrixModel,
    ]);

    return (
        <Flex direction="column">
            <BreadCrumb
                firstLink="Mobility"
                secondLink={secondModelLink}
                setSecondLink={setSecondModelLink}
            />
            {matrixMode === MobilityModes.Initial ? (
                <Flex w="40%" mt="15px">
                    <MatrixSavedSelect />
                    <Button
                        size="sm"
                        fontSize="0.625rem"
                        bg="#016FB9"
                        color="#FFFFFF"
                        onClick={() => {
                            setMatrixMode(MobilityModes.Add);
                            setOriginOfMatrixCreation("matrixTab");
                        }}
                    >
                        <Icon w="14px" h="14px" as={PlusIcon} mr="5px" />
                        ADD NEW
                    </Button>
                </Flex>
            ) : (
                <Flex direction="column">
                    <MatrixNameAndButtons
                        nodesLocalValue={nodesLocalValue}
                        graphTypeLocal={graphTypeLocal}
                        popPercentage={popPercentage}
                        isDynamical={isDynamical}
                        modulationLocalValue={modulationLocalValue}
                        daysCicleLocalValue={daysCicleLocalValue}
                        interventionList={interventionList}
                        matrixNameLocal={matrixNameLocal}
                        setMatrixNameLocal={setMatrixNameLocal}
                        matrixType={matrixTypeLocal}
                        setMatrixType={setMatrixTypeLocal}
                    />
                    {/* Eliminar display none a matrix */}
                    <Flex
                        ml="2%"
                        p="0"
                        h="100%"
                        w="100%"
                        mt="20px"
                        display="none"
                    >
                        <MobilityConstructorContainer
                            nodesLocalValue={nodesLocalValue}
                            setNodesLocalValue={setNodesLocalValue}
                            graphTypeLocal={graphTypeLocal}
                            setGraphTypeLocal={setGraphTypeLocal}
                            popPercentage={popPercentage}
                            setPopPercentage={setPopPercentage}
                            isDynamical={isDynamical}
                            setIsDynamical={setIsDynamical}
                            modulationLocalValue={modulationLocalValue}
                            setModulationLocalValue={setModulationLocalValue}
                            daysCicleLocalValue={daysCicleLocalValue}
                            setDaysCicleLocalValue={setDaysCicleLocalValue}
                            interventionList={interventionList}
                            setInterventionList={setInterventionList}
                            matrixType={matrixTypeLocal}
                            setMatrixType={setMatrixTypeLocal}
                        />
                        <MobiltyOutputContainer />
                    </Flex>
                </Flex>
            )}
        </Flex>
    );
};

export default MobilityMatrix;
