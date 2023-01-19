/* eslint-disable sonarjs/no-duplicate-string */
import { AddIcon } from "@chakra-ui/icons";
import {
    Box,
    Flex,
    IconButton,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    Tooltip,
} from "@chakra-ui/react";
import { format } from "date-fns";
import React, { useContext, useState } from "react";

import { NewModelSetted } from "context/NewModelsContext";
import createIdComponent from "utils/createIdcomponent";

import ImportModels from "./ImportModels";
import ModelMainTab from "./ModelMainTab";

/**
 * Component responsible for displaying and creating models.
 * @category NewModel
 * @component
 */
const NewModel = () => {
    const [tabIndex, setTabIndex] = useState<number>();
    const { newModel, setNewModel } = useContext(NewModelSetted);

    /**
     * Add a tab with all the settings to be able to create a new model.
     */
    const addNewModel = () => {
        setNewModel({
            type: "add",
            payload: {
                idNewModel: Date.now(),
                name: "",
                modelType: undefined,
                populationType: undefined,
                typeSelection: undefined,
                idGeo: undefined,
                idGraph: undefined,
                numberNodes: undefined,
                t_init: format(new Date(2022, 4, 31), "yyyy/MM/dd"),
                initialConditions: [],
            },
        });
        setTabIndex(newModel.length);
    };

    return (
        <>
            <Box h="5vh" mh="5vh">
                <Text color="#16609E" fontSize="18px" fontWeight="bold">
                    Models
                </Text>
            </Box>
            {newModel.length > 0 ? (
                <>
                    <Tabs
                        display="flex"
                        h="90vh"
                        mh="90vh"
                        index={tabIndex}
                        isLazy
                        onChange={(e) => {
                            setTabIndex(e);
                        }}
                    >
                        <Box>
                            <Flex maxH="82vh" overflowY="auto">
                                <TabList display="flex" flexDirection="column">
                                    {newModel.map((model, index) => {
                                        if (model.name !== "") {
                                            return (
                                                <Tab
                                                    key={createIdComponent()}
                                                    display="inline-block"
                                                    maxW="8rem"
                                                    textOverflow="ellipsis"
                                                    whiteSpace="nowrap"
                                                    overflowX="hidden"
                                                    _selected={{
                                                        color: "white",
                                                        bg: "blue.500",
                                                    }}
                                                >
                                                    {model.name}
                                                </Tab>
                                            );
                                        }
                                        return (
                                            <Tab
                                                key={createIdComponent()}
                                                _selected={{
                                                    color: "white",
                                                    bg: "blue.500",
                                                }}
                                            >
                                                Model {index + 1}
                                            </Tab>
                                        );
                                    })}
                                </TabList>
                            </Flex>
                            <Flex justifyContent="center">
                                <Tooltip label="Create Model">
                                    <IconButton
                                        bg="#16609E"
                                        color="#FFFFFF"
                                        aria-label="Call Segun"
                                        size="sm"
                                        cursor="pointer"
                                        _hover={{ bg: "blue.500" }}
                                        icon={<AddIcon />}
                                        onClick={() => addNewModel()}
                                    />
                                </Tooltip>
                                <ImportModels />
                            </Flex>
                        </Box>
                        <TabPanels>
                            {newModel.map((model, index) => {
                                return (
                                    <TabPanel
                                        display="flex"
                                        p="0"
                                        h="100%"
                                        w="100%"
                                        key={createIdComponent()}
                                    >
                                        <ModelMainTab
                                            id={model.idNewModel}
                                            initialConditions={
                                                model.initialConditions
                                            }
                                            index={index}
                                            setTabIndex={setTabIndex}
                                        />
                                    </TabPanel>
                                );
                            })}
                        </TabPanels>
                    </Tabs>
                </>
            ) : (
                <Tabs
                    key="simulation-empty-tab"
                    display="flex"
                    mt="1%"
                    h="80vh"
                    mh="80vh"
                >
                    <Tooltip label="Create Model">
                        <IconButton
                            bg="#16609E"
                            color="#FFFFFF"
                            aria-label="Call Segun"
                            size="sm"
                            cursor="pointer"
                            _hover={{ bg: "blue.500" }}
                            icon={<AddIcon />}
                            onClick={() => addNewModel()}
                        />
                    </Tooltip>
                </Tabs>
            )}
        </>
    );
};

export default NewModel;
