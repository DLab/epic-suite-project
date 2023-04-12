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
import CountiesResultsMap from "../CountiesResultsMap";
import PlayDataSlider from "../PlayDataSlider";
import StatesResultsMap from "../StatesResultsMap";
import PlayModal from "components/icons/PlayModal";
import { GraphicsData } from "context/GraphicsContext";
import { TabIndex } from "context/TabContext";
import type { MapResultsData } from "types/GraphicsTypes";
import createIdComponent from "utils/createIdcomponent";

import BarGraphModal from "./BarGraphModal";
import GraphModal from "./GraphModal";

interface Props {
    mapInfo: MapResultsData;
    colorScale: string;
}

/**
 * Modal to visualize the monopopulation results in maps and graphs simultaneously.
 * @subcategory Results
 * @component
 */
const GraphAndMapMonoModal = ({ mapInfo, colorScale }: Props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [parameterModalValue, setParameterModalValue] = useState();
    // const [scrollBehavior, setScrollBehavior] = React.useState("inside");
    const [isPlayingModal, setIsPlayingModal] = useState(false);
    const [simDayModal, setSimDayModal] = useState(0);
    const [maxModalValue, setMaxModalValue] = useState();
    const [simModalDate, setSimModalDate] = useState("");
    const [dataMonoDuration, setDataMonoDuration] = useState<number | string>();
    const { aux } = useContext(TabIndex);
    const data = JSON.parse(aux);
    const { realDataSimulationKeys } = useContext(GraphicsData);

    const graphInfo = {
        graphicName: mapInfo.parameter,
        graphicId: createIdComponent(),
        leftAxis: [
            {
                keys: [mapInfo.parameter],
                name: mapInfo.nameSim,
            },
        ],
        rightAxis: [],
    };

    /**
     * Saves in the "parameterModalValue" state the values of a parameter according to the simulation day.
     * Saves the highest value of the selected parameter in the "maxModalValue" state.
     * @param {Array} simData list of real or simulated monopopulation data.
     * @param {string} typeData type of data to filter: real or simulated.
     */
    const filterData = (simData, typeData) => {
        const simRealDataKeyFilter = simData.filter((sim) => {
            return sim.name === mapInfo.nameSim;
        });

        let getParameterValue;

        if (typeData === "Real") {
            let filterKey = mapInfo.parameter.slice(0, -5);
            if (filterKey === "population") {
                filterKey = "P";
            }
            getParameterValue = simRealDataKeyFilter[0][filterKey];
            setDataMonoDuration(Object.keys(getParameterValue).length);
        } else {
            let filterSimKey = mapInfo.parameter;
            if (filterSimKey === "population") {
                filterSimKey = "S";
            }
            getParameterValue = simRealDataKeyFilter[0][filterSimKey];
            setDataMonoDuration(mapInfo.duration);
        }
        const parametersValuesArray = Object.values(getParameterValue);
        const getMaxModalValue = Math.max.apply(null, parametersValuesArray);
        setMaxModalValue(getMaxModalValue);
        if (getParameterValue !== undefined) {
            setParameterModalValue(getParameterValue[simDayModal]);
        }
    };

    useEffect(() => {
        if (mapInfo.parameter.includes("Real")) {
            filterData(realDataSimulationKeys, "Real");
        } else {
            filterData(data, "Sim");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, mapInfo.nameSim, mapInfo.parameter, simDayModal]);

    useEffect(() => {
        const durationValue = mapInfo.duration.toString();
        if (isPlayingModal && simDayModal < parseInt(durationValue, 10) - 1) {
            setTimeout(() => {
                const simDayModalAux = simDayModal;
                setSimDayModal(simDayModalAux + 1);
            }, 60);
        }
        if (simDayModal === parseInt(durationValue, 10) - 1) {
            setIsPlayingModal(false);
        }
    }, [simDayModal, isPlayingModal, mapInfo.duration]);

    useEffect(() => {
        setSimModalDate(format(new Date(mapInfo.date), "dd/MM/yyyy"));
        const newDate = add(new Date(mapInfo.date), {
            days: simDayModal,
        });
        setSimModalDate(format(newDate, "dd/MM/yyyy"));
    }, [mapInfo.date, simDayModal]);

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
                                            maxValue={maxModalValue}
                                            colorScale={colorScale}
                                        />
                                        <TileLayer
                                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        {mapInfo.scale === "States" ? (
                                            <StatesResultsMap
                                                idGeo={mapInfo.idGeo}
                                                parameterValue={
                                                    parameterModalValue
                                                }
                                                maxValue={maxModalValue}
                                                statesData={
                                                    mapInfo.geoDataSelected
                                                }
                                                colorScale={colorScale}
                                            />
                                        ) : (
                                            <CountiesResultsMap
                                                idGeo={mapInfo.idGeo}
                                                parameterValue={
                                                    parameterModalValue
                                                }
                                                maxValue={maxModalValue}
                                                coutiesData={
                                                    mapInfo.geoDataSelected
                                                }
                                                colorScale={colorScale}
                                            />
                                        )}
                                    </MapContainer>
                                    <Flex w="50%" direction="column">
                                        <PlayDataSlider
                                            map={mapInfo}
                                            isPlaying={isPlayingModal}
                                            setIsPlaying={setIsPlayingModal}
                                            simDay={simDayModal}
                                            setSimDay={setSimDayModal}
                                        />
                                        <StatGroup w="95%" mt="10%">
                                            <Stat>
                                                <StatLabel>Day</StatLabel>
                                                <StatNumber>
                                                    {simDayModal + 1}
                                                </StatNumber>
                                            </Stat>

                                            <Stat>
                                                <StatLabel>Date</StatLabel>
                                                <StatNumber>
                                                    {simModalDate}
                                                </StatNumber>
                                            </Stat>
                                            <Stat>
                                                <StatLabel>
                                                    {mapInfo.parameter} Value
                                                </StatLabel>
                                                <StatNumber>
                                                    {new Intl.NumberFormat(
                                                        "de-DE"
                                                    ).format(
                                                        parameterModalValue
                                                    )}
                                                </StatNumber>
                                            </Stat>
                                        </StatGroup>
                                    </Flex>
                                </Flex>
                                <Flex justifyContent="space-evenly" mt="2%">
                                    <GraphModal
                                        savedSimulationKeys={[graphInfo]}
                                        simDay={simDayModal}
                                        maxValue={maxModalValue}
                                        duration={dataMonoDuration}
                                        isMono
                                    />
                                    <BarGraphModal
                                        savedSimulationKeys={[graphInfo]}
                                        simDay={simDayModal}
                                        maxValue={maxModalValue}
                                        colorScale={colorScale}
                                        isMono
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

export default GraphAndMapMonoModal;
