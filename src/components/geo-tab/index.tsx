import { Flex, Button, Icon } from "@chakra-ui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import React, { useState, useContext, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import BreadCrumb from "../BreadCrumb";
import { SelectFeature } from "context/SelectFeaturesContext";
import { Model } from "types/ControlPanelTypes";

import CountiesMap from "./CountiesMap";
import GeoSavedSelections from "./GeoSavedSelections";
import NameAndButtons from "./NameAndButtons";
import NationMap from "./NationMap";
import SetUpSelection from "./SetUpSelection";
import StatesMap from "./StatesMap";

const GeoTab = () => {
    const [secondLink, setSecondLink] = useState(undefined);
    const [extentionOption, setExtentionOption] = useState("States");
    const [geoSelectionName, setGeoSelectionName] = useState("");
    const {
        setMode,
        mode,
        setCounties,
        setStates,
        geoSelections,
        idGeoSelectionUpdate,
    } = useContext(SelectFeature);

    useEffect(() => {
        if (mode === Model.Initial) {
            setStates({ type: "reset" });
            setCounties({ type: "reset" });
            setGeoSelectionName("");
            setExtentionOption("States");
        }
        if (mode === Model.Update) {
            const { name } = geoSelections.find(
                (selection) =>
                    selection.id.toString() === idGeoSelectionUpdate.toString()
            );
            setGeoSelectionName(name);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

    return (
        <Flex direction="column">
            <BreadCrumb
                firstLink="Geographic Selection"
                secondLink={secondLink}
                setSecondLink={setSecondLink}
            />
            {mode === "Initial" ? (
                <Flex w="40%" mt="15px">
                    <GeoSavedSelections />
                    <Button
                        size="sm"
                        fontSize="10px"
                        bg="#016FB9"
                        color="#FFFFFF"
                        onClick={() => {
                            setSecondLink("New");
                            setMode(Model.Add);
                        }}
                    >
                        <Icon w="14px" h="14px" as={PlusIcon} mr="5px" />
                        ADD NEW
                    </Button>
                </Flex>
            ) : (
                <Flex direction="column">
                    <NameAndButtons
                        extentionOption={extentionOption}
                        setExtentionOption={setExtentionOption}
                        geoSelectionName={geoSelectionName}
                        setGeoSelectionName={setGeoSelectionName}
                    />
                    <Flex mt="1%" h="80%">
                        <SetUpSelection
                            extentionOption={extentionOption}
                            setExtentionOption={setExtentionOption}
                        />
                        <Flex direction="column" w="70%" align="center">
                            <Flex w="90%" justify="center" h="80vh">
                                <MapContainer
                                    className="will-change"
                                    center={[38, -96]}
                                    zoom={4}
                                    style={{
                                        height: "75vh",
                                        maxHeight: "75vh",
                                        width: "95%",
                                    }}
                                    scrollWheelZoom={false}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    {extentionOption === "States" && (
                                        <StatesMap />
                                    )}
                                    {extentionOption === "National" && (
                                        <NationMap />
                                    )}
                                    {extentionOption === "Counties" && (
                                        <CountiesMap />
                                    )}
                                </MapContainer>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            )}
        </Flex>
    );
};

export default GeoTab;
