import { Box, Flex, Spinner } from "@chakra-ui/react";
import _ from "lodash";
import dynamic from "next/dynamic";
import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import { ControlPanel } from "context/ControlPanelContext";
import { NewModelSetted } from "context/NewModelsContext";
import { TabIndex } from "context/TabContext";
import { InitialConditionsNewModel } from "types/ControlPanelTypes";
import { NewModelsParams } from "types/SimulationTypes";

import ExportModels from "./ExportModels";
import InitialConditionsModels from "./InitialConditionsModel";
// import VariableDependentTime, {
//     NameFunction,
// } from "types/VariableDependentTime";
// import ModelsMap from "./model-map/ModelsMap";
import ModelInterventions from "./interventions/ModelInterventions";
import ModelAccordion from "./ModelAccordion";
import ModelBuilder from "./ModelBuilder";
import SectionVariableDependentTime from "./SectionVariableDependentTime";

interface Props {
    id: number;
    initialConditions: InitialConditionsNewModel[];
    actualModelName: string;
    setActualModelName: (value: string) => void;
    matrixId: number;
    setMatrixId: (value: number) => void;
}

/**
 * Component container for configuring model parameters, obtaining initial conditions, and displaying geographic selection.
 * @subcategory NewModel
 * @component
 */
// eslint-disable-next-line complexity
const ModelMainTab = ({
    id,
    initialConditions,
    actualModelName,
    setActualModelName,
    matrixId,
    setMatrixId,
}: Props) => {
    const [modelValue, setModelValue] = useState(undefined);
    const [numberOfNodes, setNumberOfNodes] = useState(0);
    const [dataSourceValue, setDataSourceValue] = useState(undefined);
    const [areaSelectedValue, setAreaSelectedValue] = useState(undefined);
    const [populationValue, setPopulationValue] = useState(undefined);
    const [graphId, setGraphId] = useState(undefined);
    const [graphsSelectedValue, setGraphsSelectedValue] = useState(undefined);
    const [showSectionInitialConditions, setShowSectionInitialConditions] =
        useState(false);
    const { newModel } = useContext(NewModelSetted);
    const { setAux } = useContext(TabIndex);
    const { setIdModelUpdate, dataViewVariable } = useContext(ControlPanel);
    const [startDate, setStartDate] = useState(
        new Date(
            newModel.find(
                (model: NewModelsParams) =>
                    model.idNewModel.toString() === id.toString()
            ).t_init ?? new Date(2022, 6, 1)
        )
    );
    const [showSectionVariable, setShowSectionVariable] =
        useState<boolean>(false);
    const [positionVDT, setPositionVDT] = useState<number>(-1);

    /**
     * Gets the saved value of the requested parameter.
     */
    const getDefaultValueParameters = useCallback(
        (field) => {
            return newModel.find(({ idNewModel }) => idNewModel === id)[field];
        },
        [newModel, id]
    );
    // const ModelsMap =
    const ModelsMap = useMemo(
        () =>
            dynamic(() => import("./model-map/ModelsMap"), {
                loading: () => (
                    <Flex justifyContent="center" alignItems="center" w="100%">
                        <Spinner
                            thickness="4px"
                            speed="0.65s"
                            emptyColor="gray.200"
                            color="blue.500"
                            size="xl"
                        />
                    </Flex>
                ),
                ssr: false,
            }),
        []
    );

    useEffect(() => {
        setIdModelUpdate(id ?? 0);
    }, [id, setIdModelUpdate]);

    useEffect(() => {
        setModelValue(getDefaultValueParameters("modelType"));
        setDataSourceValue(getDefaultValueParameters("typeSelection"));
        setPopulationValue(getDefaultValueParameters("populationType"));
        setAreaSelectedValue(getDefaultValueParameters("idGeo"));
        setNumberOfNodes(getDefaultValueParameters("numberNodes"));
        setGraphId(getDefaultValueParameters("idGraph"));
        if (getDefaultValueParameters("numberNodes") !== 0) {
            setShowSectionInitialConditions(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getDefaultValueParameters]);

    return (
        <>
            <Flex ml="2%" p="0" h="100%" w="100%" mt="20px">
                <Box w="38%">
                    <Flex
                        direction="column"
                        // w="100%"
                        borderRadius="8px"
                        boxShadow="sm"
                        border="1px solid #DDDDDD"
                        p="2%"
                        h="63vh"
                        overflowY="auto"
                    >
                        <ModelAccordion
                            modelName={actualModelName}
                            setModelName={setActualModelName}
                            modelValue={modelValue}
                            setModelValue={setModelValue}
                            populationValue={populationValue}
                            setPopulationValue={setPopulationValue}
                            numberOfNodes={numberOfNodes}
                            setNumberOfNodes={setNumberOfNodes}
                            dataSourceValue={dataSourceValue}
                            setDataSourceValue={setDataSourceValue}
                            areaSelectedValue={areaSelectedValue}
                            setAreaSelectedValue={setAreaSelectedValue}
                            graphId={graphId}
                            setGraphId={setGraphId}
                            showSectionInitialConditions={
                                showSectionInitialConditions
                            }
                            setShowSectionInitialConditions={
                                setShowSectionInitialConditions
                            }
                            graphsSelectedValue={graphsSelectedValue}
                            setGraphsSelectedValue={setGraphsSelectedValue}
                            matrixId={matrixId}
                            setMatrixId={setMatrixId}
                        />
                        {numberOfNodes !== 0 &&
                            numberOfNodes !== undefined &&
                            ((dataSourceValue === "geographic" &&
                                areaSelectedValue !== "" &&
                                areaSelectedValue !== undefined) ||
                                (dataSourceValue === "graph" &&
                                    graphId !== "" &&
                                    graphId !== undefined)) && (
                                <ModelBuilder
                                    setShowSectionVariable={
                                        setShowSectionVariable
                                    }
                                    setPositionVDT={setPositionVDT}
                                    setShowSectionInitialConditions={
                                        setShowSectionInitialConditions
                                    }
                                    idGeo={areaSelectedValue}
                                    modelCompartment={modelValue.toUpperCase()}
                                    numberNodes={numberOfNodes}
                                    populationValue={populationValue}
                                    dataSourceValue={dataSourceValue}
                                    modelName={actualModelName}
                                    startDate={startDate}
                                    matrixId={matrixId}
                                    setMatrixId={setMatrixId}
                                />
                            )}
                    </Flex>
                    <Box
                        borderRadius="8px"
                        boxShadow="sm"
                        border="1px solid #DDDDDD"
                        p="2%"
                        mt="1rem"
                        h="10vh"
                    >
                        <ModelInterventions />
                    </Box>
                </Box>
                {showSectionInitialConditions && !showSectionVariable && (
                    <Flex
                        direction="column"
                        w="50%"
                        m="0 2%"
                        borderRadius="6px"
                        boxShadow="sm"
                        overflowY="auto"
                        h="75vh"
                    >
                        {/* <ModelsMap idGeo={areaSelectedValue} /> */}

                        {dataSourceValue === "geographic" &&
                            areaSelectedValue !== undefined &&
                            areaSelectedValue !== "" && (
                                <ModelsMap idGeo={areaSelectedValue} />
                            )}
                        {numberOfNodes !== 0 &&
                            initialConditions.length > 0 && (
                                <InitialConditionsModels
                                    modelName={actualModelName}
                                    modelValue={modelValue}
                                    populationValue={populationValue}
                                    idGeo={areaSelectedValue}
                                    idGraph={0}
                                    dataSourceValue={dataSourceValue}
                                    initialConditionsGraph={initialConditions}
                                    startDate={startDate}
                                    setStartDate={setStartDate}
                                />
                            )}
                    </Flex>
                )}
                {showSectionVariable && (
                    <Flex
                        direction="column"
                        ml="2%"
                        borderRadius="8px"
                        boxShadow="sm"
                        border="1px solid #DDDDDD"
                        p="2%"
                        textAlign="center"
                        h="75vh"
                        w="50%"
                        overflowY="scroll"
                    >
                        <SectionVariableDependentTime
                            valuesVariablesDependent={dataViewVariable}
                            showSectionVariable={setShowSectionVariable}
                            positionVariableDependentTime={positionVDT}
                            showSectionInitialConditions={
                                setShowSectionInitialConditions
                            }
                        />
                    </Flex>
                )}
            </Flex>
        </>
    );
};

export default ModelMainTab;
