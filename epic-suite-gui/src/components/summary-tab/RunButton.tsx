/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/dot-notation */
import { Button, Icon, Spinner, Text, useToast } from "@chakra-ui/react";
import { format, add } from "date-fns";
import { useContext, useState, useEffect } from "react";

import Play from "components/icons/Play";
import RunModelsButton from "components/icons/RunModelsButton";
import { GraphicsData } from "context/GraphicsContext";
import { HardSimSetted } from "context/HardSimulationsStatus";
import { NewModelSetted } from "context/NewModelsContext";
import { SelectFeature } from "context/SelectFeaturesContext";
import { TabIndex } from "context/TabContext";
import {
    Actions,
    StatusSimulation,
    TypeHardSimulation,
} from "types/HardSimulationType";
import { NewModelsAllParams } from "types/SimulationTypes";
import createIdComponent from "utils/createIdcomponent";
import postData from "utils/fetchData";

import getMetaObj from "./getMetaObj";
import getSEIRHVDObjMono from "./getSEIRHVDObjMono";
import getSEIRObjMono from "./getSEIRObjMono";
import getSIRObjMono from "./getSIRObjMono";

// eslint-disable-next-line sonarjs/no-duplicate-string
const bottonLeft = "bottom-left";
type ReducedIdForPermissions = Record<number, boolean>;

interface Props {
    permission: ReducedIdForPermissions;
}
const SIMULATIONFAILED = "Simulation failed";

/**
 * Component that communicates with the necessary endpoints to obtain the real and simulated data of the selected models.
 * @subcategory Summary tab
 * @component
 */
