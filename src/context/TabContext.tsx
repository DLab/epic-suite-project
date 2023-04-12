import { createContext, useMemo, useState } from "react";

import type { ChildrenProps } from "types/importTypes";

interface TabType {
    index: number;
    setIndex: (value: number) => void;
    aux?: string;
    setAux: (value: string) => void;
}

export const TabIndex = createContext<TabType>({
    index: 0,
    setIndex: () => {},
    aux: "",
    setAux: () => {},
});

const TabContext: React.FC<ChildrenProps> = ({ children }) => {
    const [index, setIndex] = useState<number>(0);
    const [aux, setAux] = useState<string>("");
    const contextValue = useMemo(() => {
        return {
            index,
            setIndex,
            aux,
            setAux,
        };
    }, [index, aux]);
    return (
        <TabIndex.Provider value={contextValue}>{children}</TabIndex.Provider>
    );
};

export default TabContext;
