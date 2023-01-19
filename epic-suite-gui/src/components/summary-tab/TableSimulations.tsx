/* eslint-disable sonarjs/no-duplicate-string */
import {
    Button,
    Checkbox,
    Flex,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Text,
    Icon,
    ButtonGroup,
} from "@chakra-ui/react";
import { ArrowRightCircleIcon, PlusIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import React, { useContext, useEffect, useState } from "react";

import { NewModelSetted } from "context/NewModelsContext";
import { TabIndex } from "context/TabContext";
import { NewModelsParams } from "types/SimulationTypes";
import createIdComponent from "utils/createIdcomponent";

import RunButton from "./RunButton";

type ReducedIdForPermissions = Record<number, boolean>;

/**
 * Summary table to select the models to be simulated.
 * @subcategory Summary tab
 * @component
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
const TableSimulations = () => {
    const {
        completeModel,
        setMode: setModelMode,
        setIdModelUpdate,
        setNewModel,
    } = useContext(NewModelSetted);
    const [permission, setPermission] = useState<ReducedIdForPermissions>({});
    const [codMetaModelSelected, setCodMetaModelSelected] = useState<number>(0);
    const { setIndex } = useContext(TabIndex);

    const updateModelSelection = (id) => {
        setIdModelUpdate(id);
        setModelMode("update");
    };

    const addNewModel = () => {
        const id = Date.now();
        setIdModelUpdate(id);
        setNewModel({
            type: "add",
            payload: {
                idNewModel: id,
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
        setModelMode("add");
    };

    useEffect(() => {
        if (completeModel.length > 0) {
            setPermission(
                completeModel
                    .map((elem: NewModelsParams) => {
                        return {
                            [elem.idNewModel]: false,
                        };
                    })
                    .reduce<ReducedIdForPermissions>(
                        (acc, current) => ({
                            ...acc,
                            ...current,
                        }),
                        {}
                    )
            );
        }
    }, [completeModel]);

    return completeModel.length > 0 ? (
        <Flex direction="column" gridColumn="1/4">
            <Text fontSize="24px" fontWeight={600} mb="5px">
                Models
            </Text>
            <TableContainer
                bg="white"
                maxH="60vh"
                overflowY="auto"
                border="1px solid #DDDDDD"
                borderRadius="8px"
            >
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th />
                            <Th
                                textAlign="center"
                                color="#016FB9"
                                textTransform="capitalize"
                                fontSize="16px"
                            >
                                Model
                            </Th>
                            <Th
                                textAlign="center"
                                color="#016FB9"
                                textTransform="capitalize"
                                fontSize="16px"
                            >
                                Compartments
                            </Th>
                            <Th
                                textAlign="center"
                                color="#016FB9"
                                textTransform="capitalize"
                                fontSize="16px"
                            >
                                Nodes
                            </Th>
                            <Th
                                textAlign="center"
                                color="#016FB9"
                                textTransform="capitalize"
                                fontSize="16px"
                            >
                                Data source
                            </Th>
                            <Th />
                        </Tr>
                    </Thead>
                    <Tbody>
                        {completeModel.map((elem) => {
                            return (
                                <Tr key={createIdComponent()}>
                                    <Td>
                                        <Checkbox
                                            isDisabled={
                                                codMetaModelSelected !== 0 &&
                                                elem.idNewModel !==
                                                    codMetaModelSelected
                                            }
                                            bg="white"
                                            isChecked={
                                                permission[elem.idNewModel]
                                            }
                                            onChange={(e) => {
                                                if (
                                                    elem.populationType ===
                                                        "metapopulation" &&
                                                    e.target.checked
                                                ) {
                                                    const allPermissionsUnenabled =
                                                        Object.keys(permission)
                                                            .map(
                                                                (
                                                                    idPermission
                                                                ) => ({
                                                                    [idPermission]:
                                                                        false,
                                                                })
                                                            )
                                                            .reduce(
                                                                (acc, curr) => {
                                                                    return {
                                                                        ...acc,
                                                                        ...curr,
                                                                    };
                                                                },
                                                                {}
                                                            );
                                                    setPermission({
                                                        ...allPermissionsUnenabled,
                                                        [elem.idNewModel]:
                                                            e.target.checked,
                                                    });
                                                    setCodMetaModelSelected(
                                                        elem.idNewModel
                                                    );
                                                } else {
                                                    if (
                                                        elem.populationType ===
                                                            "metapopulation" &&
                                                        !e.target.checked
                                                    ) {
                                                        setCodMetaModelSelected(
                                                            0
                                                        );
                                                    }
                                                    setPermission({
                                                        ...permission,
                                                        [elem.idNewModel]:
                                                            e.target.checked,
                                                    });
                                                }
                                            }}
                                        />
                                    </Td>
                                    <Td textAlign="center">
                                        {elem.name ?? "Not defined yet"}
                                    </Td>
                                    <Td textAlign="center">
                                        {elem.modelType.toUpperCase() ??
                                            "Not defined yet"}
                                    </Td>
                                    <Td textAlign="center">
                                        {elem.populationType ??
                                            "Not defined yet"}
                                    </Td>
                                    <Td textAlign="center">
                                        {elem.typeSelection ??
                                            "Not defined yet"}
                                    </Td>
                                    <Td>
                                        <Icon
                                            w="20px"
                                            h="20px"
                                            as={ArrowRightCircleIcon}
                                            color="#1B1B3A"
                                            onClick={() => {
                                                updateModelSelection(
                                                    elem.idNewModel
                                                );
                                                setIndex(1);
                                            }}
                                        />
                                    </Td>
                                </Tr>
                            );
                        })}
                    </Tbody>
                    <TableCaption textAlign="start" m="5px 0">
                        <ButtonGroup spacing={5}>
                            <RunButton permission={permission} />
                            <Button
                                size="sm"
                                fontSize="10px"
                                bg="#016FB9"
                                color="#FFFFFF"
                                onClick={() => {
                                    addNewModel();
                                    setIndex(1);
                                }}
                            >
                                <Icon
                                    w="14px"
                                    h="14px"
                                    as={PlusIcon}
                                    mr="5px"
                                />
                                ADD NEW
                            </Button>
                        </ButtonGroup>
                    </TableCaption>
                </Table>
            </TableContainer>
            <Text fontSize="12px" fontWeight={300} textAlign="justify">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam
            </Text>
        </Flex>
    ) : (
        <Flex>There's not models to simulate</Flex>
    );
};

export default TableSimulations;
