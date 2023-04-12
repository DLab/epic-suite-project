import { DeleteIcon } from "@chakra-ui/icons";
import { Flex, GridItem, Text } from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";

import { GraphicsData } from "context/GraphicsContext";
import { NewModelSetted } from "context/NewModelsContext";
import type { NewModelsAllParams } from "types/SimulationTypes";
import createIdComponent from "utils/createIdcomponent";

import DoubleYAxis from "./DoubleYAxis";
import Exports from "./Exports";
import Graphic from "./Graphic";
import MapResults from "./MapResults";
import MetaMapResults from "./metapopulation-map/MetaMapResults";
import MetapopulationSelectTable from "./metapopulation-selection/MetapopulationSelectTable";
import SeeGraphic from "./SeeGraphic";

interface Props {
    onOpen: (val: boolean) => void;
    simulationsPopulationType: string;
}

/**
 * Map and chart container.
 * @subcategory Results
 * @component
 */
const GraphicAndMapResults = ({ onOpen, simulationsPopulationType }: Props) => {
    const {
        setAllGraphicData,
        dataToShowInMap,
        allGraphicData,
        setAllResults,
        allResults,
    } = useContext(GraphicsData);
    const containerGraphElement = useRef(null);
    const { completeModel } = useContext(NewModelSetted);
    const [sizeGraphic, setSizeGraphic] = useState([0, 0]);
    let index = -1;

    useEffect(() => {
        if (containerGraphElement) {
            setSizeGraphic([
                containerGraphElement?.current?.clientWidth,
                containerGraphElement?.current?.clientHeight,
            ]);
        }
    }, [containerGraphElement, allResults]);

    const listResults = allResults.map((result) => {
        if (Array.isArray(result)) {
            index += 1;
            return (
                <Flex
                    w="48%"
                    direction="column"
                    mb="2rem"
                    key={`${result[0].graphicId}`}
                >
                    <Flex
                        alignSelf="end"
                        justify="end"
                        w="10%"
                        mt="2%"
                        mr="0.2rem"
                        id={createIdComponent()}
                    >
                        <Flex h="1.5rem">
                            <DoubleYAxis savedKeys={result} index={index} />
                            <SeeGraphic savedKeys={result} index={index} />
                            <DeleteIcon
                                id={createIdComponent()}
                                color="#016FB9"
                                ml="2%"
                                cursor="pointer"
                                onClick={() => {
                                    const aux = allGraphicData.filter(
                                        (x, i) => {
                                            return (
                                                x[0].graphicId !==
                                                result[0].graphicId
                                            );
                                        }
                                    );
                                    setAllGraphicData(aux);
                                    setAllResults(
                                        [].concat(dataToShowInMap, aux)
                                    );
                                }}
                            >
                                Delete
                            </DeleteIcon>
                        </Flex>
                    </Flex>
                    <Flex
                        direction="column"
                        bg="#FFFFFF"
                        borderRadius="10px"
                        alignItems="center"
                        justify="center"
                        w="100%"
                        h="70vh"
                        maxH="70vh"
                        ref={containerGraphElement}
                    >
                        <Graphic
                            savedSimulationKeys={result}
                            index={index}
                            width={`${sizeGraphic[0] ?? 0}`}
                            height={`${sizeGraphic[1] ?? 0}`}
                            disabledName={false}
                        />
                    </Flex>
                </Flex>
            );
        }
        if (result.nameSim !== undefined) {
            const populationSim = completeModel.filter(
                (model: NewModelsAllParams) => {
                    return model.idNewModel === parseInt(result.idSim, 10);
                }
            )[0];
            if (populationSim.populationType === "monopopulation") {
                return <MapResults map={result} sizeGraphic={sizeGraphic} />;
            }
            return <MetaMapResults map={result} sizeGraphic={sizeGraphic} />;
        }
        return false;
    });

    return (
        <GridItem colSpan={5} id={createIdComponent()} textAlign="center">
            {(simulationsPopulationType === "meta" ||
                simulationsPopulationType === "mono-meta") && (
                <Flex
                    // colSpan={1}
                    id={createIdComponent()}
                    flexWrap="wrap"
                    h="100%"
                    maxH="80vh"
                    overflowY="auto"
                    justify="space-between"
                >
                    <GridItem
                        colSpan={5}
                        w="50%"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <MetapopulationSelectTable />
                    </GridItem>

                    {allResults.length > 0 && listResults}
                </Flex>
            )}
            {simulationsPopulationType === "mono" && allResults.length > 0 && (
                <Flex
                    // colSpan={1}
                    id={createIdComponent()}
                    flexWrap="wrap"
                    h="100%"
                    maxH="80vh"
                    overflowY="auto"
                    justify="space-between"
                >
                    {listResults}
                </Flex>
            )}

            {allResults.length === 0 &&
                (simulationsPopulationType === "mono" ||
                    simulationsPopulationType === "mono-meta") && (
                    <Flex
                        id={createIdComponent()}
                        // colSpan={1}
                        justify="center"
                        flexDirection="column"
                        h="100%"
                    >
                        {" "}
                        <Text color="gray.600" fontSize="xl">
                            Add Results clicking plus button or
                        </Text>
                        <Text
                            color="#016FB9"
                            textDecoration="underline"
                            cursor="pointer"
                            fontSize="lg"
                            onClick={() => {
                                onOpen(true);
                            }}
                        >
                            Here
                        </Text>
                    </Flex>
                )}
            {/* <Exports data={responseSim} /> */}
        </GridItem>
    );
};

export default GraphicAndMapResults;
