import { Flex } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

import { SelectFeature } from "context/SelectFeaturesContext";

import CountiesModelsMap from "./CountiesModelsMap";
import StatesModelsMap from "./StatesModelsMap";

interface Props {
    idGeo: number;
}

const ModelsMap = ({ idGeo }: Props) => {
    const [modelScale, setModelScale] = useState(undefined);
    const { geoSelections } = useContext(SelectFeature);

    useEffect(() => {
        setModelScale("States");
        const geoSelection = geoSelections.find(
            (element) => element.id === idGeo
        );
        if (geoSelection !== undefined) {
            setModelScale(geoSelection.scale);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idGeo]);

    return (
        <Flex
            bg="#dddddd"
            borderRadius="6px"
            justify="center"
            align="center"
            borderWidth="1px"
            mb="2%"
            boxShadow="sm"
        >
            <Flex w="100%" justify="center" h="45vh">
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
                    <TileLayer
                        attribution="Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community"
                        // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
                    />
                    {modelScale === "States" && (
                        <StatesModelsMap idGeo={idGeo} />
                    )}
                    {modelScale === "Counties" && (
                        <CountiesModelsMap idGeo={idGeo} />
                    )}
                </MapContainer>
            </Flex>
        </Flex>
    );
};

export default ModelsMap;
