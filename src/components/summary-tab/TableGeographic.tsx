import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Flex,
    Text,
    Icon,
    Button,
} from "@chakra-ui/react";
import { ArrowRightCircleIcon, PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React, { useContext } from "react";

import { SelectFeature } from "context/SelectFeaturesContext";
import { TabIndex } from "context/TabContext";
import { Model } from "types/ControlPanelTypes";
// import GeoTab from "../geo-tab";

const TableGeographic = () => {
    const {
        geoSelections,
        setMode,
        setIdGeoSelectionUpdate,
        setScale,
        setCounties,
        setStates,
        setOriginOfGeoCreation,
    } = useContext(SelectFeature);
    const { setIndex } = useContext(TabIndex);

    const updateGeoSelection = (id) => {
        const { scale, featureSelected } = geoSelections.find(
            (selection) => selection.id === id
        );
        setIdGeoSelectionUpdate(id);
        setScale(scale);
        if (scale === "Counties") {
            setCounties({ type: "update", updateData: featureSelected });
        } else {
            setStates({ type: "update", updateData: featureSelected });
        }
    };

    return (
        <Flex direction="column" gridColumn="4/6">
            <Text fontSize="24px" fontWeight={600} mb="5px">
                Geographic selection
            </Text>
            <TableContainer border="1px solid #DDDDDD" borderRadius="8px">
                <Table>
                    <Thead>
                        <Tr>
                            <Th
                                textAlign="center"
                                color="#016FB9"
                                textTransform="capitalize"
                                fontSize="16px"
                            >
                                Selection
                            </Th>
                            <Th
                                textAlign="center"
                                color="#016FB9"
                                textTransform="capitalize"
                                fontSize="16px"
                            >
                                Scale
                            </Th>
                            <Th />
                        </Tr>
                    </Thead>
                    <Tbody>
                        {geoSelections.map((geoSelection) => {
                            return (
                                <Tr key={geoSelection.id}>
                                    <Td>{geoSelection.name}</Td>
                                    <Td>{geoSelection.scale}</Td>
                                    <Td>
                                        <Icon
                                            w="20px"
                                            h="20px"
                                            as={ArrowRightCircleIcon}
                                            color="#1B1B3A"
                                            onClick={() => {
                                                updateGeoSelection(
                                                    geoSelection.id
                                                );
                                                setMode(Model.Update);
                                                setOriginOfGeoCreation(
                                                    "summaryTab"
                                                );
                                                setIndex(2);
                                            }}
                                        />
                                    </Td>
                                </Tr>
                            );
                        })}
                    </Tbody>
                    <TableCaption textAlign="start" m="5px 0">
                        <Button
                            size="sm"
                            fontSize="10px"
                            bg="#016FB9"
                            color="#FFFFFF"
                            onClick={() => {
                                setMode(Model.Add);
                                setIndex(2);
                            }}
                        >
                            <Icon w="14px" h="14px" as={PlusIcon} mr="5px" />
                            ADD NEW
                        </Button>
                    </TableCaption>
                </Table>
            </TableContainer>
        </Flex>
    );
};

export default TableGeographic;
