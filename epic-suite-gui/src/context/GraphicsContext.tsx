import React, { createContext, useState } from "react";

import {
    SavedSimulationData,
    GraphicsProps,
    KeysRealData,
    DoubleYAxisData,
} from "types/GraphicsTypes";

export const GraphicsData = createContext<GraphicsProps>({
    simulationKeys: [],
    setSimulationKeys: () => {},
    realDataSimulationKeys: [],
    setRealDataSimulationKeys: () => {},
    savedSimulationKeys: [],
    setSavedSimulationKeys: () => {},
    savedSimulation: [],
    setSavedSimulation: () => {},
    allGraphicData: [],
    setAllGraphicData: () => {},
    checkedItems: {},
    setCheckedItems: () => {},
    dataToShowInMap: [],
    setDataToShowInMap: () => {},
    allResults: [],
    setAllResults: () => {},
    globalParametersValues: "",
    setGlobalParametersValues: () => {},
});

const GraphicsContext: React.FC = ({ children }) => {
    // para ver mostar las keys de los parametros en los checkbox
    const [simulationKeys, setSimulationKeys] = useState([]);
    // para ver mostar las keys de la data real en los checkbox
    const [realDataSimulationKeys, setRealDataSimulationKeys] = useState<
        KeysRealData[] | null
    >([]);
    // para ver las keys que se repiten segun key+nombre de la simulación
    const [savedSimulationKeys, setSavedSimulationKeys] = useState<string[]>(
        []
    );
    const [savedSimulation, setSavedSimulation] = useState<
        SavedSimulationData[]
    >([]);
    // va juntando todas las simulaciones para poder ver más de un gráfico
    const [allGraphicData, setAllGraphicData] = useState<DoubleYAxisData[][]>(
        []
    );
    const [checkedItems, setCheckedItems] = useState({});
    const [dataToShowInMap, setDataToShowInMap] = useState([]);
    const [allResults, setAllResults] = useState([]);
    const [globalParametersValues, setGlobalParametersValues] =
        useState<string>("");

    return (
        <GraphicsData.Provider
            value={{
                simulationKeys,
                setSimulationKeys,
                realDataSimulationKeys,
                setRealDataSimulationKeys,
                savedSimulationKeys,
                setSavedSimulationKeys,
                savedSimulation,
                setSavedSimulation,
                allGraphicData,
                setAllGraphicData,
                checkedItems,
                setCheckedItems,
                dataToShowInMap,
                setDataToShowInMap,
                allResults,
                setAllResults,
                globalParametersValues,
                setGlobalParametersValues,
            }}
        >
            {children}
        </GraphicsData.Provider>
    );
};

export default GraphicsContext;
