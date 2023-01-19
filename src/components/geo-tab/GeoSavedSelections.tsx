import { Select } from "@chakra-ui/react";
import React, { useContext } from "react";

import { SelectFeature } from "context/SelectFeaturesContext";
import { Model } from "types/ControlPanelTypes";

const GeoSavedSelections = () => {
    const {
        geoSelections,
        setMode,
        setIdGeoSelectionUpdate,
        setStates,
        setCounties,
        setScale,
    } = useContext(SelectFeature);

    const updateGeoSelection = (id) => {
        const { scale, featureSelected } = geoSelections.find(
            (selection) => selection.id.toString() === id
        );
        setIdGeoSelectionUpdate(id);
        setScale(scale);
        if (scale === "Counties") {
            setCounties({ type: "update", updateData: featureSelected });
        } else {
            setStates({ type: "update", updateData: featureSelected });
        }
    };
    return (
        <Select
            w="50%"
            size="sm"
            mr="15px"
            placeholder="Select Geographic"
            onChange={(e) => {
                setMode(Model.Update);
                updateGeoSelection(e.target.value);
            }}
        >
            {geoSelections.map((selection) => {
                return (
                    <option key={selection.id} value={selection.id}>
                        {selection.name}
                    </option>
                );
            })}
        </Select>
    );
};

export default GeoSavedSelections;
