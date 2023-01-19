import { DeleteIcon } from "@chakra-ui/icons";
import {
    Flex,
    Spinner,
    Text,
    Stat,
    StatLabel,
    StatNumber,
    StatGroup,
} from "@chakra-ui/react";
import { format, add } from "date-fns";
import dynamic from "next/dynamic";
import React, { useContext, useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

import { GraphicsData } from "context/GraphicsContext";
import { TabIndex } from "context/TabContext";
import { MapResultsData } from "types/GraphicsTypes";

import ColorScaleMenu from "./ColorScaleMenu";
import ColorsScale from "./ColorsScale";
import CountiesResultsMap from "./CountiesResultsMap";
import GraphAndMapMonoModal from "./graphic-map-modal/GraphAndMapMonoModal";
import PlayDataSlider from "./PlayDataSlider";

interface Props {
    map: MapResultsData;
    sizeGraphic: number[];
}

const StatesResultsMap = dynamic(() => import("./StatesResultsMap"), {
    loading: () => (
        <Flex justifyContent="center" alignItems="center" w="100%">
            <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
            />
        </Flex>
    ),
    ssr: false,
});

/**
 * Result container of a simulation displayed as a map.
 * @subcategory Results
 * @component
 */
const MapResults = ({ map, sizeGraphic }: Props) => {
    const [simDay, setSimDay] = useState(0);
    const [simDate, setSimDate] = useState("");
    const [parameterValue, setParameterValue] = useState();
    const [maxValue, setMaxValue] = useState();
    const [isPlaying, setIsPlaying] = useState(false);
    const [colorScale, setColorScale] = useState("GnBu");

    // const [isGeoDataLoaded, setGeoDataLoaded] = useState(false);
    const { aux } = useContext(TabIndex);
    const data = JSON.parse(aux);
    const {
        realDataSimulationKeys,
        dataToShowInMap,
        setDataToShowInMap,
        setAllResults,
        allGraphicData,
    } = useContext(GraphicsData);

    useEffect(() => {
        setSimDay(0);
    }, [map]);

    /**
     *  Saves in the "parameterValue" state the values of a parameter according to the simulation day.
     * @param  {Array} simData list of real or simulated monopopulation data.
     * @param {string}  typeData type of data to filter: real or simulated.
     */
    const filterData = (simData, typeData) => {
        const simRealDataKeyFilter = simData.filter((sim) => {
            return sim.name === map.nameSim;
        });

        let getParameterValue;

        if (typeData === "Real") {
            let filterKey = map.parameter.slice(0, -5);
            if (filterKey === "population") {
                filterKey = "P";
            }
            getParameterValue = simRealDataKeyFilter[0][filterKey];
        } else {
            let filterSimKey = map.parameter;
            if (filterSimKey === "population") {
                filterSimKey = "S";
            }
            getParameterValue = simRealDataKeyFilter[0][filterSimKey];
        }
        const parametersValuesArray = Object.values(getParameterValue);
        const getMaxValue = Math.max.apply(null, parametersValuesArray);
        setMaxValue(getMaxValue);

        if (getParameterValue !== undefined) {
            setParameterValue(getParameterValue[simDay]);
        }
    };

    useEffect(() => {
        if (map.parameter.includes("Real")) {
            filterData(realDataSimulationKeys, "Real");
        } else {
            filterData(data, "Sim");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, map.nameSim, map.parameter, simDay]);

    useEffect(() => {
        const durationValue = map.duration.toString();
        if (isPlaying && simDay < parseInt(durationValue, 10) - 1) {
            setTimeout(() => {
                const simDayAux = simDay;
                setSimDay(simDayAux + 1);
            }, 100);
        }
        if (simDay === parseInt(durationValue, 10) - 1) {
            setIsPlaying(false);
        }
    }, [simDay, isPlaying, map.duration]);

    useEffect(() => {
        setSimDate(format(new Date(map.date), "dd/MM/yyyy"));
        const newDate = add(new Date(map.date), {
            days: simDay,
        });
        setSimDate(format(newDate, "dd/MM/yyyy"));
    }, [map.date, simDay]);

    return (
        <Flex direction="column" w="48%" mb="2rem">
            <Flex justify="end" alignSelf="end" mr="0.2rem" w="10%" mt="2%">
                <Flex h="1.5rem">
                    <GraphAndMapMonoModal
                        mapInfo={map}
                        colorScale={colorScale}
                    />
                    <ColorScaleMenu setColorScale={setColorScale} />
                    <DeleteIcon
                        color="#16609E"
                        cursor="pointer"
                        onClick={() => {
                            const dataToShowInMapFilter =
                                dataToShowInMap.filter((mapData) => {
                                    return mapData.idMap !== map.idMap;
                                });
                            setDataToShowInMap(dataToShowInMapFilter);

                            Promise.resolve(setAllResults([])).then(() => {
                                setAllResults(
                                    [].concat(
                                        dataToShowInMapFilter,
                                        allGraphicData
                                    )
                                );
                            });
                        }}
                    >
                        Delete
                    </DeleteIcon>
                </Flex>
            </Flex>
            <Flex
                direction="column"
                justify="center"
                bg="#FFFFFF"
                borderRadius="10px"
                alignItems="center"
                w="100%"
                h="70vh"
            >
                <Flex justify="center" direction="column" w="90%">
                    <Text ml="2%">
                        {map.parameter} {map.nameSim}
                    </Text>
                    <MapContainer
                        className="will-change"
                        center={[38, -96]}
                        zoom={3.48}
                        style={{
                            height: "45vh",
                            maxHeight: "45vh",
                            width: "100%",
                        }}
                        scrollWheelZoom={false}
                    >
                        <ColorsScale
                            maxValue={maxValue}
                            colorScale={colorScale}
                        />
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {map.scale === "States" ? (
                            <StatesResultsMap
                                idGeo={map.idGeo}
                                parameterValue={parameterValue}
                                maxValue={maxValue}
                                statesData={map.geoDataSelected}
                                colorScale={colorScale}
                            />
                        ) : (
                            <CountiesResultsMap
                                idGeo={map.idGeo}
                                parameterValue={parameterValue}
                                maxValue={maxValue}
                                coutiesData={map.geoDataSelected}
                                colorScale={colorScale}
                            />
                        )}
                    </MapContainer>
                </Flex>
                <StatGroup w="90%" mt="1%">
                    <Stat>
                        <StatLabel>Day</StatLabel>
                        <StatNumber>{simDay + 1}</StatNumber>
                    </Stat>

                    <Stat>
                        <StatLabel>Date</StatLabel>
                        <StatNumber>{simDate}</StatNumber>
                    </Stat>
                    <Stat>
                        <StatLabel>Value</StatLabel>
                        {parameterValue !== undefined ? (
                            <StatNumber>
                                {new Intl.NumberFormat("de-DE").format(
                                    parameterValue
                                )}
                            </StatNumber>
                        ) : (
                            <Text fontSize="14px" fontWeight="600">
                                There are no values for this date
                            </Text>
                        )}
                    </Stat>
                </StatGroup>
                <PlayDataSlider
                    map={map}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    simDay={simDay}
                    setSimDay={setSimDay}
                />
            </Flex>
        </Flex>
    );
};

export default MapResults;
