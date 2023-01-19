import { Flex, Spinner } from "@chakra-ui/react";
import _ from "lodash";
import dynamic from "next/dynamic";
import React, { useCallback, useContext, useEffect, useState } from "react";

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
import ModelAccordion from "./ModelAccordion";
import ModelBuilder from "./ModelBuilder";
import SectionVariableDependentTime from "./SectionVariableDependentTime";

interface Props {
    id: number;
    initialConditions: InitialConditionsNewModel[];
    actualModelName: string;
    setActualModelName: (value: string) => void;
}

const ModelsMap = dynamic(() => import("./model-map/ModelsMap"), {
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
});

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
        <Flex ml="2%" p="0" h="100%" w="100%" mt="20px">
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
                    showSectionInitialConditions={showSectionInitialConditions}
                    setShowSectionInitialConditions={
                        setShowSectionInitialConditions
                    }
                    graphsSelectedValue={graphsSelectedValue}
                    setGraphsSelectedValue={setGraphsSelectedValue}
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
                            setShowSectionVariable={setShowSectionVariable}
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
                        />
                    )}
            </Flex>
            {showSectionInitialConditions && (
                <Flex
                    direction="column"
                    w="60%"
                    m="0 2%"
                    borderRadius="6px"
                    boxShadow="sm"
                    overflowY="auto"
                    h="75vh"
                >
                    {dataSourceValue === "geographic" &&
                        areaSelectedValue !== undefined &&
                        areaSelectedValue !== "" && (
                            <ModelsMap idGeo={areaSelectedValue} />
                        )}
                    {numberOfNodes !== 0 && initialConditions.length > 0 && (
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
                    w="60%"
                    m="0 2%"
                    bg="#FAFAFA"
                    borderRadius="6px"
                    boxShadow="sm"
                    overflowY="auto"
                    p="1rem"
                    textAlign="center"
                >
                    <SectionVariableDependentTime
                        valuesVariablesDependent={dataViewVariable}
                        showSectionVariable={setShowSectionVariable}
                        positionVariableDependentTime={positionVDT}
                    />
                </Flex>
            )}
            {/* <Flex direction="column">
                <ExportModels idModel={id} />
            </Flex> */}
        </Flex>
    );
};

export default ModelMainTab;
