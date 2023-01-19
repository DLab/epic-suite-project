/* eslint-disable sonarjs/no-duplicate-string */
import { Button } from "@chakra-ui/react";
import React, { useState, useEffect, useContext } from "react";
import Plot from "react-plotly.js";

import { GraphicsData } from "context/GraphicsContext";
import { TabIndex } from "context/TabContext";
import { DoubleYAxisData, SavedSimulationData } from "types/GraphicsTypes";
import getNodeName from "utils/getNodeNames";

interface Props {
    savedSimulationKeys?: DoubleYAxisData[];
    simDay: number;
    maxValue: number;
    duration: number | string;
    isMono: boolean;
}

/**
 * Line chart for simultaneous display modal.
 * @subcategory Results
 * @component
 */
const GraphModal = ({
    savedSimulationKeys,
    simDay,
    maxValue,
    duration,
    isMono,
}: Props) => {
    const { realDataSimulationKeys, allGraphicData } = useContext(GraphicsData);
    const [axios, setAxios] = useState([]);
    const { aux } = useContext(TabIndex);
    const data = JSON.parse(aux);

    /**
     * Create an object ready to send as data to the Lines Plot.
     * @param {Array} axisKeys List with objects composed by simulation name and parameters chosen to graph.
     * @returns {Object}
     */
    const graphSimulation = (axisKeys) => {
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
                    const simulationKeys = simRealDataKeyFilter[0][filterKey];
                    const valuesRealByRange = Object.values(
                        simulationKeys
                    ).slice(0, simDay);
                    return {
                        x: Object.keys(simulationKeys),
                        y: valuesRealByRange,
                        mode: "lines",
                        name: `${key} - ${getNodeName(
                            simRealDataKeyFilter[0].name,
                            isMono
                        )}`,
                    };
                }
                let filterSimKey = key;
                if (key === "population") {
                    filterSimKey = "S";
                }
                const simulationKeys = simKeyFilter[0][filterSimKey];
                const valuesByRange = Object.values(simulationKeys).slice(
                    0,
                    simDay
                );
                // setDurationSim(Object.keys(simulationKeys))
                return {
                    x: Object.keys(simulationKeys),
                    y: valuesByRange,
                    mode: "lines",
                    name: `${key} - ${getNodeName(
                        simKeyFilter[0].name,
                        isMono
                    )}`,
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
        const axiosData = graphSimulation(axisKeys);
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
                        autorange: false,
                        range: [0, duration],
                    },
                    yaxis: {
                        title: {
                            text: "Population",
                        },
                        autorange: false,
                        range: [0, maxValue],
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

export default GraphModal;
