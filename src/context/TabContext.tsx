import { createContext, useState } from "react";

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

// eslint-disable-next-line react/prop-types
const TabContext: React.FC = ({ children }) => {
    const [index, setIndex] = useState<number>(0);
    const [aux, setAux] = useState<string>("");
    return (
        <TabIndex.Provider
            value={{
                index,
                setIndex,
                aux,
                setAux,
            }}
        >
            {children}
        </TabIndex.Provider>
    );
};

export default TabContext;
