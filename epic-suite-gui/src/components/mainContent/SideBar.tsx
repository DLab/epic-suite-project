import { Tab, Box, Icon, Text, Flex, Divider } from "@chakra-ui/react";
import {
    MapPinIcon,
    ListBulletIcon,
    Squares2X2Icon,
    Square3Stack3DIcon,
    ChartBarSquareIcon,
    MapIcon,
    RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import { useRef, useEffect, useContext } from "react";

import SideBarLogo from "components/icons/SideBarLogo";
import AboutModal from "components/simulator/AboutModal";
import { TabIndex } from "context/TabContext";

const SideBar = () => {
    const { index: tabIndex } = useContext(TabIndex);
    const TabRefContainer = useRef(null);
    useEffect(() => {
        const tab = TabRefContainer.current;
        tab.childNodes.forEach((node) => {
            // eslint-disable-next-line no-param-reassign
            node.children[0].style.color = "#3EBFE0";
            // eslint-disable-next-line no-param-reassign
            node.children[1].style.color = "#3EBFE0";
        });
        tab.childNodes[tabIndex].children[0].style.color = "#FFFFFF";
        tab.childNodes[tabIndex].children[1].style.color = "#FFFFFF";
    }, [tabIndex]);

    return (
        <>
            {" "}
            <Box alignSelf="center">
                <Flex direction="column" align="center">
                    <Icon
                        as={SideBarLogo}
                        w={75}
                        h={39}
                        aria-label="EPIc Suite Logo"
                        fill="none"
                        m="17px"
                    />
                    <Divider
                        orientation="horizontal"
                        border="1px solid #FFFFFF"
                        background="#FFFFFF"
                    />
                </Flex>
                <Box ref={TabRefContainer}>
                    <Tab
                        _focus={{ boxShadow: "none" }}
                        display="flex"
                        flexDirection="column"
                        w="100%"
                        border="none"
                        m="10px 0"
                    >
                        <Icon
                            w="20px"
                            h="20px"
                            as={ListBulletIcon}
                            color="#3EBFE0"
                        />
                        <Text fontSize="0.5rem" color="#3EBFE0">
                            SUMMARY
                        </Text>
                    </Tab>
                    <Tab
                        _focus={{ boxShadow: "none" }}
                        display="flex"
                        flexDirection="column"
                        w="100%"
                        border="none"
                        m="10px 0"
                    >
                        <Icon
                            w="20px"
                            h="20px"
                            as={Squares2X2Icon}
                            color="#3EBFE0"
                        />
                        <Text fontSize="0.5rem" color="#3EBFE0">
                            MODELS
                        </Text>
                    </Tab>
                    <Tab
                        _focus={{ boxShadow: "none" }}
                        display="flex"
                        flexDirection="column"
                        w="100%"
                        border="none"
                        m="10px 0"
                    >
                        <Icon w="20px" h="20px" as={MapIcon} color="#3EBFE0" />
                        <Text fontSize="0.5rem" color="#3EBFE0">
                            GEOGRAPHIC
                        </Text>
                    </Tab>
                    <Tab
                        _focus={{ boxShadow: "none" }}
                        display="flex"
                        flexDirection="column"
                        w="100%"
                        border="none"
                        m="10px 0"
                    >
                        <Icon
                            w="20px"
                            h="20px"
                            as={Square3Stack3DIcon}
                            color="#3EBFE0"
                        />
                        <Text fontSize="0.5rem" color="#3EBFE0">
                            DATA FIT
                        </Text>
                    </Tab>

                    <Tab
                        _focus={{ boxShadow: "none" }}
                        display="flex"
                        flexDirection="column"
                        w="100%"
                        border="none"
                    >
                        <Icon
                            w="20px"
                            h="20px"
                            as={ChartBarSquareIcon}
                            color="#3EBFE0"
                        />
                        <Text fontSize="0.5rem" color="#3EBFE0">
                            RESULTS
                        </Text>
                    </Tab>
                    <Tab
                        _focus={{ boxShadow: "none" }}
                        display="flex"
                        flexDirection="column"
                        w="100%"
                        border="none"
                        m="10px 0"
                    >
                        <Icon
                            w="20px"
                            h="20px"
                            as={MapPinIcon}
                            color="#3EBFE0"
                        />
                        <Text fontSize="0.5rem" color="#3EBFE0">
                            MOBILITY
                        </Text>
                    </Tab>
                </Box>
            </Box>
            <Box textAlign="center" m="10% 0">
                <AboutModal />
            </Box>
        </>
    );
};

export default SideBar;
