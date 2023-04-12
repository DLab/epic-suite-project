import { createContext, useMemo, useState } from "react";
import type React from "react";

import type { DataFitProps, FittedData, DataToFit } from "types/DataFitTypes2";
import type { ChildrenProps } from "types/importTypes";

export const DataFit = createContext<DataFitProps>({
    realDataToFit: [],
    setRealDataToFit: () => {},
    fittedData: [],
    setFittedData: () => {},
});

const DataFitContext: React.FC<ChildrenProps> = ({ children }) => {
    const [realDataToFit, setRealDataToFit] = useState<DataToFit[]>([]);
    const [fittedData, setFittedData] = useState<FittedData[] | null>([]);
    const config = useMemo(
        () => ({
            realDataToFit,
            setRealDataToFit,
            fittedData,
            setFittedData,
        }),
        [realDataToFit, fittedData]
    );
    return <DataFit.Provider value={config}>{children}</DataFit.Provider>;
};

export default DataFitContext;
