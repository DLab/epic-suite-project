/* eslint-disable sonarjs/no-duplicate-string */
import { Input } from "@chakra-ui/react";
import React, { useState, useEffect, useContext } from "react";
import Plot from "react-plotly.js";

import { GraphicsData } from "context/GraphicsContext";
import { TabIndex } from "context/TabContext";
import { DoubleYAxisData } from "types/GraphicsTypes";
import getNodeName from "utils/getNodeNames";

interface Props {
    savedSimulationKeys?: DoubleYAxisData[];
    width: string;
    height: string;
    index?: number;
    disabledName: boolean;
}

const Graphic = ({
    savedSimulationKeys,
    width,
    height,
    index,
    disabledName,
}: Props) => {
    const {
        realDataSimulationKeys,
        allGraphicData,
        setAllGraphicData,
        dataToShowInMap,
        setAllResults,
        globalParametersValues,
    } = useContext(GraphicsData);
    const [axios, setAxios] = useState([]);
    const [graphicName, setGraphicName] = useState("");
    const { aux } = useContext(TabIndex);
    const data = JSON.parse(aux);

    /**
     * Create an object ready to send as global data to the Plot.
     * @param axis axis side.
     * @param simulationKeys list with parameter values.
     * @param key key to graph.
     * @returns {Object}
     */
    const getGlobalDataAxis = (globalData, axis, simulationKeys, key) => {
        if (axis === "rightAxis") {
            return {
                x: globalData[0].t,
                y: simulationKeys,
                mode: "lines",
                line: {
                    dash: "dot",
                    width: 2,
                },
                name: `${key}- Global} <span style="font-weight: bold">Right</span>`,
                yaxis: "y2",
            };
        }
        return {
            x: globalData[0].t,
            y: simulationKeys,
            mode: "lines",
            name: `${key}- Global <span style="font-weight: bold">Left</span>`,
        };
    };

    /**
     * Create an object ready to send as real data to the Plot.
     * @param axis axis side.
     * @param simulationKeys list with parameter values.
     * @param key key to graph.
     * @param simRealDataKeyFilter real data results.
     * @returns {Object}
     */
    const getRealDataAxis = (
        axis,
        simulationKeys,
        key,
        simRealDataKeyFilter,
        isMono,
        isGlobal
    ) => {
        const name = isGlobal
            ? `${key}- Global`
            : `${key}-${getNodeName(simRealDataKeyFilter[0].name, isMono)}`;
        if (axis === "rightAxis") {
            return {
                x: Object.keys(simulationKeys),
                y: Object.values(simulationKeys),
                mode: "lines+markers",
                line: {
                    dash: "dot",
                    width: 2,
                },
                name: `${name} <span style="font-weight: bold">Right</span>`,
                yaxis: "y2",
            };
        }
        return {
            x: Object.keys(simulationKeys),
            y: Object.values(simulationKeys),
            mode: "lines+markers",
            name: `${name} <span style="font-weight: bold">Left</span>`,
        };
    };

    const getRealAndGlobalData = (
        key,
        simKey,
        axis,
        simRealDataKeyFilter,
        isMono
    ) => {
        // To find the data according to the saved key.
        let filterKey = key.slice(0, -5);
        if (simKey.name === "Global") {
            if (filterKey === "population") {
                filterKey = "P";
            }
            // Filters the real data and returns the values according to the selected parameter.
            const generalModalValue = realDataSimulationKeys.filter(
                (nodeData) => {
                    return nodeData.name === "global_results";
                }
            );
            const getGeneralRealModalValue = generalModalValue[0][filterKey];

            return getRealDataAxis(
                axis,
                getGeneralRealModalValue,
                key,
                generalModalValue,
                isMono,
                true
            );
        }
        const simulationKeys = simRealDataKeyFilter[0][filterKey];
        return getRealDataAxis(
            axis,
            simulationKeys,
            key,
            simRealDataKeyFilter,
            isMono,
            false
        );
    };

    /**
     * Create an object ready to send as data to the Plot.
     * @param {Array} axisKeys List with objects composed by simulation name and parameters chosen to graph.
     * @returns {Object}
     */
    const graphSimulation = (axisKeys, axis) => {
        const isMono = globalParametersValues === "";
        return axisKeys.map((simKey) => {
            // To get all the data of a simulation.
            const simKeyFilter = data.filter((sim) => {
                return sim.name === simKey.name;
            });
            // To get all the real data of a simulation.
            const simRealDataKeyFilter = realDataSimulationKeys.filter(
                (sim) => {
                    return sim.name === simKey.name;
                }
            );
            // To get the selected keys from the simulation.
            const savedKeys = simKey.keys;
            return savedKeys.map((key) => {
                if (key.includes("Real")) {
                    return getRealAndGlobalData(
                        key,
                        simKey,
                        axis,
                        simRealDataKeyFilter,
                        isMono
                    );
                }
                if (simKey.name === "Global") {
                    const globalData = JSON.parse(globalParametersValues);
                    const simulationKeys = globalData[0][key];
                    return getGlobalDataAxis(
                        globalData,
                        axis,
                        simulationKeys,
                        key
                    );
                }
                const simulationKeys = simKeyFilter[0][key];
                if (axis === "rightAxis") {
                    return {
                        x: Object.keys(simulationKeys),
                        y: Object.values(simulationKeys),
                        mode: "lines",
                        line: {
                            dash: "dot",
                            width: 3,
                        },
                        name: `${key}-${getNodeName(
                            simKeyFilter[0].name,
                            isMono
                        )} <span style="font-weight: bold">Right</span>`,
                        yaxis: "y2",
                    };
                }
                return {
                    x: Object.keys(simulationKeys),
                    y: Object.values(simulationKeys),
                    mode: "lines",
                    name: `${key}-${getNodeName(
                        simKeyFilter[0].name,
                        isMono
                    )} <span style="font-weight: bold">Left</span>`,
                };
            });
        });
    };

    useEffect(() => {
        const leftAxisKeys = savedSimulationKeys[0].leftAxis;
        const rightAxisKeys = savedSimulationKeys[0].rightAxis;
        const axiosLeftData = graphSimulation(leftAxisKeys, "leftAxis");
        const axiosRightData = graphSimulation(rightAxisKeys, "rightAxis");
        let leftDataToGraph = [];
        let rightDataToGraph = [];
        axiosLeftData.forEach((simulation) => {
            simulation.forEach((parameter) => {
                leftDataToGraph = [...leftDataToGraph, parameter];
                return leftDataToGraph;
            });
        });
        axiosRightData.forEach((simulation) => {
            simulation.forEach((parameter) => {
                rightDataToGraph = [...rightDataToGraph, parameter];
                return rightDataToGraph;
            });
        });

        const allDataToGraph = leftDataToGraph.concat(rightDataToGraph);

        setAxios(allDataToGraph);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [savedSimulationKeys, allGraphicData]);

    /**
     * Save the new chart name.
     * @param {string} name
     */
    const setNewGraphicName = (name) => {
        const allDataAux = allGraphicData;
        const auxAllGraphicData = allDataAux[index];
        auxAllGraphicData[0].graphicName = name;
        setAllGraphicData([...allDataAux]);
        setAllResults([].concat(dataToShowInMap, allDataAux));
    };

    useEffect(() => {
        if (savedSimulationKeys[0].graphicName === "") {
            setGraphicName(`Graphic ${index + 1}`);
            setNewGraphicName(`Graphic ${index + 1}`);
        } else {
            setGraphicName(savedSimulationKeys[0].graphicName);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allGraphicData]);

    return (
        <>
            {disabledName ? (
                <Input
                    border="none"
                    bg="#FFFFFF"
                    textAlign="center"
                    fontSize="20px"
                    w="60%"
                    value={graphicName}
                    isDisabled
                />
            ) : (
                <Input
                    border="none"
                    bg="#FFFFFF"
                    textAlign="center"
                    fontSize="20px"
                    value={graphicName}
                    focusBorderColor="none"
                    onChange={(e) => {
                        setGraphicName(e.target.value);
                    }}
                    onBlur={() => {
                        setNewGraphicName(graphicName);
                    }}
                />
            )}
            <Plot
                data={axios}
                layout={{
                    autosize: false,
                    width: +width,
                    height: +height * 0.9,
                    margin: {
                        l: 55,
                        b: 60,
                        t: 0,
                    },
                    color: "blue",
                    title: `<span style="display: none">""</span>`,
                    legend: { xanchor: "end", x: 1.1, y: 1.1, yanchor: "top" },
                    showlegend: true,
                    xaxis: {
                        title: {
                            text: "Time",
                        },
                        autorange: true,
                    },
                    yaxis: {
                        title: {
                            text: "Population",
                        },
                        autorange: true,
                    },
                    yaxis2: {
                        title: "Population",
                        titlefont: { color: "#5991c1" },
                        tickfont: { color: "#5991c1" },
                        overlaying: "y",
                        side: "right",
                    },
                }}
                config={{
                    editable: false,
                    responsive: true,
                }}
            />
        </>
    );
};

export default Graphic;
