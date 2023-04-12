import { useContext, useReducer, useState, useEffect } from "react";
import { GeoJSON, Tooltip, useMap } from "react-leaflet";
import * as topojson from "topojson-client";
import type { GeometryObject, Topology } from "topojson-specification";

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
    coutiesData: GeometryObject | unknown;
    colorScale: string;
}

const CountiesResultsMap = ({
    idGeo,
    parameterValue,
    maxValue,
    coutiesData,
    colorScale,
}: Props) => {
    const { geoSelections } = useContext(SelectFeature);
    const map = useMap();
    const { index: tabIndex } = useContext(TabIndex);
    const [countiesSelected, setCountiesSelected] = useState([]);
    const us = coutiesData as unknown as Topology;
    const data = topojson.feature(us, us.objects.counties as GeometryObject);

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
            setCountiesSelected([]);
        } else {
            const geoSelection = geoSelections.find(
                (element) => element.id === idGeo
            );

            setCountiesSelected(geoSelection.featureSelected);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idGeo, coutiesData]);

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

        if (countiesSelected?.includes(stateId)) {
            color = getColor(parameterValue, maxValue, colorScale);
        } else {
            color = "#1777c7";
        }
        return {
            fillColor: color,
            fillOpacity: 0.7,
            weight: 0.7,
            color: "#404040",
            opacity: 1,
        };
    };

    return (
        <GeoJSON data={data} onEachFeature={onEachFeature} style={styles}>
            <Tooltip>{tootipCounty}</Tooltip>
        </GeoJSON>
    );
};

export default CountiesResultsMap;
