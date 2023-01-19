/* eslint-disable complexity */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable @typescript-eslint/naming-convention */
import {
    Select,
    Text,
    Box,
    Flex,
    Spinner,
    useToast,
    Center,
    Button,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React, { useState, useContext, useEffect } from "react";

import BreadCrumb from "components/BreadCrumb";
import { getParametersFitModel } from "components/new-model/GetParametersByNodes";
import { DataFit } from "context/DataFitContext";
import { NewModelSetted } from "context/NewModelsContext";
import { EpidemicsData } from "types/ControlPanelTypes";
import { NewModelsAllParams } from "types/SimulationTypes";
import postData from "utils/fetchData";

import EndPointSource from "./EndPointSource";
import FileSource from "./FileSource";
import FitParemetersTabs from "./FitParemetersTabs";
import SampleSource from "./SampleSource";

import "react-datepicker/dist/react-datepicker.css";

const Graphic = dynamic(() => import("./GraphicDataFit"), {
    loading: () => (
        <Flex justifyContent="center" alignItems="center">
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
 * Component in charge of data adjustment.
 * @category DataFitTab
 * @component
 */
const DataFitTab = () => {
    const toast = useToast();
    const [dataSourceType, setDataSourceType] = useState("");
    const [algorithmValue, setAlgorithmValue] = useState(undefined);
    const [modelId, setModelId] = useState<number>(undefined);
    const [geoSelectionId, setGeoSelectionId] = useState(0);
    const [startDate, setStartDate] = useState(new Date(2021, 11, 31));
    const [dataValues, setDataValues] = useState([]);
    const [parameterName, setParameterName] = useState(undefined);
    const [isSimulating, setIsSimulating] = useState(false);
    const [enableFitButton, setEnableFitButton] = useState(false);
    // Cambiar valores del radio button a nombres representativos de los ejemplos
    const [sampleSourceValue, setSampleSourceValue] = useState("1");
    const { fittedData, realDataToFit, setFittedData, setRealDataToFit } =
        useContext(DataFit);
    const { completeModel, setCompleteModel, setNewModel } =
        useContext(NewModelSetted);

    useEffect(() => {
        if (
            modelId !== undefined &&
            algorithmValue !== undefined &&
            dataValues.length !== 0
        ) {
            setEnableFitButton(true);
        } else {
            setEnableFitButton(false);
        }
    }, [algorithmValue, dataValues.length, modelId]);

    useEffect(() => {
        if (algorithmValue === "Intervals") {
            setParameterName("New daily infected");
        }
        if (algorithmValue === "Sequential") {
            setParameterName("Active infected");
        }
    }, [algorithmValue]);

    /**
     * Returns a list with indices and values equal to the number of days in the simulation.
     * @param tEnd simulation duration.
     * @returns {Object}
     */
    const getTimeData = (tEnd) => {
        let timeObject = {};
        for (let index = 0; index <= tEnd; index += 1) {
            timeObject = { ...timeObject, [index]: index };
        }
        return timeObject;
    };

    /**
     * Returns the configuration object to call the dataFit api.
     * @returns {Object}
     */
    const getFitObjectConfig = () => {
        const { parameters: modelParameters } = completeModel.find(
            (model: NewModelsAllParams) => model.idNewModel === modelId
        );
        return {
            // refactorizar cuando el endpoint de datafit reciba funciones
            // tE_I: modelParameters.tE_I,
            // tI_R: modelParameters.tI_R,
            // tE_I: 5,
            // tI_R: 10,
            tE_I: +modelParameters.tE_I.val,
            tI_R: +modelParameters.tI_R.val,
            method: algorithmValue,
            I_d_data: JSON.stringify(realDataToFit[0].I_d_data),
            t_data: JSON.stringify(getTimeData(modelParameters.t_end)),
        };
    };

    /**
     * Gets the fitted data from the "dataFit" enpoint.
     * @returns object with the new parameter values.
     */
    async function getFittedData() {
        const objectConfig = getFitObjectConfig();

        // eslint-disable-next-line sonarjs/prefer-immediate-return
        const res = await postData(
            `${process.env.NEXT_PUBLIC_COVID19GEOMODELLER_URL}/datafit`,
            objectConfig
        );
        return res;
    }

    /**
     * Adds the fitted model to local storage and saved models.
     * @param fittedData2 object with the new adjusted values from the endpoint.
     */
    const addNewFitModel = (fittedData2) => {
        const originalModel = completeModel.find(
            (model: NewModelsAllParams) => model.idNewModel === modelId
        );
        const fittedModelData = {
            idNewModel: Date.now(),
            name: `${originalModel.name}fitted`,
            modelType: originalModel.modelType,
            populationType: originalModel.populationType,
            typeSelection: originalModel.typeSelection,
            idGeo: originalModel.idGeo,
            idGraph: originalModel.idGraph,
            initialConditions: originalModel.initialConditions,
            numberNodes: originalModel.numberNodes,
            t_init: originalModel.t_init,
        };

        const parametersValues: EpidemicsData = getParametersFitModel(
            originalModel.parameters,
            fittedData2
        );

        setCompleteModel({
            type: "add",
            payload: { ...fittedModelData, parameters: parametersValues },
        });

        setNewModel({
            type: "add",
            payload: fittedModelData,
        });

        localStorage.setItem(
            "newModels",
            JSON.stringify([
                ...completeModel,
                { ...fittedModelData, parameters: parametersValues },
            ])
        );
    };

    /**
     * If there is a selected model, it sends it to be adjusted.
     */
    const handleFetch = async () => {
        try {
            setIsSimulating(true);
            const fitRes = await getFittedData();
            const fitResModel = { model: fitRes.results.simulation };
            const val = Object.values(fitResModel);
            const keys = Object.keys(fitResModel);
            const resFittedData = val
                .map((simString: string) => JSON.parse(simString))
                .map((sim, i) => ({
                    name: keys[i],
                    ...sim,
                }));

            const fittedData2 = {
                I: resFittedData[0].I_d,
                I_ac: resFittedData[0].I_d,
                name: resFittedData[0].name,
                beta: fitRes.results.beta_values,
                beta_days: fitRes.results.beta_days,
                mu: fitRes.results.mu,
            };
            setFittedData([fittedData2]);
            addNewFitModel(fittedData2);
        } catch (error) {
            if (modelId === undefined) {
                toast({
                    position: "bottom-left",
                    title: "Error",
                    description: "Please, choose a model",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                toast({
                    position: "bottom-left",
                    title: "Error",
                    description: `${error.message}`,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        } finally {
            setIsSimulating(false);
        }
    };

    return (
        <Box h="100%">
            <Flex p="0" h="97%" direction="column">
                <BreadCrumb firstLink="Data Fit" />
                <Flex p="2%" boxShadow="sm">
                    <Flex
                        alignItems="center"
                        justify="space-between"
                        w="45%"
                        mr="1%"
                    >
                        <Select
                            w="13rem"
                            fontSize="14px"
                            mr="2%"
                            placeholder="Select a model"
                            size="sm"
                            value={modelId}
                            onChange={(e) => {
                                setModelId(+e.target.value);
                                if (e.target.value !== "") {
                                    const { idGeo } = completeModel.filter(
                                        (model: NewModelsAllParams) => {
                                            return (
                                                model.idNewModel ===
                                                +e.target.value
                                            );
                                        }
                                    )[0];
                                    // setGeoSelectionId(0);
                                    if (idGeo !== undefined) {
                                        const stringIdGeo = idGeo.toString();
                                        setGeoSelectionId(
                                            parseInt(stringIdGeo, 10)
                                        );
                                    } else {
                                        setGeoSelectionId(0);
                                    }
                                }
                                setFittedData([]);
                                setRealDataToFit([]);
                                setSampleSourceValue("1");
                                setDataValues([]);
                            }}
                        >
                            {completeModel.length > 0 &&
                                completeModel.map(
                                    (model: NewModelsAllParams) => {
                                        return (
                                            <option
                                                key={model.idNewModel}
                                                value={model.idNewModel}
                                            >
                                                {model.name}
                                            </option>
                                        );
                                    }
                                )}
                        </Select>
                        <Select
                            w="13rem"
                            fontSize="14px"
                            mr="2%"
                            placeholder="Select a Algorithm"
                            size="sm"
                            value={algorithmValue}
                            onChange={(e) => {
                                setAlgorithmValue(e.target.value);
                                setFittedData([]);
                                setRealDataToFit([]);
                                setDataValues([]);
                                setSampleSourceValue("1");
                            }}
                        >
                            <option key="algorithm-1" value="Intervals">
                                Intervals
                            </option>
                            <option key="algorithm-2" value="Sequential">
                                Sequential
                            </option>
                        </Select>
                        <Select
                            w="13rem"
                            fontSize="14px"
                            mr="2%"
                            placeholder="Data source"
                            size="sm"
                            value={dataSourceType}
                            onChange={(e) => {
                                setDataSourceType(e.target.value);
                                setFittedData([]);
                                setRealDataToFit([]);
                                setDataValues([]);
                                setSampleSourceValue("1");
                                // setGeoSelectionId(0);
                            }}
                        >
                            {/* <option key="file" value="file">
                                    File Upload
                                </option> */}
                            <option key="sample" value="sample">
                                Sample Data
                            </option>
                            {geoSelectionId !== undefined &&
                                geoSelectionId !== 0 && (
                                    <option key="endpoint" value="endpoint">
                                        Endpoint
                                    </option>
                                )}
                        </Select>
                    </Flex>
                    {/* {dataSourceType === "file" && <FileSource />} */}
                    <Flex w="50%" align="center">
                        {dataSourceType === "sample" && (
                            <SampleSource
                                value={sampleSourceValue}
                                setValue={setSampleSourceValue}
                                setDataValues={setDataValues}
                            />
                        )}
                        {dataSourceType === "endpoint" && (
                            <EndPointSource
                                modelId={modelId}
                                setDataValues={setDataValues}
                                algorithmValue={algorithmValue}
                            />
                        )}
                        <Flex mr="15px">
                            <Text fontSize="14px" mr="5px">
                                Data For Fit:
                            </Text>
                            {dataValues.length > 0 ? (
                                <Text fontSize="14px" color="green">
                                    {/* Refactorizar cuando se usen diferentes infectados */}
                                    {/* <TagLabel>{parameterName} Loaded</TagLabel> */}
                                    Loaded
                                </Text>
                            ) : (
                                <Text color="red" fontSize="14px">
                                    Pending
                                </Text>
                            )}
                        </Flex>
                        <Center>
                            <Button
                                colorScheme="blue"
                                color="white"
                                isDisabled={!enableFitButton}
                                onClick={() => {
                                    handleFetch();
                                }}
                            >
                                {isSimulating ? (
                                    <>
                                        <Spinner
                                            thickness="4px"
                                            speed="0.65s"
                                            emptyColor="gray.200"
                                            color="blue.500"
                                        />
                                        <Text pl="1rem">Fit...</Text>
                                    </>
                                ) : (
                                    `Fit`
                                )}
                            </Button>
                        </Center>
                    </Flex>
                </Flex>
                <Flex direction="column" w="65%" m="0 2%" h="88vh">
                    <Flex
                        h="50%"
                        bg="#FAFAFA"
                        borderRadius="6px"
                        justify="center"
                        align="center"
                        mb="2%"
                        boxShadow="sm"
                    >
                        {fittedData.length > 0 && realDataToFit.length > 0 ? (
                            <Graphic algorithmValue={algorithmValue} />
                        ) : (
                            <Text>Graphic</Text>
                        )}
                    </Flex>
                    <Box
                        h="50%"
                        bg="#FAFAFA"
                        borderRadius="6px"
                        p="2%"
                        boxShadow="sm"
                        overflowY="auto"
                    >
                        {fittedData.length > 0 && realDataToFit.length > 0 ? (
                            <FitParemetersTabs />
                        ) : (
                            <Text>Fit Parameters Table</Text>
                        )}
                    </Box>
                </Flex>
            </Flex>
        </Box>
    );
};
export default DataFitTab;
