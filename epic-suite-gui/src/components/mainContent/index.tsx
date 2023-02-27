import {
    Tabs,
    TabList,
    TabPanel,
    TabPanels,
    Flex,
    Center,
    Spinner,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useContext } from "react";

import Results from "../results-tab";
import DataFitTab from "components/data-fit-tab";
import MobilityMatrix from "components/mobility-matrix-tab";
import ModelTab from "components/models-tab";
import SummaryTab from "components/summary-tab/SummaryTab";
import { TabIndex } from "context/TabContext";

import SideBar from "./SideBar";

const GeoMap = dynamic(() => import("../geo-tab"), {
    // eslint-disable-next-line sonarjs/no-identical-functions
    loading: () => (
        <Flex justifyContent="center" alignItems="center" h="95vh">
            <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
            />
        </Flex>
    ),
    ssr: false,
});

const MainContentTab = () => {
    const { index: tabIndex, setIndex } = useContext(TabIndex);

    return (
        <Tabs
            id="tab-content"
            h="100vh"
            index={tabIndex}
            onChange={(index) => setIndex(index)}
            display="flex"
        >
            <TabList
                display="flex"
                flexDirection="column"
                h="100vh"
                bg="#016FB9"
                border="none"
            >
                <Flex direction="column" h="100%" justify="space-between">
                    <SideBar />{" "}
                </Flex>
            </TabList>
            <TabPanels h="100vh" bg="#FFFFFF" overflowY="auto">
                <TabPanel maxH="100vh" h="100%">
                    <SummaryTab />
                </TabPanel>
                <TabPanel h="100vh" maxH="100vh" overflow="hidden">
                    <ModelTab />
                </TabPanel>
                <TabPanel maxH="100vh" h="100%">
                    <GeoMap />
                </TabPanel>
                <TabPanel h="100vh" maxH="100vh">
                    <DataFitTab />
                </TabPanel>
                <TabPanel h="100vh" maxH="100vh">
                    <Flex maxh="100vh" h="97vh">
                        <Center w="100%" maxh="100vh">
                            <Results />
                        </Center>
                    </Flex>
                </TabPanel>
                <TabPanel maxH="100vh" h="100%" overflow="hidden">
                    <MobilityMatrix />
                </TabPanel>
                {/* <TabPanel maxH="100vh" h="100%">
                    <NewModel />
                </TabPanel> */}
            </TabPanels>
        </Tabs>
    );
};

export default MainContentTab;
