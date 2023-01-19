/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable @typescript-eslint/naming-convention */
import { useToast } from "@chakra-ui/react";
import { format } from "date-fns";
import React, { useContext, useEffect } from "react";
import DatePicker from "react-datepicker";

import { NewModelSetted } from "context/NewModelsContext";
import { SelectFeature } from "context/SelectFeaturesContext";
import "react-datepicker/dist/react-datepicker.css";
// eslint-disable-next-line import/order
import countiesData from "data/counties.json";
import stateData from "data/states.json";
import { InitialConditionsNewModel } from "types/ControlPanelTypes";
import postData from "utils/fetchData";

import { postInitialConditionsByModel } from "./initialConditionsByModel";

interface Props {
    modelName: string;
    modelValue: string;
    populationValue: string;
    idGeo: number;
    startDate: Date;
    setStartDate: (value: Date) => void;
    initialConditionsGraph: InitialConditionsNewModel[];
}

/**
 * Date picker for model creation and obtaining initial conditions.
 * @subcategory NewModel
 * @component
 */
const SelectDate = ({
    modelName,
    modelValue,
    populationValue,

    idGeo,
    startDate,
    setStartDate,
    initialConditionsGraph,
}: Props) => {
    const toast = useToast();
    const { geoSelections } = useContext(SelectFeature);
    const { setNewModel, idModelUpdate: id } = useContext(NewModelSetted);

    /**
     * Provides the name of the USA state or county according to the fip.
     * @param {string} scale spatial scale of the model.
     * @param {string} fip county or state fip.
     * @returns {string} name of the state or county.
     */
    const getNodeName = (scale, fip) => {
        if (scale === "States") {
            return stateData.data.find((state) => state[0] === fip)[2];
        }
        return countiesData.data.find((state) => state[5] === fip)[7];
    };

    /**
     * Gets the initial conditions for monopopulation models.
     * @param url endpoint url.
     * @param name model name.
     * @param {Object} config object with the dates, fips, compartments and scale of the model.
     * @returns {InitialConditionsNewModel}
     */
    const getAllInitialConditions = async (url, name, config) => {
        const result = await postData(url, {
            [name]: config,
        });

        const allInitialConditions = postInitialConditionsByModel(result[name]);

        return {
            name,
            conditionsValues: allInitialConditions,
        };
    };

    /**
     * Gets the initial conditions for metapopulation models.
     * @param {string} url endpoint url.
     * @param {string} name model name.
     * @param {Object} config object with the dates, fips and compartments of the model.
     * @param {strin} scale model scale.
     * @returns {InitialConditionsNewModel}
     */
    const getAllMetaInitialConditions = async (url, name, config, scale) => {
        const result = await postData(url, {
            [name]: config,
        });

        return Object.keys(result).map((key) => {
            const allInitialConditionsMeta = postInitialConditionsByModel(
                result[key]
            );
            const nodeName = getNodeName(scale, key);

            return {
                name: nodeName.toString(),
                conditionsValues: allInitialConditionsMeta,
            };
        });
    };

    /**
     * It commands to request the initial conditions according to the type of population of the model.
     * @param {string} url endpoint url.
     * @param {string} method get o post.
     * @param {number} body id of the geographic selection.
     * @param {Date} date data request date.
     */
    const handleFetch = async (url, method, body, date) => {
        try {
            // setIsLoading(true);
            if (!body) {
                throw new Error("There's no geographics areas selected");
            }
            const { featureSelected: spatialSelection, scale } =
                geoSelections.find((element) => element.id === body);
            if (!spatialSelection) {
                throw new Error(
                    "Spatial selection hasn't states or counties selected. \n Check it before set initial conditions"
                );
            }
            const dateFormat = format(new Date(date), "yyyy/MM/dd");
            if (method === "POST") {
                if (populationValue === "monopopulation") {
                    // refactorizar cuando endpoint de init cond acepte modelo SIR
                    const modelCompartments =
                        modelValue !== "seirhvd" ? "seir" : "seirhvd";

                    const monoConfig = {
                        compartments: modelCompartments.toUpperCase(),
                        timeInit: dateFormat.split("/").join("-"),
                        timeEnd: dateFormat.split("/").join("-"),
                        scale,
                        spatialSelection,
                    };
                    const initialConditionsMono = await getAllInitialConditions(
                        url,
                        modelName,
                        monoConfig
                    );
                    setNewModel({
                        type: "update-initial-conditions",
                        payloadInitialConditions: [initialConditionsMono],
                        id,
                    });
                }
                if (populationValue === "metapopulation") {
                    // refactorizar cuando endpoint de init cond acepte modelo SIR
                    const modelCompartmentsMeta =
                        modelValue !== "seirhvd" ? "seir" : "seirhvd";

                    const getConfig = () => {
                        return {
                            compartments: modelCompartmentsMeta.toUpperCase(),
                            name: modelName,
                            timeInit: dateFormat.split("/").join("-"),
                            timeEnd: dateFormat.split("/").join("-"),
                            scale,
                            spatialSelection,
                        };
                    };

                    const results = await getAllMetaInitialConditions(
                        `${process.env.NEXT_PUBLIC_INITIALCONDITIONS_URL}/initCond?type=metapopulation`,
                        modelName,
                        getConfig(),
                        scale
                    );

                    setNewModel({
                        type: "update-initial-conditions",
                        payloadInitialConditions: results,
                        id,
                    });
                }
            }
        } catch (error) {
            toast({
                position: "bottom-left",
                title: "Error",
                description: `${error.message}`,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            // setIsLoading(false);
        }
    };

    useEffect(() => {
        if (
            idGeo !== undefined &&
            initialConditionsGraph[0].conditionsValues.population === 0
        ) {
            handleFetch(
                `${process.env.NEXT_PUBLIC_INITIALCONDITIONS_URL}/initCond`,
                // "http://192.168.2.131:5002/initCond",
                "POST",
                idGeo,
                new Date(startDate)
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idGeo, startDate]);

    return (
        <DatePicker
            dateFormat="yyyy/MM/dd"
            selected={startDate}
            onChange={(date) => {
                const selectDate = format(date, "yyyy/MM/dd");
                setStartDate(new Date(selectDate));
                setNewModel({
                    type: "update",
                    target: "t_init",
                    element: format(new Date(selectDate), "yyyy/MM/dd"),
                    id,
                });
                handleFetch(
                    `${process.env.NEXT_PUBLIC_INITIALCONDITIONS_URL}/initCond`,
                    // "http://192.168.2.131:5002/initCond",
                    "POST",
                    idGeo,
                    new Date(selectDate)
                );
            }}
            // openToDate={new Date(2022, 4, 31)}
            maxDate={new Date()}
        />
    );
};
export default SelectDate;
