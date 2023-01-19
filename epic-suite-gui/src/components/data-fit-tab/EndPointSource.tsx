/* eslint-disable @typescript-eslint/naming-convention */
import { Box, useToast, Button } from "@chakra-ui/react";
import { add, format } from "date-fns";
import React, { useContext } from "react";

import { DataFit } from "context/DataFitContext";
import { NewModelSetted } from "context/NewModelsContext";
import { SelectFeature } from "context/SelectFeaturesContext";
import { NewModelsAllParams } from "types/SimulationTypes";
import postData from "utils/fetchData";

interface Props {
    modelId: number;
    setDataValues: (value: unknown[]) => void;
    algorithmValue: undefined | string;
}

/**
 * Option to obtain real data from an endpoint.
 * @subcategory DataFitTab
 * @component
 */
const EndPointSource = ({ modelId, setDataValues, algorithmValue }: Props) => {
    const toast = useToast();
    const { geoSelections } = useContext(SelectFeature);
    const { setRealDataToFit } = useContext(DataFit);
    const { completeModel } = useContext(NewModelSetted);

    /**
     * Return the configuration file to call the realData endpoint.
     * @returns {Object} returns an object with the model data and its geographic selection.
     */
    const getObjectConfig = () => {
        const {
            parameters: modelParameters,
            idGeo,
            t_init,
        } = completeModel.find(
            (model: NewModelsAllParams) => model.idNewModel === modelId
        );
        const geoSetted = geoSelections.find((geo) => geo.id === idGeo);
        const timeEnd = add(new Date(t_init), {
            days: modelParameters.t_end,
        });

        return {
            name: "Data Fit",
            compartments: modelParameters.name,
            timeInit: format(new Date(t_init), "yyyy-MM-dd"),
            timeEnd: format(timeEnd, "yyyy-MM-dd"),
            scale: geoSetted?.scale,
            spatialSelection: geoSetted?.featureSelected,
        };
    };

    /**
     *
     * @param {number[]} data list with the values of the parameter according to the chosen algorithm.
     * @returns returns an object with the indices and the value of the parameter at that index.
     */
    const getData = (data) => {
        let dataObject = {};
        for (let index = 0; index < data.length; index += 1) {
            dataObject = { ...dataObject, [index]: data[index] };
        }
        return dataObject;
    };

    /**
     * It gets the real data from the "realData" api and saves its values according to the type of algorithm.
     */
    const handleFetch = async () => {
        try {
            const objectConfig = getObjectConfig();
            const res = await postData(
                `${process.env.NEXT_PUBLIC_INITIALCONDITIONS_URL}/api/v0/realData`,
                {
                    Data_Fit: objectConfig,
                }
            );
            // const res = await postData("http://192.168.2.131:5002/realData", {
            //     Data_Fit: objectConfig,
            // });
            const fitDataName = Object.keys(res);

            if (algorithmValue === "Intervals") {
                const dataForAlgorithm1 = Object.values(
                    // refactorizar cuando sepa que tipo de infectados usar
                    // res.result.Data_Fit.I
                    res.Data_Fit.I
                ).map((val: string) => {
                    return parseInt(val, 10);
                });

                setDataValues(dataForAlgorithm1);

                const jsObjectA1 = getData(dataForAlgorithm1);
                setRealDataToFit([
                    {
                        I_d_data: jsObjectA1,
                        name: fitDataName[0],
                    },
                ]);
            }
            if (algorithmValue === "Sequential") {
                const dataForAlgorithm2 = Object.values(
                    // refactorizar cuando sepa que tipo de infectados usar
                    // res.result.Data_Fit.I
                    res.Data_Fit.I
                ).map((val: string) => {
                    return parseInt(val, 10);
                });
                setDataValues(dataForAlgorithm2);
                const jsObjectA2 = getData(dataForAlgorithm2);
                setRealDataToFit([
                    {
                        I_d_data: jsObjectA2,
                        name: fitDataName[0],
                    },
                ]);
            }
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
        }
    };

    return (
        <Box m="0 0 3%">
            <Button
                size="sm"
                colorScheme="blue"
                variant="outline"
                onClick={() => {
                    // setFittedData([]);
                    // setRealDataToFit([]);
                    handleFetch();
                }}
            >
                Get Data
            </Button>
        </Box>
    );
};

export default EndPointSource;
