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
    Tooltip,
    useToast,
} from "@chakra-ui/react";
import { format, add } from "date-fns";
import { useContext } from "react";

import ToastCustom from "components/ToastCustom";
import { GraphicsData } from "context/GraphicsContext";
import { HardSimSetted } from "context/HardSimulationsStatus";
import { NewModelSetted } from "context/NewModelsContext";
import { SelectFeature } from "context/SelectFeaturesContext";
import { TabIndex } from "context/TabContext";
import { StatusSimulation, TypeHardSimulation } from "types/HardSimulationType";
import type { NewModelsAllParams } from "types/SimulationTypes";
import postData, { getData } from "utils/fetchData";

import getSEIRHVDObjMono from "./getSEIRHVDObjMono";
import getSEIRObjMono from "./getSEIRObjMono";
import getSIRObjMono from "./getSIRObjMono";

export const schemeColorStatus = {
    [StatusSimulation.NOTSTARTED]: () => (
        <Icon cursor="pointer" as={WarningTwoIcon} />
    ),
    [StatusSimulation.RECIEVED]: () => (
        <Icon cursor="pointer" color="#3EBFE0" as={InfoIcon} />
    ),
    [StatusSimulation.STARTED]: () => (
        <Icon cursor="pointer" color="#3EBFE0" as={InfoIcon} />
    ),
    [StatusSimulation.ERROR]: () => (
        <Icon cursor="pointer" color="#8080A0" as={WarningTwoIcon} />
    ),
    [StatusSimulation.FINISHED]: () => (
        <Icon cursor="pointer" color="#005086" as={CheckCircleIcon} />
    ),
    [StatusSimulation.CANCELED]: () => (
        <Icon cursor="pointer" color="#8080A0" as={InfoOutlineIcon} />
    ),
};

export default function StatusHardSimPop() {
    const {
        hardSimulation: {
            details: { idModel, idProcess, description, result, type },
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
                render: () => (
                    <ToastCustom title="Error" status={StatusSimulation.ERROR}>
                        {error.message}
                    </ToastCustom>
                ),
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
    return (
        <>
            {(status === StatusSimulation.RECIEVED ||
                status === StatusSimulation.STARTED) && (
                <Text color="#3EBFE0">Running...</Text>
            )}
            {status === StatusSimulation.FINISHED &&
                type !== TypeHardSimulation.DATAFIT && (
                    <Button
                        size="xs"
                        marginTop="0.2rem"
                        color="white"
                        bg="#3EBFE0"
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
                        Show results
                    </Button>
                )}
            {status === StatusSimulation.ERROR && <Text>Failed</Text>}
        </>
        // <Popover placement="right">
        //     <PopoverTrigger>{schemeColorStatus[status]()}</PopoverTrigger>
        //     <PopoverContent>
        //         <PopoverArrow />
        //         <PopoverCloseButton />
        //         <PopoverHeader fontWeight="bold">{status}</PopoverHeader>
        //         <PopoverBody>
        //             <Text marginBottom="0.2rem">Detail: {description}</Text>
        //             {status === StatusSimulation.FINISHED &&
        //                 type !== TypeHardSimulation.DATAFIT && (
        //                     <Button
        //                         size="sm"
        //                         marginTop="0.2rem"
        //                         color="white"
        //                         bg="#016FB9"
        //                         onClick={() => {
        //                             const { globalResult, result: resultData } =
        //                                 result as Record<string, unknown>;
        //                             const selectedModel =
        //                                 getSelectedModel(idModel);
        //                             showDataInResultsTabs(
        //                                 resultData,
        //                                 globalResult,
        //                                 selectedModel
        //                             );
        //                         }}
        //                     >
        //                         Show data
        //                     </Button>
        //                 )}
        //         </PopoverBody>
        //     </PopoverContent>
        // </Popover>
    );
}
