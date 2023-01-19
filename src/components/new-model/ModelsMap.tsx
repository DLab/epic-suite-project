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
            bg="#c8cdcd"
            borderRadius="6px"
            justify="center"
            align="center"
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
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
