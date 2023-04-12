import { useEffect, useContext } from "react";
import { GeoJSON, useMap } from "react-leaflet";
import * as topojson from "topojson-client";
import type { GeometryObject, Topology } from "topojson-specification";

import stateData_ from "../../data/states-10m.json";
import { TabIndex } from "context/TabContext";

const NationMap = () => {
    const map = useMap();
    const { index: tabIndex } = useContext(TabIndex);
    const stateData = stateData_ as unknown as Topology;
    const data = topojson.feature(
        stateData,
        stateData.objects.states as GeometryObject
    );

    useEffect(() => {
        if (tabIndex === 6) {
            map.invalidateSize(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabIndex]);

    const styles = () => {
        return {
            fillColor: "#ADDEFF",
            fillOpacity: 1,
            weight: 0.7,
            color: "white",
            opacity: 1,
        };
    };

    return <GeoJSON data={data} style={styles} />;
};

export default NationMap;
