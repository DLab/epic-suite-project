import { Box, Button, Center, Flex, HStack, Text } from "@chakra-ui/react";
import { parse, format } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import Plot from "react-plotly.js";

import countiesData from "../../data/counties.json";
import { MobilityMatrix } from "context/MobilityMatrixContext";
import { NewModelSetted } from "context/NewModelsContext";
import type { MobilityMatrixListProps } from "types/MobilityMatrixTypes";
import type { NewModelsParams } from "types/SimulationTypes";
import { formatDate } from "utils/formatDate";

function sumarMatriz(matriz, axis = 0) {
    let resultado;
    try {
        const sumarColumnas = () =>
            matriz[0].map((_, col) =>
                matriz.reduce((sum, fila) => sum + fila[col], 0)
            );
        const sumarFilas = () =>
            matriz.map((fila) => fila.reduce((a, b) => a + b, 0));

        resultado = [sumarColumnas, sumarFilas][axis]();
    } catch (error) {
        throw new Error(
            "El parámetro 'axis' debe ser 0 (columnas) o 1 (filas)"
        );
    }

    return resultado;
}

const MobiltyOutputContainer = () => {
    const { matrix, idMatrixModel, setMatrix, mobilityMatrixList } =
        useContext(MobilityMatrix);
    const { newModel } = useContext(NewModelSetted);
    const [data, setData] = useState([]);
    const [colsSum, setColsSum] = useState([]);
    const [rowsSum, setRowsSum] = useState([]);
    const [selectedDay, setSelectedDay] = useState(Object.keys(matrix)[0]);
    const dayList = Object.keys(matrix).sort();

    useEffect(() => {
        setSelectedDay(Object.keys(matrix)[0]);
    }, [matrix]);
    useEffect(() => {
        const mobility = [...mobilityMatrixList].find(
            (mobElem: MobilityMatrixListProps) =>
                mobElem.modelId === idMatrixModel
        );
        if (mobility?.matrix) {
            setMatrix(mobility.matrix);
        }
    }, [idMatrixModel, mobilityMatrixList, setMatrix]);
    useEffect(() => {
        if (
            Object.keys(matrix).length !== 0 &&
            matrix.constructor === Object &&
            matrix[selectedDay]
        ) {
            let tags;
            if (selectedDay === "artificial") {
                tags = matrix[selectedDay].tags;
            } else {
                tags = matrix[selectedDay].tags.map(
                    (cod: string) =>
                        countiesData.data.find(
                            (countie) => countie[5] === cod
                        )[4] ?? undefined
                );
            }
            setData([
                {
                    z: matrix[selectedDay].values,
                    x: tags,
                    y: tags,
                    type: "heatmap",
                    colorscale: "Viridis",
                },
            ]);
            setColsSum([
                {
                    y: sumarMatriz(matrix[selectedDay].values),
                    x: tags,
                    type: "bar",
                },
            ]);
            setRowsSum([
                {
                    y: sumarMatriz(matrix[selectedDay].values, 1),
                    x: tags,
                    type: "bar",
                },
            ]);
        }
    }, [matrix, selectedDay]);
    const handlePrevDay = () => {
        const currentIndex = dayList.indexOf(selectedDay);
        if (currentIndex > 0) {
            setSelectedDay(dayList[currentIndex - 1]);
        }
    };

    const handleNextDay = () => {
        const currentIndex = dayList.indexOf(selectedDay);
        if (currentIndex < dayList.length - 1) {
            setSelectedDay(dayList[currentIndex + 1]);
        }
    };
    return (
        <Flex
            direction="column"
            w="60%"
            m="0 2%"
            borderRadius="8px"
            boxShadow="sm"
            overflowY="auto"
            border="1px solid #DDDDDD"
            p="2%"
            h="75vh"
        >
            {data && data.length !== 0 ? (
                <>
                    <Center>
                        <Plot
                            layout={{
                                width: 640,
                                height: 520,
                                title: `Initial conectivity matrix ${
                                    selectedDay === "artificial"
                                        ? "Nodes"
                                        : formatDate(selectedDay)
                                }`,
                                xaxis: {
                                    ticks: "",
                                    side: "bottom",
                                },
                            }}
                            data={data}
                        />
                    </Center>
                    <Center mb="2%">
                        <HStack w="30%" justify="space-between">
                            <Text
                                onClick={handlePrevDay}
                                color={
                                    dayList.indexOf(selectedDay) === 0
                                        ? "#B9B9C9"
                                        : "#016FB9"
                                }
                                cursor={
                                    dayList.indexOf(selectedDay) === 0
                                        ? "not-allowed"
                                        : "pointer"
                                }
                                as="u"
                                // disabled={dayList.indexOf(selectedDay) === 0}
                            >
                                Previous
                            </Text>
                            <Text
                                cursor={
                                    dayList.indexOf(selectedDay) ===
                                    dayList.length - 1
                                        ? "not-allowed"
                                        : "pointer"
                                }
                                onClick={handleNextDay}
                                // disabled={
                                //     dayList.indexOf(selectedDay) ===
                                //     dayList.length - 1
                                // }
                                color={
                                    dayList.indexOf(selectedDay) ===
                                    dayList.length - 1
                                        ? "#B9B9C9"
                                        : "#016FB9"
                                }
                                as="u"
                            >
                                Next
                            </Text>
                        </HStack>
                    </Center>
                    <Box>
                        <Text>Departure/Arrival</Text>
                        <HStack border="1px" w="90%" justify="space-between">
                            <Plot
                                layout={{
                                    title: "Departure",
                                    width: 480,
                                    height: 360,
                                    xaxis: { autorange: true },
                                    yaxis: { autorange: true },
                                }}
                                data={rowsSum}
                                config={{
                                    responsive: true,
                                    modeBarButtonsToRemove: ["toImage"],
                                }}
                            />

                            <Plot
                                layout={{
                                    title: "Arrival",
                                    width: 480,
                                    height: 360,
                                    xaxis: { autorange: true },
                                    yaxis: { autorange: true },
                                }}
                                data={colsSum}
                            />
                        </HStack>
                    </Box>
                </>
            ) : (
                <Center>View of matrix </Center>
            )}
        </Flex>
    );
};

export default MobiltyOutputContainer;
