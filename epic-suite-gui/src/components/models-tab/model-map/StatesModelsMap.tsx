import { useContext, useReducer, useEffect, useState } from "react";
import { GeoJSON, Tooltip, useMap } from "react-leaflet";
import * as topojson from "topojson-client";
import { GeometryObject, Topology } from "topojson-specification";

import stateData_ from "../../../data/states-10m.json";
import { SelectFeature } from "context/SelectFeaturesContext";
import { TabIndex } from "context/TabContext";
import "leaflet/dist/leaflet.css";

interface ActionTooltip {
    type: string;
    payload: string;
}

interface Props {
    idGeo: number;
}

const StatesModelsMap = ({ idGeo }: Props) => {
    const { geoSelections } = useContext(SelectFeature);
    const stateData = stateData_ as unknown as Topology;
    const data = topojson.feature(
        stateData,
        stateData.objects.states as GeometryObject
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idGeo]);

    useEffect(() => {
        if (tabIndex === 0) {
            map.invalidateSize(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabIndex]);

    const onEachFeature = (feature, layer) => {
        layer.on("mouseover", () => {
            dispatch({ type: "set", payload: feature.properties.name });
        });
    };

    const modelsMapStyles = (feature) => {
        let color;
        const stateId = feature.id;

        if (statesSelected?.includes(stateId)) {
            color = "#016FB9";
        } else {
            color = "#ADDEFF";
        }
        return {
            fillColor: color,
            fillOpacity: 1,
            weight: 0.5,
            color: "white",
            opacity: 1,
        };
    };

    return (
        <GeoJSON
            data={data}
            onEachFeature={onEachFeature}
            style={modelsMapStyles}
        >
            <Tooltip>{tootipCounty}</Tooltip>
        </GeoJSON>
    );
};

export default StatesModelsMap;
