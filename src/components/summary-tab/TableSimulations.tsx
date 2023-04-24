/* eslint-disable sonarjs/cognitive-complexity */
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
    Stack,
} from "@chakra-ui/react";
import { ArrowRightCircleIcon, PlusIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import React, { useContext, useEffect, useState } from "react";

import { HardSimSetted } from "context/HardSimulationsStatus";
import { NewModelSetted } from "context/NewModelsContext";
import { TabIndex } from "context/TabContext";
import type {
    NewModelsAllParams,
    NewModelsParams,
} from "types/SimulationTypes";
import createIdComponent from "utils/createIdcomponent";

import RunButton from "./RunButton";
import StatusHardSimPop from "./StatusHardSimPop";

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
    const { hardSimulation } = useContext(HardSimSetted);
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
                idMobilityMatrix: undefined,
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
        if (
            completeModel.every(
                (c: NewModelsAllParams) => c.populationType === "monopopulation"
            )
        ) {
            setCodMetaModelSelected(0);
        }
    }, [completeModel]);

    return (
        <Flex direction="column" gridColumn="1/4">
            <Text fontSize="1rem" fontWeight={600} mb="5px">
                Models
            </Text>
            {completeModel.length === 0 ? (
                <Stack>
                    <Button
                        size="sm"
                        w="100px"
                        fontSize="0.625rem"
                        bg="#016FB9"
                        color="#FFFFFF"
                        onClick={() => {
                            addNewModel();
                            setIndex(1);
                        }}
                    >
                        <Icon
                            w="0.875rem"
                            h="0.875rem"
                            as={PlusIcon}
                            mr="5px"
                        />
                        ADD NEW
                    </Button>
                </Stack>
            ) : (
                <>
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
                                        fontSize="1rem"
                                    >
                                        Model
                                    </Th>
                                    <Th
                                        textAlign="center"
                                        color="#016FB9"
                                        textTransform="capitalize"
                                        fontSize="1rem"
                                    >
                                        Compartments
                                    </Th>
                                    <Th
                                        textAlign="center"
                                        color="#016FB9"
                                        textTransform="capitalize"
                                        fontSize="1rem"
                                    >
                                        Nodes
                                    </Th>
                                    <Th
                                        textAlign="center"
                                        color="#016FB9"
                                        textTransform="capitalize"
                                        fontSize="1rem"
                                    >
                                        Data source
                                    </Th>

                                    <Th
                                        textAlign="center"
                                        color="#016FB9"
                                        textTransform="capitalize"
                                        fontSize="1rem"
                                    >
                                        Status
                                    </Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {completeModel.map((elem) => {
                                    return (
                                        <Tr key={createIdComponent()}>
                                            <Td fontSize="0.875rem">
                                                <Checkbox
                                                    isDisabled={
                                                        codMetaModelSelected !==
                                                            0 &&
                                                        elem.idNewModel !==
                                                            codMetaModelSelected
                                                    }
                                                    bg="white"
                                                    isChecked={
                                                        permission[
                                                            elem.idNewModel
                                                        ]
                                                    }
                                                    onChange={(e) => {
                                                        if (
                                                            elem.populationType ===
                                                                "metapopulation" &&
                                                            e.target.checked
                                                        ) {
                                                            const allPermissionsUnenabled =
                                                                Object.keys(
                                                                    permission
                                                                )
                                                                    .map(
                                                                        (
                                                                            idPermission
                                                                        ) => ({
                                                                            [idPermission]:
                                                                                false,
                                                                        })
                                                                    )
                                                                    .reduce(
                                                                        (
                                                                            acc,
                                                                            curr
                                                                        ) => {
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
                                                                    e.target
                                                                        .checked,
                                                            });
                                                            setCodMetaModelSelected(
                                                                elem.idNewModel
                                                            );
                                                        } else {
                                                            if (
                                                                elem.populationType ===
                                                                    "metapopulation" &&
                                                                !e.target
                                                                    .checked
                                                            ) {
                                                                setCodMetaModelSelected(
                                                                    0
                                                                );
                                                            }
                                                            setPermission({
                                                                ...permission,
                                                                [elem.idNewModel]:
                                                                    e.target
                                                                        .checked,
                                                            });
                                                        }
                                                    }}
                                                />
                                            </Td>
                                            <Td
                                                fontSize="0.875rem"
                                                textAlign="center"
                                            >
                                                {elem?.name ? (
                                                    <Text
                                                        textDecoration="underline"
                                                        fontStyle=""
                                                        cursor="pointer"
                                                        onClick={() => {
                                                            updateModelSelection(
                                                                elem?.idNewModel
                                                            );
                                                            setIndex(1);
                                                        }}
                                                    >
                                                        {elem.name}
                                                    </Text>
                                                ) : (
                                                    "Not defined yet"
                                                )}
                                            </Td>
                                            <Td
                                                fontSize="0.875rem"
                                                textAlign="center"
                                            >
                                                {elem?.modelType?.toUpperCase() ??
                                                    "Not defined yet"}
                                            </Td>
                                            <Td
                                                fontSize="0.875rem"
                                                textAlign="center"
                                            >
                                                {elem?.populationType ??
                                                    "Not defined yet"}
                                            </Td>
                                            <Td
                                                fontSize="0.875rem"
                                                textAlign="center"
                                            >
                                                {elem?.typeSelection ??
                                                    "Not defined yet"}
                                            </Td>
                                            {/* <Td fontSize="0.875rem">
                                        <Icon
                                            w="1.25rem"
                                            h="1.25rem"
                                            as={ArrowRightCircleIcon}
                                            color="#1B1B3A"
                                            onClick={() => {
                                                updateModelSelection(
                                                    elem?.idNewModel
                                                );
                                                setIndex(1);
                                            }}
                                        />
                                    </Td> */}
                                            <Td textAlign="center">
                                                {elem?.populationType ===
                                                    "metapopulation" &&
                                                    elem?.idNewModel ===
                                                        hardSimulation.details
                                                            .idModel && (
                                                        <StatusHardSimPop />
                                                    )}
                                            </Td>
                                        </Tr>
                                    );
                                })}
                            </Tbody>
                            <TableCaption textAlign="start" m="5px 0">
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                >
                                    <ButtonGroup spacing={5}>
                                        <RunButton permission={permission} />
                                        <Button
                                            size="sm"
                                            fontSize="0.625rem"
                                            bg="#016FB9"
                                            color="#FFFFFF"
                                            onClick={() => {
                                                addNewModel();
                                                setIndex(1);
                                            }}
                                        >
                                            <Icon
                                                w="0.875rem"
                                                h="0.875rem"
                                                as={PlusIcon}
                                                mr="5px"
                                            />
                                            ADD NEW
                                        </Button>
                                    </ButtonGroup>
                                </Stack>
                            </TableCaption>
                        </Table>
                    </TableContainer>
                    <Text
                        fontStyle="italic"
                        fontSize="12px"
                        fontWeight={300}
                        textAlign="justify"
                    >
                        * You can only simulate one metapopulation model because
                        the process can take several minutes.
                    </Text>
                </>
            )}
        </Flex>
    );
};

export default TableSimulations;
