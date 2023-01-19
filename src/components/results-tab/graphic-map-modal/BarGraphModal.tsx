/* eslint-disable sonarjs/no-duplicate-string */
import React, { useState, useEffect, useContext } from "react";
import Plot from "react-plotly.js";

import getColor from "../getColor";
import { GraphicsData } from "context/GraphicsContext";
import { TabIndex } from "context/TabContext";
import { DoubleYAxisData, SavedSimulationData } from "types/GraphicsTypes";
import getNodeName from "utils/getNodeNames";

interface Props {
    savedSimulationKeys?: DoubleYAxisData[];
    simDay: number;
    maxValue: number;
    colorScale: string;
    isMono: boolean;
}

/**
 * Bar chart for simultaneous display modal.
 * @subcategory Results
 * @component
 */
const BarGraphModal = ({
    savedSimulationKeys,
    simDay,
    maxValue,
    colorScale,
    isMono,
}: Props) => {
    const { realDataSimulationKeys, allGraphicData } = useContext(GraphicsData);
    const [axios, setAxios] = useState([]);
    const { aux } = useContext(TabIndex);
    const data = JSON.parse(aux);

    /**
     * Create an object ready to send as data to the Bar Plot.
     * @param {Array} axisKeys List with objects composed by simulation name and parameters chosen to graph.
     * @returns {Object}
     */
    const graphBarSimulation = (axisKeys) => {
        return axisKeys.map((simKey) => {
            // Get data of a simulation.
            const simKeyFilter = data.filter((sim) => {
                return sim.name === simKey.name;
            });
            // Get real data of a simulation.
            const simRealDataKeyFilter = realDataSimulationKeys.filter(
                (sim) => {
                    return sim.name === simKey.name;
                }
            );
            // Get the selected keys from the simulation.
            const savedKeys = simKey.keys;
            return savedKeys.map((key) => {
                if (key.includes("Real")) {
                    // Find the data according to the saved key.
                    let filterKey = key.slice(0, -5);
                    if (filterKey === "population") {
                        filterKey = "P";
                    }
                    const simulationRealKeys =
                        simRealDataKeyFilter[0][filterKey];

                    return {
                        x: [key],
                        y: [Object.values(simulationRealKeys)[simDay]],
                        type: "bar",
                        marker: {
                            color: getColor(
                                Object.values(simulationRealKeys)[simDay],
                                maxValue,
                                colorScale
                            ),
                        },
                        name: `${key} - ${getNodeName(
                            simRealDataKeyFilter[0].name,
                            isMono
                        )}`,
                        width: 0.2,
                    };
                }
                let filterSimKey = key;
                if (key === "population") {
                    filterSimKey = "S";
                }
                const simulationKeys = simKeyFilter[0][filterSimKey];

                return {
                    x: [key],
                    y: [Object.values(simulationKeys)[simDay]],
                    type: "bar",
                    marker: {
                        color: getColor(
                            Object.values(simulationKeys)[simDay],
                            maxValue,
                            colorScale
                        ),
                    },
                    name: `${key} - ${getNodeName(
                        simKeyFilter[0].name,
                        isMono
                    )}`,
                    width: 0.2,
                };
            });
        });
    };

    useEffect(() => {
        const axisKeys = savedSimulationKeys[0].leftAxis.filter(
            (key: SavedSimulationData) => {
                return key.name !== "global_results";
            }
        );
        const axiosData = graphBarSimulation(axisKeys);
        let dataToGraph = [];

        axiosData.forEach((simulation) => {
            simulation.forEach((parameter) => {
                dataToGraph = [...dataToGraph, parameter];
                return dataToGraph;
            });
        });

        setAxios(dataToGraph);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [savedSimulationKeys, allGraphicData, simDay]);

    return (
        <>
            <Plot
                data={axios}
                layout={{
                    autosize: false,
                    width: 320,
                    height: 260,
                    margin: {
                        l: 75,
                        b: 60,
                        t: 0,
                    },
                    color: "blue",
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
                        range: [0, maxValue],
                        autorange: false,
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

export default BarGraphModal;