const RunButton = ({ permission }: Props) => {
    const { geoSelections } = useContext(SelectFeature);
    // Real Data Context
    const { setRealDataSimulationKeys } = useContext(GraphicsData);
    //
    const toast = useToast();
    const { setAux, setIndex } = useContext(TabIndex);
    const {
        setAllGraphicData,
        setAllResults,
        setDataToShowInMap,
        setGlobalParametersValues,
    } = useContext(GraphicsData);
    const [isSimulating, setisSimulating] = useState(false);
    const {
        completeModel,
        setSelectedModelsToSimulate,
        setSimulationsPopulatioType,
    } = useContext(NewModelSetted);
    const { hardSimulation, setHardSimulation } = useContext(HardSimSetted);
    /**
     * Gets the configuration object to request the real data from the "realData" endpoint.
     * @param {NewModelsAllParams[]} selectedModels monopopulation models selected to simulate.
     * @returns {Obejct}
     */
    const getObjectConfig = (selectedModels) => {
        const simulationsSelected = selectedModels.map((e, i) => {
            const geoSetted = geoSelections.find((geo) => geo.id === e.idGeo);
            const timeEnd = add(new Date(e.t_init), {
                days: e.parameters.t_end,
            });
            return {
                name: e.name,
                compartments: e.parameters.name,
                timeInit: format(new Date(e.t_init), "yyyy-MM-dd"),
                timeEnd: format(timeEnd, "yyyy-MM-dd"),
                scale: geoSetted?.scale,
                spatialSelection: geoSetted?.featureSelected,
            };
        });

        const geoSimulationsOnly = simulationsSelected.filter((sim) => {
            return sim.scale !== undefined;
        });

        return geoSimulationsOnly.reduce((acc, it) => {
            return {
                ...acc,
                [`${it.name}`]: it,
            };
        }, {});
    };

    /**
     * Obtains the real data from the simulated monopopulation models.
     * @param {NewModelsAllParams[]} selectedModels monopopulation models selected to simulate..
     * @returns returns a list with the name of the model and the actual values of its parameters.
     */
    const getGraphicRealData = async (selectedModels) => {
        const objectConfig = getObjectConfig(selectedModels);
        try {
            if (Object.keys(objectConfig).length > 0) {
                const res = await postData(
                    `${process.env.NEXT_PUBLIC_INITIALCONDITIONS_URL}/realData`,
                    // "http://192.168.2.131:5002/realData",
                    objectConfig
                );
                const val = Object.values(res);
                const keys = Object.keys(res);
                const realDataKeys = val
                    .map((simString: string) => simString)
                    .map((sim, i) => ({
                        name: keys[i],
                        // eslint-disable-next-line @typescript-eslint/ban-types
                        ...(sim as {}),
                    }));

                return setRealDataSimulationKeys(realDataKeys);
            }
            return false;
        } catch (error) {
            return toast({
                position: "bottom-left",
                title: "Error",
                description: `${error.message}`,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    /**
     * Obtains the real data from the simulated metapopulation models.
     * @param {NewModelsAllParams[]} selectedModels metapopulation models selected to simulate.
     * @returns returns a list with the name of the model and the actual values of its parameters.
     */
    const getGraphicRealMetaData = async (selectedModels) => {
        const objectConfig = getObjectConfig(selectedModels);
        try {
            if (Object.keys(objectConfig).length > 0) {
                const res = await postData(
                    `${process.env.NEXT_PUBLIC_INITIALCONDITIONS_URL}/realData?type=metapopulation`,
                    // "http://192.168.2.131:5002/realData",
                    objectConfig
                );

                const listRealDataResponse = Object.keys(res).map((key) => {
                    return { name: key, ...res[key] };
                });

                return setRealDataSimulationKeys(listRealDataResponse);
            }
            return false;
        } catch (error) {
            return toast({
                position: "bottom-left",
                title: "Error",
                description: `${error.message}`,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    /**
     * Return the scale and fips of the chosen counties or states.
     * @param id model id.
     * @returns {Object}
     */
    const getScaleAndFeaturesSelected = (id) => {
        const geoselectionItems = geoSelections.find((g) => g.id === id) || {};
        const {
            scale,
            featureSelected,
        }: { scale?: string; featureSelected?: string[] } =
            (typeof geoselectionItems !== "undefined" && geoselectionItems) ||
            {};

        return { scale, featureSelected };
    };

    /**
     * Gets objects according to model types chosen to be simulated.
     * @param {NewModelsAllParams[]} simulations selected models to simulate.
     * @returns {Object} differentiated according to SIR, SEIR, SERHVD model.
     */
    const getSimulationSelectedObj = (simulations) => {
        return simulations.map((e) => {
            const { scale, featureSelected } = getScaleAndFeaturesSelected(
                e.idGeo
            );
            if (e.modelType === "seirhvd") {
                return getSEIRHVDObjMono(
                    e,
                    e.parameters,
                    scale,
                    featureSelected
                );
            }
            if (e.modelType === "sir") {
                return getSIRObjMono(e, e.parameters, scale, featureSelected);
            }
            return getSEIRObjMono(e, e.parameters, scale, featureSelected);
        });
    };

    /**
     * Returns a list with the selected models to simulate.
     * @returns {NewModelsAllParams[]}
     */
    const getSelectedModel = () => {
        let selectedModels = [];
        completeModel.map((model) => {
            if (permission[model.idNewModel]) {
                selectedModels = [...selectedModels, model];
                return selectedModels;
            }
            return false;
        });
        return selectedModels;
    };

    /**
     * Saves the results of a single-population simulation.
     * @param response result of the call to the "simulate" endpoint.
     * @param {NewModelsAllParams[]} selectedModels
     */
    const setMonopopulationData = (response, selectedModels) => {
        const val = Object.values(response.results);
        const keys = Object.keys(response.results);
        const data = val
            .map((simString: string) => JSON.parse(simString))
            .map((sim, i) => ({
                name: keys[i],
                ...sim,
            }));
        setAllGraphicData([]);
        setAllResults([]);
        setDataToShowInMap([]);
        // setAllResults([].concat(dataToShowInMap, []));
        setRealDataSimulationKeys([]);
        setAux(JSON.stringify(data));
        setSelectedModelsToSimulate(selectedModels);
        getGraphicRealData(selectedModels);
        setIndex(4);
    };

    /**
     * Result of the call to the "simulate" endpoint.
     */
    // eslint-disable-next-line sonarjs/cognitive-complexity
    const handleJsonToToml = async () => {
        setisSimulating(true);
        try {
            if (completeModel.length < 1) {
                throw new Error("You must add a simulation at least");
            }
            const selectedModels = getSelectedModel();
            // build object simulation template for toml
            const simulationsSelected =
                getSimulationSelectedObj(selectedModels);

            const objConfig = simulationsSelected.reduce((acc, it, i) => {
                const simName = completeModel.find(
                    (sim: NewModelsAllParams) => {
                        return sim.idNewModel === it.idSim;
                    }
                );
                return {
                    ...acc,
                    [`${simName.name}`]: it,
                };
            }, {});
            if (simulationsSelected.length > 0) {
                const { populationType } = completeModel.find(
                    (sim: NewModelsAllParams) => {
                        return sim.idNewModel === simulationsSelected[0].idSim;
                    }
                );
                let response;
                if (populationType === "metapopulation") {
                    const { scale, featureSelected } =
                        getScaleAndFeaturesSelected(selectedModels[0].idGeo);
                    const metaSimulationsSelected = getMetaObj(
                        selectedModels[0],
                        scale,
                        featureSelected
                    );
                    const metaObjectConfig = {
                        [`${selectedModels[0].name}`]: metaSimulationsSelected,
                    };
                    if (
                        hardSimulation.status === StatusSimulation.RECIEVED ||
                        hardSimulation.status === StatusSimulation.STARTED
                    ) {
                        throw new Error(
                            "You already have a high-cost simulation in progress, you can cancel that process or wait until it finishes."
                        );
                    }
                    response = await postData(
                        `${process.env.NEXT_PUBLIC_COVID19GEOMODELLER_URL}/simulate_meta`,
                        metaObjectConfig
                    );
                    setHardSimulation({
                        type: Actions.SET,
                        payload: {
                            name: `${selectedModels[0].name}`,
                            type: TypeHardSimulation.METAPOPULATION,
                            idProcess: response.id,
                            idModel: simulationsSelected[0].idSim,
                            description:
                                "Simulation parameters received successfully",
                        },
                        status: response.status.toUpperCase(),
                    });
                    window.localStorage.setItem(
                        "hardSimulationStatus",
                        JSON.stringify({
                            status: response.status.toUpperCase(),
                            details: {
                                name: `${selectedModels[0].name}`,
                                type: TypeHardSimulation.METAPOPULATION,
                                idProcess: response.id,
                                idModel: simulationsSelected[0].idSim,
                                description:
                                    "Simulation parameters received successfully",
                            },
                        })
                    );
                    // const name = `${selectedModels[0].name}`;

                    // const jsonResponse = await JSON.parse(
                    //     response.results[name]
                    // );

                    // const jsonGlobalResultsResponse = await JSON.parse(
                    //     response.global_results[name]
                    // );
                    // const listResponse = Object.keys(jsonResponse).map(
                    //     (key) => {
                    //         return { name: key, ...jsonResponse[key] };
                    //     }
                    // );

                    // let globalResultsListResponse = { name: "general" };
                    // Object.keys(jsonGlobalResultsResponse).forEach((key) => {
                    //     globalResultsListResponse = {
                    //         ...globalResultsListResponse,
                    //         [key]: Object.values(
                    //             jsonGlobalResultsResponse[key]
                    //         ),
                    //     };
                    // });

                    // setAllGraphicData([]);
                    // setAllResults([]);
                    // setDataToShowInMap([]);
                    // setRealDataSimulationKeys([]);
                    // setAux(JSON.stringify(listResponse));
                    // setGlobalParametersValues(
                    //     JSON.stringify([globalResultsListResponse])
                    // );
                    // setSelectedModelsToSimulate(selectedModels);
                    // getGraphicRealMetaData(selectedModels);
                    // setIndex(4);
                } else {
                    response = await postData(
                        `${process.env.NEXT_PUBLIC_COVID19GEOMODELLER_URL}/simulate`,
                        objConfig
                    );
                    setMonopopulationData(response, selectedModels);
                }
            }
            toast({
                position: bottonLeft,
                title: "Simulation success",
                description: "Your simulation was completed successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            if (error.response?.status === 400) {
                toast({
                    position: bottonLeft,
                    title: SIMULATIONFAILED,
                    description: "Parameters are invalid. Check your models!",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                toast({
                    position: bottonLeft,
                    title: SIMULATIONFAILED,
                    description: `${error.message}`,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        } finally {
            setisSimulating(false);
        }
    };

    const [disabledButton, setDisabledButton] = useState(true);
    useEffect(() => {
        if (Object.values(permission).some((perm) => perm)) {
            setDisabledButton(false);
        } else {
            setDisabledButton(true);
        }
    }, [permission]);

    return (
        <>
            <Button
                onClick={() => {
                    const withPermission = Object.values(permission).some(
                        (perm) => perm
                    );
                    if (withPermission) {
                        handleJsonToToml();
                        setSimulationsPopulatioType("");
                    } else {
                        toast({
                            position: bottonLeft,
                            title: SIMULATIONFAILED,
                            description: `You must select at least one model`,
                            status: "error",
                            duration: 3000,
                            isClosable: true,
                        });
                    }
                }}
                size="sm"
                fontSize="10px"
                bg="#016FB9"
                color="#FFFFFF"
                isDisabled={disabledButton}
            >
                {isSimulating ? (
                    <>
                        <Spinner
                            id={createIdComponent()}
                            thickness="4px"
                            speed="0.65s"
                            emptyColor="gray.200"
                            color="blue.500"
                        />
                        <Text id={createIdComponent()} pl="1rem">
                            Simulating...
                        </Text>
                    </>
                ) : (
                    <>
                        <Icon w="20px" h="20px" as={Play} mr="5px" />
                        RUN SELECTED MODELS
                    </>
                )}
            </Button>
        </>
    );
};

export default RunButton;
