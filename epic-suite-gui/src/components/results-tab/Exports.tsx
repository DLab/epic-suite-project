import { ChevronDownIcon } from "@chakra-ui/icons";
import {
    Flex,
    Button,
    Text,
    Link,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
} from "@chakra-ui/react";
import { Parser } from "json2csv";
import React, { useState, useEffect } from "react";

import createIdComponent from "utils/createIdcomponent";

interface Props {
    data: string;
}

const Exports = ({ data }: Props) => {
    const [simulationKeys, setSimulationKeys] = useState("");
    const [csvContent, setCsvContent] = useState("");

    useEffect(() => {
        const graphicData = data ? JSON.parse(data) : "";
        if (graphicData) {
            const json2csvParser = new Parser();
            const csv = json2csvParser.parse(graphicData);
            setSimulationKeys(graphicData);
            setCsvContent(csv);
        }
    }, [data]);

    return (
        <Flex
            id={createIdComponent()}
            direction="column"
            alignItems="end"
            m="0 5%"
        >
            <Menu id={createIdComponent()}>
                <MenuButton
                    id={createIdComponent()}
                    as={Button}
                    size="sm"
                    colorScheme="teal"
                    rightIcon={<ChevronDownIcon />}
                >
                    Exports
                </MenuButton>
                <MenuList>
                    <Link
                        id={createIdComponent()}
                        download="simulation.csv"
                        href={`data:text/json;charset=utf-8,${encodeURIComponent(
                            csvContent
                        )}`}
                    >
                        <MenuItem id={createIdComponent()}>CSV</MenuItem>
                    </Link>
                    <Link
                        id={createIdComponent()}
                        download="simulation.json"
                        href={`data:text/json;charset=utf-8,${encodeURIComponent(
                            JSON.stringify(simulationKeys)
                        )}`}
                    >
                        <MenuItem id={createIdComponent()}>JSON</MenuItem>
                    </Link>
                </MenuList>
            </Menu>
        </Flex>
    );
};

export default Exports;
