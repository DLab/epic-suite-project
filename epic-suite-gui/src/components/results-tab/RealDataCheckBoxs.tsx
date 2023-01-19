import { Checkbox } from "@chakra-ui/react";
import React, { useEffect, useContext, useState } from "react";

import { GraphicsData } from "context/GraphicsContext";
import { KeysRealData } from "types/GraphicsTypes";

type Props = {
    simName: string;
    saveKeys: (val: boolean, val2: string, val3: string, val4: string) => void;
};

/**
 * Component to select parameters from the real data.
 * @subcategory Results
 * @component
 */
const RealDataCheckBoxs = ({ simName, saveKeys }: Props) => {
    const { realDataSimulationKeys } = useContext(GraphicsData);
    const [realData, setrealData] = useState<KeysRealData | null>();

    /**
     * Filter keys for real data based on simulation name.
     * @returns {KeysRealData[]}
     */
    const getRealData = () => {
        return realDataSimulationKeys?.find((sim) => {
            return sim.name === simName;
        });
    };

    useEffect(() => {
        const data = getRealData();
        setrealData(data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [realDataSimulationKeys]);

    return (
        <>
            {realData &&
                Object.keys(realData).map((key) => {
                    if (key !== "name" && key !== "Compartment") {
                        return (
                            <Checkbox
                                size="sm"
                                m="2% 5%"
                                value={`${key} Real`}
                                id={`${key + simName} Real`}
                                key={`${key + simName} Real`}
                                onChange={(e) => {
                                    saveKeys(
                                        e.target.checked,
                                        e.target.id,
                                        e.target.value,
                                        simName
                                    );
                                }}
                            >
                                {key}
                            </Checkbox>
                        );
                    }
                    return false;
                })}
        </>
    );
};

export default RealDataCheckBoxs;
