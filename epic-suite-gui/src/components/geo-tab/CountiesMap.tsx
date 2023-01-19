import { useContext, useReducer, useEffect } from "react";
import { GeoJSON, Tooltip, useMap } from "react-leaflet";
import * as topojson from "topojson-client";
import { GeometryObject, Topology } from "topojson-specification";

import us_ from "../../data/counties-10m.json";
import { SelectFeature } from "context/SelectFeaturesContext";
import { TabIndex } from "context/TabContext";

interface ActionTooltip {
    type: string;
    payload: string;
}

const CountiesMap = () => {
    const map = useMap();
    const { index: tabIndex } = useContext(TabIndex);
    const { counties: countiesSelected, setCounties: setCountiesSelected } =
        useContext(SelectFeature);

    const initialState: string | undefined = "";

    const reducer = (state: string, action: ActionTooltip) => {
        if (action.type === "set") {
            return action.payload;
        }
        return state;
    };
    const [tootipCounty, dispatch] = useReducer(reducer, initialState);

    const us = us_ as unknown as Topology;
    const data = topojson.feature(us, us.objects.counties as GeometryObject);

    useEffect(() => {
        if (tabIndex === 6) {
            map.invalidateSize(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabIndex]);

    const handleSelectFeature = (feature) => {
        let color;
        const isIncluded = [...countiesSelected].some(
            (c: string) => c === feature.id
        );
        if (isIncluded) {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const eventsMap = (feature, layer) => {
        layer.on("click", () => {
            setCountiesSelected({
                type: "handle-select",
                payload: [feature.id],
            });
        });
        layer.on("mouseover", () => {
            dispatch({ type: "set", payload: feature.properties.name });
        });
    };
    return (
        <GeoJSON
            data={data}
            onEachFeature={(feature, layer) => eventsMap(feature, layer)}
            style={(feature) => handleSelectFeature(feature)}
        >
            <Tooltip>{tootipCounty}</Tooltip>
        </GeoJSON>
    );
};

export default CountiesMap;
