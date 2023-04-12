import { AddIcon } from "@chakra-ui/icons";
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerOverlay,
    DrawerContent,
    Button,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    IconButton,
} from "@chakra-ui/react";
import React, { useContext } from "react";

import { GraphicsData } from "context/GraphicsContext";
import createIdComponent from "utils/createIdcomponent";

import ResultsMapsSelection from "./ResultsMapsSelection";
import ResultsSelection from "./ResultsSelection";

interface Props {
    isOpen: boolean;
    onOpen: (val: boolean) => void;
    onClose: (val: boolean) => void;
    simulationsPopulatioType: string;
}

/**
 * Component that contains map and chart settings.
 * @subcategory Results
 * @component
 */
const ResultsDrawer = ({
    isOpen,
    onOpen,
    onClose,
    simulationsPopulatioType,
}: Props) => {
    const {
        allGraphicData,
        setAllGraphicData,
        savedSimulation,
        setAllResults,
        dataToShowInMap,
    } = useContext(GraphicsData);

    const btnRef = React.useRef();
    return (
        <>
            <IconButton
                bg="#016FB9"
                color="#FFFFFF"
                aria-label="Call Segun"
                size="sm"
                cursor="pointer"
                _hover={{ bg: "#016FB9" }}
                icon={<AddIcon />}
                ref={btnRef}
                onClick={() => {
                    onOpen(true);
                }}
            />

            <Drawer
                isOpen={isOpen}
                placement="right"
                onClose={() => {
                    onClose(true);
                }}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent bg="#F2F2F0">
                    <DrawerBody p="0">
                        <Tabs h="90%" isFitted>
                            <TabList>
                                {simulationsPopulatioType === "mono" && (
                                    <Tab>Graphic</Tab>
                                )}
                                <Tab>Map</Tab>
                            </TabList>
                            <TabPanels h="100%">
                                {simulationsPopulatioType === "mono" && (
                                    <TabPanel p="0" h="100%">
                                        <ResultsSelection />
                                        <DrawerFooter justifyContent="space-around">
                                            <Button
                                                color="white"
                                                bg="#016FB9"
                                                onClick={() => {
                                                    const graphicDataAux = [
                                                        ...allGraphicData,
                                                        [
                                                            {
                                                                graphicName: "",
                                                                graphicId:
                                                                    createIdComponent(),

                                                                leftAxis:
                                                                    savedSimulation,
                                                                rightAxis: [],
                                                            },
                                                        ],
                                                    ];
                                                    setAllGraphicData(
                                                        graphicDataAux
                                                    );
                                                    setAllResults(
                                                        [].concat(
                                                            dataToShowInMap,
                                                            graphicDataAux
                                                        )
                                                    );
                                                    onClose(true);
                                                }}
                                            >
                                                Chart
                                            </Button>
                                            <Button
                                                bg="#8080A0"
                                                color="white"
                                                variant="outline"
                                                onClick={() => {
                                                    onClose(true);
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </DrawerFooter>
                                    </TabPanel>
                                )}
                                <TabPanel p="0 5%" h="100%">
                                    <ResultsMapsSelection onClose={onClose} />
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default ResultsDrawer;
