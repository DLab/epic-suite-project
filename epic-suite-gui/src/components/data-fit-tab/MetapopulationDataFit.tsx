import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";

import { DataFit } from "context/DataFitContext";

import FitParameterTable from "./FitParameterTable";

interface Props {
    nodeNameFilter: string;
}

/**
 * Fit data for metapopulation models.
 * @subcategory DataFitTab
 * @component
 */
const MetapopulationDataFit = ({ nodeNameFilter }: Props) => {
    const [fittedDataList, setFittedDataList] = useState([]);
    const { fittedData } = useContext(DataFit);

    useEffect(() => {
        if (nodeNameFilter !== "") {
            const filterFittedData = fittedData.filter((data) => {
                return data.name === nodeNameFilter;
            });
            setFittedDataList(filterFittedData);
        } else {
            setFittedDataList(fittedData);
        }
    }, [fittedData, nodeNameFilter]);

    return (
        <Accordion defaultIndex={[0]} allowMultiple>
            {fittedDataList.map((data, index) => {
                return (
                    <AccordionItem>
                        <h2>
                            <AccordionButton>
                                <Box flex="1" textAlign="left">
                                    {data.name}
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            <Tabs display="flex" isLazy>
                                <TabList display="flex" flexDirection="column">
                                    {Object.keys(data).map((key) => {
                                        if (
                                            key !== "name" &&
                                            key !== "I" &&
                                            key !== "I_ac"
                                        ) {
                                            return <Tab>{key}</Tab>;
                                        }
                                        return false;
                                    })}
                                </TabList>
                                <TabPanels>
                                    {Object.keys(data).map((key) => {
                                        if (
                                            key !== "name" &&
                                            key !== "I" &&
                                            key !== "I_ac"
                                        ) {
                                            // Para pasar a futuro el value de esa key
                                            // const info = fittedData[0][key];
                                            return (
                                                <TabPanel>
                                                    <FitParameterTable
                                                        param={key}
                                                        index={index}
                                                    />
                                                </TabPanel>
                                            );
                                        }
                                        return false;
                                    })}
                                </TabPanels>
                            </Tabs>
                        </AccordionPanel>
                    </AccordionItem>
                );
            })}
        </Accordion>
    );
};

export default MetapopulationDataFit;
