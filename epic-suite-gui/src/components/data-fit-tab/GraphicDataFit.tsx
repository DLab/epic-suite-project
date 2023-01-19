import React, { useContext, useEffect, useState } from "react";
import Plot from "react-plotly.js";

import { DataFit } from "context/DataFitContext";

interface Props {
    algorithmValue: undefined | string;
}

/**
 * Graph for analysis of real data versus adjusted data.
 * @subcategory DataFitTab
 * @component
 */
const GraphicDataFit = ({ algorithmValue }: Props) => {
    const { fittedData, realDataToFit } = useContext(DataFit);
    const [axios, setAxios] = useState([]);
    const [shapesArray, setShapesArray] = useState([]);

    /**
     * Saves the real and adjusted values of the selected parameter.
     * Returns a data set ready to send as data to the Plot.
     * @param {string} parameter name of the parameter to plot.
     */
    const getAxisData = (parameter) => {
        const getFittedData = {
            x: Object.keys(fittedData[0].I),
            y: Object.values(fittedData[0].I),
            mode: "lines",
            name: `I Fit ${fittedData[0].name}`,
        };
        const getRealData = {
            x: Object.keys(realDataToFit[0].I_d_data),
            y: Object.values(realDataToFit[0].I_d_data),
            mode: "line",
            line: {
                dash: "dot",
                width: 3,
            },
            name: `I Real ${realDataToFit[0].name}`,
        };

        setAxios([getFittedData, getRealData]);
    };

    useEffect(() => {
        if (fittedData[0] !== undefined && realDataToFit[0] !== undefined) {
            if (algorithmValue === "Intervals") {
                getAxisData("I_d_data");
            }
            if (algorithmValue === "Sequential") {
                getAxisData("I_d_data");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [algorithmValue, fittedData, realDataToFit]);

    useEffect(() => {
        const paramFitValues = Object.values(fittedData[0].I);
        const maxFitValue = Math.max.apply(null, paramFitValues);

        const paramRealValues = Object.values(realDataToFit[0].I_d_data);
        const maxRealValue = Math.max.apply(null, paramRealValues);

        const maxValue =
            maxRealValue > maxFitValue ? maxRealValue : maxFitValue;

        const parseParmDays = JSON.parse(fittedData[0].beta_days);

        const getShapsArray = parseParmDays.map((dayValue) => {
            return {
                type: "line",
                x0: dayValue,
                y0: 0,
                x1: dayValue,
                y1: maxValue,
                line: {
                    color: "#7c8187",
                    width: 1.5,
                    dash: "dash",
                },
            };
        });
        setShapesArray(getShapsArray);
    }, [fittedData, realDataToFit]);

    return (
        <Plot
            data={axios}
            layout={{
                autosize: false,
                width: "90%",
                height: 200,
                margin: {
                    l: 50,
                    b: 30,
                    t: 50,
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
                shapes: shapesArray,
            }}
            config={{
                editable: false,
                responsive: true,
            }}
        />
    );
};

export default GraphicDataFit;
