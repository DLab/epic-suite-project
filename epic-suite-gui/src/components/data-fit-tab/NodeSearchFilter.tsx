import {
    Input,
    Text,
    Button,
    Flex,
    Box,
    IconButton,
    Tooltip,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";

// import CleanIcon from "../icons/CleanIcon";
import { DataFit } from "context/DataFitContext";

interface Props {
    setNodeNameFilter: (value: string) => void;
}

/**
 * Node finder for metapopulation models.
 * @subcategory DataFitTab
 * @component
 */
const NodeSearchFilter = ({ setNodeNameFilter }: Props) => {
    const [searchNode, setSearchNode] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [showList, setShowList] = useState(true);
    const [nodeNamesList, setNodeNamesList] = useState([]);
    const { fittedData } = useContext(DataFit);
    const ref = useRef(null);

    /**
     * Stop showing the list in case of clicking outside the search engine.
     * @param event click event.
     */
    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setShowList(false);
        }
    };

    /**
     * Saves the value written in the input in the search engine.
     * @param e input value.
     */
    const handleChange = (e) => {
        setSearchNode(e.target.value);
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    });

    useEffect(() => {
        const fittedDataNodesNames = fittedData.map((nodeName) => {
            return nodeName.name;
        });
        setNodeNamesList(fittedDataNodesNames);
    }, [fittedData]);

    useEffect(() => {
        const results = nodeNamesList.filter((node) =>
            node.toLowerCase().includes(searchNode.toLowerCase())
        );
        setSearchResult(results);
    }, [nodeNamesList, searchNode]);

    return (
        <Flex justifyContent="space-between" m="0 1% 1% 0">
            <Text>Fitted Parameters</Text>
            <Flex>
                <Box w="14rem" ref={ref}>
                    <Input
                        placeholder="Filter Node"
                        value={searchNode}
                        size="sm"
                        onChange={(e) => {
                            handleChange(e);
                            setShowList(true);
                        }}
                    />
                    {searchNode.length > 1 && showList && (
                        <Flex
                            direction="column"
                            position="absolute"
                            w="14rem"
                            bg="white"
                            border="1px solid"
                            zIndex="1"
                            p="0.2% 0.5%"
                        >
                            {searchResult.map((item) => (
                                <Button
                                    colorScheme="teal"
                                    variant="link"
                                    color="black"
                                    alignSelf="baseline"
                                    fontWeight="normal"
                                    m="2%"
                                    value={item}
                                    onClick={(e) => {
                                        handleChange(e);
                                        setNodeNameFilter(
                                            (e.target as HTMLTextAreaElement)
                                                .value
                                        );
                                        setShowList(false);
                                    }}
                                >
                                    {item}
                                </Button>
                            ))}
                        </Flex>
                    )}
                </Box>
                <Tooltip label="Clean filter" aria-label="A tooltip">
                    <IconButton
                        variant="outline"
                        colorScheme="teal"
                        aria-label="Call Sage"
                        fontSize="20px"
                        size="sm"
                        ml="5%"
                        // icon={<CleanIcon />}
                        onClick={() => {
                            setNodeNameFilter("");
                            setSearchNode("");
                        }}
                    />
                </Tooltip>
            </Flex>
        </Flex>
    );
};

export default NodeSearchFilter;
