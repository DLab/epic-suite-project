import {
    CheckCircleIcon,
    WarningTwoIcon,
    InfoOutlineIcon,
    InfoIcon,
} from "@chakra-ui/icons";
import {
    Badge,
    Button,
    Icon,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Text,
    useToast,
} from "@chakra-ui/react";
import { format, add } from "date-fns";
import { useContext } from "react";

import { GraphicsData } from "context/GraphicsContext";
import { HardSimSetted } from "context/HardSimulationsStatus";
import { NewModelSetted } from "context/NewModelsContext";
import { SelectFeature } from "context/SelectFeaturesContext";
import { TabIndex } from "context/TabContext";
import { StatusSimulation } from "types/HardSimulationType";
import { NewModelsAllParams } from "types/SimulationTypes";
import postData, { getData } from "utils/fetchData";

import getSEIRHVDObjMono from "./getSEIRHVDObjMono";
import getSEIRObjMono from "./getSEIRObjMono";
import getSIRObjMono from "./getSIRObjMono";

export default function StatusHardSimPop() {
    const {
        hardSimulation: {
            details: { idModel, idProcess, description, result },
            status,
        },
    } = useContext(HardSimSetted);
    const { setAux, setIndex } = useContext(TabIndex);
    const { geoSelections } = useContext(SelectFeature);
    // Real Data Context
    const {
        setAllGraphicData,
        setAllResults,
        setDataToShowInMap,
        setGlobalParametersValues,
        setRealDataSimulationKeys,
    } = useContext(GraphicsData);
    const { completeModel, setSelectedModelsToSimulate } =
        useContext(NewModelSetted);
    const toast = useToast();

    const getObjectConfig = (selectedModels) => {
        const simulationsSelected = selectedModels.map((e) => {
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
            toast({
                position: "bottom-left",
                title: "Error",
                description: `${error.message}`,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return false;
        }
    };

    /**
     * Returns a list with the selected models to simulate.
     * @returns {NewModelsAllParams[]}
     */
    const getSelectedModel = (idHardModel) => {
        return [
            completeModel.find(
                (mod: NewModelsAllParams) => mod.idNewModel === idHardModel
            ),
        ];
    };

    const showDataInResultsTabs = (
        listResponse,
        globalResultsListResponse,
        selectedModels
    ) => {
        setAllGraphicData([]);
        setAllResults([]);
        setDataToShowInMap([]);
        setRealDataSimulationKeys([]);
        setAux(JSON.stringify(listResponse));
        setGlobalParametersValues(JSON.stringify([globalResultsListResponse]));
        setSelectedModelsToSimulate(selectedModels);
        getGraphicRealMetaData(selectedModels);
        setIndex(4);
    };
    const schemeColorStatus = {
        [StatusSimulation.NOTSTARTED]: () => (
            <Icon cursor="pointer" as={WarningTwoIcon} />
        ),
        [StatusSimulation.RECIEVED]: () => (
            <Icon cursor="pointer" color="skyblue" as={InfoIcon} />
        ),
        [StatusSimulation.STARTED]: () => (
            <Icon cursor="pointer" color="purple" as={InfoIcon} />
        ),
        [StatusSimulation.ERROR]: () => (
            <Icon cursor="pointer" color="red" as={WarningTwoIcon} />
        ),
        [StatusSimulation.FINISHED]: () => (
            <Icon cursor="pointer" color="green" as={CheckCircleIcon} />
        ),
        [StatusSimulation.CANCELED]: () => (
            <Icon cursor="pointer" color="gray" as={InfoOutlineIcon} />
        ),
    };
    return (
        <Popover placement="right">
            <PopoverTrigger>
                {schemeColorStatus[status]()}
                {/* <Status status={status} /> */}
            </PopoverTrigger>
            <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader fontWeight="bold">{status}</PopoverHeader>
                <PopoverBody>
                    <Text marginBottom="0.2rem">Detail: {description}</Text>
                    {/* {status === StatusSimulation.RECIEVED ||
                        (status === StatusSimulation.STARTED && (
                            <Button
                                onClick={() => {
                                    getData(
                                        `${process.env.NEXT_PUBLIC_COVID19GEOMODELLER_URL}/simulate_meta_status/${idProcess}?cancel=true`
                                    );
                                }}
                            >
                                Cancel
                            </Button>
                        ))} */}
                    {status === StatusSimulation.FINISHED && (
                        <Button
                            size="sm"
                            marginTop="0.2rem"
                            onClick={() => {
                                const { globalResult, result: resultData } =
                                    result as Record<string, unknown>;
                                const selectedModel = getSelectedModel(idModel);
                                showDataInResultsTabs(
                                    resultData,
                                    globalResult,
                                    selectedModel
                                );
                            }}
                        >
                            Show data
                        </Button>
                    )}
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
}
