import {
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Text,
} from "@chakra-ui/react";
import React, { useContext } from "react";

import { DataFit } from "context/DataFitContext";

import FitParameterTable from "./FitParameterTable";

/**
 * Tabs with the results of the data adjustment for monopopulation models.
 * @subcategory DataFitTab
 * @component
 */
const MonopopulationDataFit = () => {
    const { fittedData } = useContext(DataFit);

    return (
        <>
            <Text>{fittedData[0].name}</Text>

            <Tabs display="flex" isLazy>
                <TabList display="flex" flexDirection="column">
                    {Object.keys(fittedData[0]).map((key) => {
                        if (
                            key !== "name" &&
                            key !== "I" &&
                            key !== "I_ac" &&
                            key !== "beta_days"
                        ) {
                            return <Tab key={key}>{key}</Tab>;
                        }
                        return false;
                    })}
                </TabList>
                <TabPanels>
                    {Object.keys(fittedData[0]).map((key) => {
                        if (
                            key !== "name" &&
                            key !== "I" &&
                            key !== "I_ac" &&
                            key !== "beta_days"
                        ) {
                            // Para pasar a futuro el value de esa key
                            // const info = fittedData[0][key];
                            return (
                                <TabPanel key={key}>
                                    {typeof fittedData[0][key] === "number" ? (
                                        <Text>{fittedData[0].mu}</Text>
                                    ) : (
                                        <FitParameterTable
                                            param={key}
                                            index={0}
                                        />
                                    )}
                                    {/* // {key === "beta" && <FitParameterTable />}
                                    // {key === "mu" && (
                                    //     <Text>{fittedData[0].mu}</Text>
                                    // )} */}
                                </TabPanel>
                            );
                        }
                        return false;
                    })}
                </TabPanels>
            </Tabs>
        </>
    );
};

export default MonopopulationDataFit;
