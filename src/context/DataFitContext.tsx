import React, { createContext, useState } from "react";

import { DataFitProps, FittedData, DataToFit } from "types/DataFitTypes2";

export const DataFit = createContext<DataFitProps>({
    realDataToFit: [],
    setRealDataToFit: () => {},
    fittedData: [],
    setFittedData: () => {},
});

const DataFitContext: React.FC = ({ children }) => {
    const [realDataToFit, setRealDataToFit] = useState<DataToFit[]>([]);
    const [fittedData, setFittedData] = useState<FittedData[] | null>([]);

    return (
        <DataFit.Provider
            value={{
                realDataToFit,
                setRealDataToFit,
                fittedData,
                setFittedData,
            }}
        >
            {children}
        </DataFit.Provider>
    );
};

export default DataFitContext;
