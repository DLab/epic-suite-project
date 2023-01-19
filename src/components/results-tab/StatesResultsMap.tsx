import { useContext, useReducer, useEffect, useState } from "react";
import { GeoJSON, Tooltip, useMap } from "react-leaflet";
import * as topojson from "topojson-client";
import { GeometryObject, Topology } from "topojson-specification";

import { SelectFeature } from "context/SelectFeaturesContext";
import { TabIndex } from "context/TabContext";
import "leaflet/dist/leaflet.css";

import getColor from "./getColor";

interface ActionTooltip {
    type: string;
    payload: string;
}

interface Props {
    idGeo: number | string;
    parameterValue: number;
    maxValue: number;
    statesData: GeometryObject | unknown;
    colorScale: string;
}

const StatesResultsMap = ({
    idGeo,
    parameterValue,
    maxValue,
    statesData: statesResultsData,
    colorScale,
}: Props) => {
    const { geoSelections } = useContext(SelectFeature);
    const stateResultsData = statesResultsData as unknown as Topology;
    const ResultsData = topojson.feature(
        stateResultsData,
        stateResultsData.objects.states as GeometryObject
    );
    const map = useMap();
    const { index: tabIndex } = useContext(TabIndex);

    const [statesSelected, setStatesSelected] = useState([]);

    const initialState: string | undefined = "";

    const reducer = (state: string, action: ActionTooltip) => {
        if (action.type === "set") {
            return action.payload;
        }
        return state;
    };
    const [tootipCounty, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        if (idGeo === 0) {
            setStatesSelected([]);
        } else {
            const geoSelection = geoSelections.find(
                (element) => element.id === idGeo
            );
            setStatesSelected(geoSelection?.featureSelected);
        }
    }, [geoSelections, idGeo, parameterValue, statesResultsData]);

    useEffect(() => {
        if (tabIndex === 4) {
            map.invalidateSize(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabIndex, parameterValue]);

    const onEachFeature = (feature, layer) => {
        layer.on("mouseover", () => {
            dispatch({ type: "set", payload: feature.properties.name });
        });
    };

    const styles = (feature) => {
        let color;
        const stateId = feature.id;

        if (statesSelected?.includes(stateId)) {
            color = getColor(parameterValue, maxValue, colorScale);
        } else {
            color = "#1777c7";
        }
        return {
            fillColor: color,
            fillOpacity: 0.8,
            weight: 0.5,
            color: "#404040",
            opacity: 0.5,
        };
    };

    return (
        <GeoJSON
            data={ResultsData}
            onEachFeature={onEachFeature}
            style={styles}
        >
            <Tooltip>{tootipCounty}</Tooltip>
        </GeoJSON>
    );
};

export default StatesResultsMap;
