import { DeleteIcon } from "@chakra-ui/icons";
import {
    Flex,
    Spinner,
    Accordion,
    Icon,
    Button,
    useToast,
} from "@chakra-ui/react";
import _ from "lodash";
import dynamic from "next/dynamic";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import ExportModels from "components/new-model/ExportModels";
import { ControlPanel } from "context/ControlPanelContext";
import { GraphicsData } from "context/GraphicsContext";
import { NewModelSetted } from "context/NewModelsContext";
import { TabIndex } from "context/TabContext";
import { RootState } from "store/store";
import { InitialConditionsNewModel } from "types/ControlPanelTypes";
import { NewModelsAllParams, NewModelsParams } from "types/SimulationTypes";
import VariableDependentTime, {
    NameFunction,
} from "types/VariableDependentTime";

import InitialConditionsModels from "./InitialConditionsModel";
import ModelAccordion from "./ModelAccordion";
import ModelBuilder from "./ModelBuilder";
import SectionVariableDependentTime from "./SectionVariableDependentTime";

interface Props {
    id: number;
    initialConditions: InitialConditionsNewModel[];
    setTabIndex: (value: number) => void;
    index: number;
}

const ModelsMap = dynamic(() => import("./ModelsMap"), {
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
const ModelMainTab = ({ id, initialConditions, setTabIndex, index }: Props) => {
    const [modelName, setModelName] = useState("");
    const [modelValue, setModelValue] = useState(undefined);
    const [numberOfNodes, setNumberOfNodes] = useState(0);
    const [dataSourceValue, setDataSourceValue] = useState(undefined);
    const [areaSelectedValue, setAreaSelectedValue] = useState(undefined);
    const [populationValue, setPopulationValue] = useState(undefined);
    const [graphId, setGraphId] = useState(undefined);
    const [isModelSavedLocal, setIsModelSavedLocal] = useState(false);
    const [graphsSelectedValue, setGraphsSelectedValue] = useState(undefined);
    const [showSectionInitialConditions, setShowSectionInitialConditions] =
        useState(false);
    const { newModel, setNewModel, completeModel, setCompleteModel } =
        useContext(NewModelSetted);
    const { setAux } = useContext(TabIndex);
    const { setIdModelUpdate, dataViewVariable } = useContext(ControlPanel);
    const [startDate, setStartDate] = useState(
        new Date(
            newModel.find((model: NewModelsParams) => model.idNewModel === id)
                .t_init ?? new Date(2022, 6, 1)
        )
    );
    const [showSectionVariable, setShowSectionVariable] =
        useState<boolean>(false);
    const [positionVDT, setPositionVDT] = useState<number>(-1);
    const parameters = useSelector((state: RootState) => state.controlPanel);
    const dispatch = useDispatch();
    // const { parameters } = useContext(ControlPanel);
    const {
        setAllGraphicData,
        setRealDataSimulationKeys,
        setDataToShowInMap,
        setAllResults,
    } = useContext(GraphicsData);

    /**
     * Gets the saved value of the requested parameter.
     */
    const getDefaultValueParameters = useCallback(
        (field) => {
            return newModel.find(({ idNewModel }) => idNewModel === id)[field];
        },
        [newModel, id]
    );

    /**
     * Save a new model in the context and in local storage.
     */
    const getModelCompleteObj = () => {
        const modelInfo = newModel.find(
            (model: NewModelsParams) => model.idNewModel === id
        );
        const allModelInfo = {
            ...modelInfo,
            parameters,
        };
        const modelExist = completeModel.find(
            (model: NewModelsAllParams) => +model.idNewModel === id
        );
        if (modelExist !== undefined) {
            setCompleteModel({
                type: "update-all",
                id,
                payload: allModelInfo,
            });
            const modelsAux = [...completeModel].map(
                (e: NewModelsAllParams, i) => {
                    if (e.idNewModel === id) {
                        return allModelInfo;
                    }
                    return e;
                }
            );
            localStorage.setItem("newModels", JSON.stringify(modelsAux));
        } else {
            setCompleteModel({
                type: "add",
                payload: allModelInfo,
            });

            localStorage.setItem(
                "newModels",
                JSON.stringify([...completeModel, allModelInfo])
            );
        }
    };
    useEffect(() => {
        setIdModelUpdate(id ?? 0);
    }, [id, setIdModelUpdate]);

    useEffect(() => {
        try {
            const modelSaved = completeModel.find(
                (model: NewModelsAllParams) => {
                    return model.idNewModel === id;
                }
            );
            const savedObject = {
                idGeo: modelSaved?.idGeo,
                idGraph: modelSaved?.idGraph,
                idNewModel: modelSaved?.idNewModel,
                modelType: modelSaved?.modelType,
                name: modelSaved?.name,
                numberNodes: modelSaved?.numberNodes,
                populationType: modelSaved?.populationType,
                typeSelection: modelSaved?.typeSelection,
            };

            const actualObject = {
                idGeo: areaSelectedValue,
                idGraph: graphId,
                idNewModel: id,
                modelType: modelValue,
                name: modelName,
                numberNodes: numberOfNodes,
                populationType: populationValue,
                typeSelection: dataSourceValue,
            };

            const initialConditionsNew = newModel.find(
                (model: NewModelsParams) => {
                    return model.idNewModel === id;
                }
            );

            const previusInitialConditions =
                modelSaved.initialConditions[0].conditionsValues;

            const newsInitialConditions =
                initialConditionsNew.initialConditions[0].conditionsValues;

            if (
                _.isEqual(savedObject, actualObject) &&
                _.isEqual(previusInitialConditions, newsInitialConditions)
            ) {
                setIsModelSavedLocal(true);
            } else {
                setIsModelSavedLocal(false);
            }
        } catch (error) {
            setIsModelSavedLocal(false);
        }
    }, [
        areaSelectedValue,
        completeModel,
        dataSourceValue,
        graphId,
        id,
        modelName,
        modelValue,
        newModel,
        numberOfNodes,
        populationValue,
    ]);

    useEffect(() => {
        const modelSaved = completeModel.find((model: NewModelsAllParams) => {
            return model.idNewModel === id;
        });
        if (modelSaved) {
            if (_.isEqual(modelSaved.parameters, parameters)) {
                // setIsModelSavedLocal(true);
                // setAllGraphicData([]);
                // setAllResults([]);
                // setDataToShowInMap([]);
                // setRealDataSimulationKeys([]);
            } else {
                setIsModelSavedLocal(false);
                // setAux("");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [completeModel, id, setIsModelSavedLocal, parameters]);

    /**
     * Delete a model from local storage.
     */
    const deleteFromLocalStorage = () => {
        const modelFilter = [...completeModel].filter(
            (model: NewModelsAllParams) => model.idNewModel !== +id
        );
        localStorage.setItem("newModels", JSON.stringify(modelFilter));
    };
    const toast = useToast();
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

    useEffect(() => {
        const getName = getDefaultValueParameters("name");
        if (getName === "") {
            const name = `Model ${index + 1}`;
            setModelName(name);
        } else {
            setModelName(getName);
        }
        return () => {
            setModelName("");
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getDefaultValueParameters, index]);

    return (
        <Flex ml="2%" p="0" h="100%" w="100%">
            <Flex
                direction="column"
                w="38%"
                bg="#FAFAFA"
                borderRadius="6px"
                boxShadow="sm"
                alignItems="center"
            >
                <Accordion
                    key="new-models-accordion"
                    allowMultiple
                    w="100%"
                    overflowY="auto"
                    overflowX="hidden"
                    maxH="100%"
                    defaultIndex={[0]}
                >
                    <ModelAccordion
                        modelName={modelName}
                        setModelName={setModelName}
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
                        id={id}
                        showSectionInitialConditions={
                            showSectionInitialConditions
                        }
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
                                modelName={modelName}
                                startDate={startDate}
                                id={id}
                            />
                        )}
                </Accordion>
                {numberOfNodes !== 0 && numberOfNodes !== undefined && (
                    <Button
                        size="sm"
                        colorScheme="teal"
                        m="2%"
                        isDisabled={isModelSavedLocal}
                        onClick={() => {
                            const modelForSim = newModel.findIndex(
                                (mod: NewModelsParams) => mod.idNewModel === id
                            );
                            const isInitialConditionsVoid = newModel[
                                modelForSim
                            ].initialConditions.some((init) => {
                                if (
                                    Object.values(init.conditionsValues).every(
                                        (values) => values === 0
                                    )
                                ) {
                                    return true;
                                }
                                return false;
                            });
                            if (isInitialConditionsVoid) {
                                toast({
                                    position: "bottom-left",
                                    title: "Updated failed",
                                    description:
                                        "There is one or more nodes with all initial conditions values as zero ",
                                    status: "error",
                                    duration: 3000,
                                    isClosable: true,
                                });
                            } else {
                                getModelCompleteObj();
                                toast({
                                    position: "bottom-left",
                                    title: "Model is ready",
                                    description: "Model is enabled to simulate",
                                    status: "success",
                                    duration: 3000,
                                    isClosable: true,
                                });
                            }
                        }}
                    >
                        Save Model
                    </Button>
                )}
            </Flex>
            {showSectionInitialConditions && (
                <Flex
                    direction="column"
                    w="60%"
                    m="0 2%"
                    bg="#FAFAFA"
                    borderRadius="6px"
                    boxShadow="sm"
                    overflowY="auto"
                >
                    {dataSourceValue === "geographic" &&
                        areaSelectedValue !== undefined &&
                        areaSelectedValue !== "" && (
                            <ModelsMap idGeo={areaSelectedValue} />
                        )}
                    {numberOfNodes !== 0 && (
                        <InitialConditionsModels
                            modelName={modelName}
                            modelValue={modelValue}
                            populationValue={populationValue}
                            id={id}
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
            <Flex direction="column">
                <Icon
                    color="#16609E"
                    as={DeleteIcon}
                    cursor="pointer"
                    mb="0.3rem"
                    onClick={() => {
                        setNewModel({
                            type: "remove",
                            element: id,
                        });
                        setCompleteModel({
                            type: "remove",
                            element: id,
                        });
                        deleteFromLocalStorage();
                        setAllGraphicData([]);
                        setRealDataSimulationKeys([]);
                        setDataToShowInMap([]);
                        setAllResults([].concat([], []));
                        setTabIndex(newModel.length - 2);
                    }}
                />
                <ExportModels idModel={id} />
            </Flex>
        </Flex>
    );
};

export default ModelMainTab;
