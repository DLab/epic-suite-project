import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Icon,
    Flex,
    StatGroup,
    Stat,
    StatLabel,
    StatNumber,
} from "@chakra-ui/react";
import { add, format } from "date-fns";
import React, { useEffect, useState, useContext } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

import ColorsScale from "../ColorsScale";
import CountiesMetaResultsMap from "../metapopulation-map/CountiesMetaResultsMap";
import StatesMetaResultsMap from "../metapopulation-map/StatesMetaResultsMap";
import PlayDataSlider from "../PlayDataSlider";
import PlayModal from "components/icons/PlayModal";
import { GraphicsData } from "context/GraphicsContext";
import { TabIndex } from "context/TabContext";
import { MapResultsData } from "types/GraphicsTypes";
import createIdComponent from "utils/createIdcomponent";

import BarGraphModal from "./BarGraphModal";
import GraphModal from "./GraphModal";

interface Props {
    mapInfo: MapResultsData;
    colorScale: string;
}

/**
 * Modal to visualize the metapopulation results in maps and graphs simultaneously.
 * @subcategory Results
 * @component
 */
const GraphAndMapMetaModal = ({ mapInfo, colorScale }: Props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [parameterModalMetaValue, setParameterModalMetaValue] = useState();
    // const [scrollBehavior, setScrollBehavior] = React.useState("inside");
    const [isPlayingMetaModal, setIsPlayingMetaModal] = useState(false);
    const [simDayMetaModal, setSimDayMetaModal] = useState(0);
    const [maxModalMetaValue, setMaxModalMetaValue] = useState();
    const [simModalMetaDate, setSimModalMetaDate] = useState("");
    const { aux } = useContext(TabIndex);
    const data = JSON.parse(aux);
    const { realDataSimulationKeys, globalParametersValues } =
        useContext(GraphicsData);
    const globalData = JSON.parse(globalParametersValues);
    const [graphMetaInfo, setGraphMetaInfo] = useState([]);
    const [globalParameterMetaValue, setGlobalParameterMetaValue] = useState();
    const [globalParameterRealMetaValue, setGlobalParameterRealMetaValue] =
        useState();
    const [dataDuration, setDataDuration] = useState<number | string>();

    /**
     * Returns a list with objects composed of the selected parameters and the name of the node.
     * @param {Array} graphData list of real or simulated metapopulation results.
     * @returns {Object}
     */
    const getLeftAxis = (graphData) => {
        return graphData.map((node) => {
            return { keys: [mapInfo.parameter], name: node.name };
        });
    };

    /**
     * Saves in the "parameterModalMetaValue" state the values of a parameter according to the simulation day.
     * Saves the highest value of the selected parameter in the "maxModalMetaValue" state.
     * @param {Array} simData list of real or simulated metapopulatiom data.
     * @param {string} typeData type of data to filter: real or simulated.
     */
    const filterModalMetaData = (simData, typeData) => {
        let getModalParameterValue;
        let getModalGeneralParameterValue;

        if (typeData === "Real") {
            let filterKey = mapInfo.parameter.slice(0, -5);
            if (filterKey === "population") {
                filterKey = "P";
            }
            // Filters the real data and returns the values according to the selected parameter.
            getModalParameterValue = simData.map((nodeData) => {
                return Object.values(nodeData[filterKey]);
            });
            const generalModalValue = simData.filter((nodeData) => {
                return nodeData.name === "global_results";
            });
            const getGeneralRealModalValue = generalModalValue[0][filterKey];
            setGlobalParameterRealMetaValue(
                getGeneralRealModalValue[simDayMetaModal]
            );
            setDataDuration(Object.keys(getGeneralRealModalValue).length);
        } else {
            let filterSimKey = mapInfo.parameter;
            if (filterSimKey === "population") {
                filterSimKey = "S";
            }
            // Filters the simulated data and returns the values according to the selected parameter.
            getModalParameterValue = simData.map((nodeData) => {
                return nodeData[filterSimKey];
            });
            getModalGeneralParameterValue = globalData[0][filterSimKey];

            if (getModalGeneralParameterValue !== undefined) {
                setGlobalParameterMetaValue(
                    getModalGeneralParameterValue[simDayMetaModal]
                );
            }
            setDataDuration(mapInfo.duration);
        }
        const maxValues = getModalParameterValue.map((valArray) => {
            return Math.max.apply(null, valArray);
        });
        const getMaxValue = Math.max.apply(null, maxValues);
        setMaxModalMetaValue(getMaxValue);
        if (getModalParameterValue !== undefined) {
            const parameterModalValuesList = getModalParameterValue.map(
                (val) => {
                    return val[simDayMetaModal];
                }
            );
            setParameterModalMetaValue(parameterModalValuesList);
        }
    };

    useEffect(() => {
        if (mapInfo.parameter.includes("Real")) {
            const getGraphMetaRealInfo = [
                {
                    graphicName: "",
                    graphicId: createIdComponent(),
                    leftAxis: getLeftAxis(realDataSimulationKeys),
                    rightAxis: [],
                },
            ];
            setGraphMetaInfo(getGraphMetaRealInfo);
            filterModalMetaData(realDataSimulationKeys, "Real");
        } else {
            const getGraphMetaInfo = [
                {
                    graphicName: "",
                    graphicId: createIdComponent(),
                    leftAxis: getLeftAxis(data),
                    rightAxis: [],
                },
            ];
            setGraphMetaInfo(getGraphMetaInfo);
            filterModalMetaData(data, "Sim");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [simDayMetaModal]);

    useEffect(() => {
        const durationValue = mapInfo.duration.toString();
        if (
            isPlayingMetaModal &&
            simDayMetaModal < parseInt(durationValue, 10) - 1
        ) {
            setTimeout(() => {
                const simDayModalAux = simDayMetaModal;
                setSimDayMetaModal(simDayModalAux + 1);
            }, 60);
        }
        if (simDayMetaModal === parseInt(durationValue, 10) - 1) {
            setIsPlayingMetaModal(false);
        }
    }, [simDayMetaModal, isPlayingMetaModal, mapInfo.duration]);

    useEffect(() => {
        setSimModalMetaDate(format(new Date(mapInfo.date), "dd/MM/yyyy"));
        const newDate = add(new Date(mapInfo.date), {
            days: simDayMetaModal,
        });
        setSimModalMetaDate(format(newDate, "dd/MM/yyyy"));
    }, [mapInfo.date, simDayMetaModal]);

    const btnRef = React.useRef(null);
    return (
        <>
            <Icon as={PlayModal} onClick={onOpen} cursor="pointer" mr="6px" />
            <Modal
                onClose={onClose}
                size="xl"
                // finalFocusRef={btnRef}
                isOpen={isOpen}
                scrollBehavior="outside"
            >
                <ModalOverlay />
                <ModalContent textAlign="center" maxW="70vw">
                    <ModalHeader>
                        {mapInfo.parameter} {mapInfo.nameSim}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex justify="center" direction="column">
                            <Flex direction="column">
                                <Flex>
                                    <MapContainer
                                        className="will-change"
                                        center={[38, -91]}
                                        zoom={3}
                                        style={{
                                            height: "42vh",
                                            maxHeight: "42vh",
                                            width: "60%",
                                            margin: "0 5%",
                                        }}
                                        scrollWheelZoom={false}
                                    >
                                        <ColorsScale
                                            maxValue={maxModalMetaValue}
                                            colorScale={colorScale}
                                        />
                                        <TileLayer
                                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        {mapInfo.scale === "States" ? (
                                            <StatesMetaResultsMap
                                                idGeo={mapInfo.idGeo}
                                                parameterValue={
                                                    parameterModalMetaValue
                                                }
                                                maxValue={maxModalMetaValue}
                                                statesData={
                                                    mapInfo.geoDataSelected
                                                }
                                                colorScale={colorScale}
                                            />
                                        ) : (
                                            <CountiesMetaResultsMap
                                                idGeo={mapInfo.idGeo}
                                                parameterValue={
                                                    parameterModalMetaValue
                                                }
                                                maxValue={maxModalMetaValue}
                                                countiesData={
                                                    mapInfo.geoDataSelected
                                                }
                                                colorScale={colorScale}
                                            />
                                        )}
                                    </MapContainer>
                                    <Flex w="50%" direction="column">
                                        <PlayDataSlider
                                            map={mapInfo}
                                            isPlaying={isPlayingMetaModal}
                                            setIsPlaying={setIsPlayingMetaModal}
                                            simDay={simDayMetaModal}
                                            setSimDay={setSimDayMetaModal}
                                            population="metapopulation"
                                        />
                                        <StatGroup w="95%" mt="10%">
                                            <Stat>
                                                <StatLabel>Day</StatLabel>
                                                <StatNumber>
                                                    {simDayMetaModal + 1}
                                                </StatNumber>
                                            </Stat>

                                            <Stat>
                                                <StatLabel>Date</StatLabel>
                                                <StatNumber>
                                                    {simModalMetaDate}
                                                </StatNumber>
                                            </Stat>
                                            <Stat>
                                                <StatLabel>
                                                    {mapInfo.parameter} Global
                                                    Value
                                                </StatLabel>
                                                {mapInfo.parameter.includes(
                                                    "Real"
                                                ) ? (
                                                    <StatNumber>
                                                        {new Intl.NumberFormat(
                                                            "de-DE"
                                                        ).format(
                                                            globalParameterRealMetaValue
                                                        )}
                                                    </StatNumber>
                                                ) : (
                                                    <StatNumber>
                                                        {new Intl.NumberFormat(
                                                            "de-DE"
                                                        ).format(
                                                            globalParameterMetaValue
                                                        )}
                                                    </StatNumber>
                                                )}
                                            </Stat>
                                        </StatGroup>
                                    </Flex>
                                </Flex>
                                <Flex justifyContent="space-evenly" mt="2%">
                                    <GraphModal
                                        savedSimulationKeys={graphMetaInfo}
                                        simDay={simDayMetaModal}
                                        maxValue={maxModalMetaValue}
                                        duration={dataDuration}
                                        isMono={false}
                                    />
                                    <BarGraphModal
                                        savedSimulationKeys={graphMetaInfo}
                                        simDay={simDayMetaModal}
                                        maxValue={maxModalMetaValue}
                                        colorScale={colorScale}
                                        isMono={false}
                                    />
                                </Flex>
                            </Flex>
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default GraphAndMapMetaModal;
