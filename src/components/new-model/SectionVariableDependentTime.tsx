/* eslint-disable @typescript-eslint/dot-notation */
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
    Skeleton,
    Box,
    Heading,
    Tooltip,
    IconButton,
    Flex,
    Select,
    Button,
    ButtonGroup,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    NumberInput,
    useToast,
    Spinner,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useReducer, useState, useContext } from "react";
import Plot from "react-plotly.js";
import { useDispatch, useSelector } from "react-redux";

import { ControlPanel } from "context/ControlPanelContext";
import { update } from "store/ControlPanel";
import { RootState } from "store/store";
import VariableDependentTime, {
    DataForGraph,
    NameFunction,
} from "types/VariableDependentTime";
import createIdComponent from "utils/createIdcomponent";
import {
    createSeries,
    formatVariableDependentTime,
} from "utils/getDataForGraphicVTD";
import reducerVariableDependent, {
    handleNameFunctionSelect,
    lastValueInMatrix,
} from "utils/reducerVariableDependent";

import DateRangeVariableDependent from "./DateRangeVariableDependent";
import GraphDependentTimeParameters from "./GraphDependentTimeParameters";
import PopoverVariableDependent from "./PopoverVariableDependent";

const Graphic = dynamic(() => import("./GraphDependentTimeParameters"), {
    loading: () => (
        <Skeleton h="30vh">
            <div>contents wrapped</div>
            <div>won't be visible</div>
        </Skeleton>
    ),
    ssr: false,
});

interface Props {
    valuesVariablesDependent: VariableDependentTime;
    showSectionVariable: (value: boolean) => void;
    positionVariableDependentTime?: number;
}

const SectionVariableDependentTime = ({
    valuesVariablesDependent,
    showSectionVariable,
    positionVariableDependentTime,
}: Props) => {
    const [idRangeUpdating, setIdRangeUpdating] = useState(-1);
    const [isRangeUpdating, setIsRangeUpdating] = useState<boolean>(false);
    const [dataForGraph, setDataForGraph] = useState<DataForGraph[]>([
        {
            function: [],
            t: [],
        },
    ]);
    // const { parameters, setParameters } = useContext(ControlPanel);
    const dispatch = useDispatch();
    const parameters = useSelector((state: RootState) => state.controlPanel);
    const [values, setValues] = useReducer(
        reducerVariableDependent,
        valuesVariablesDependent
    );
    const toast = useToast();
    return (
        <Box>
            <Graphic
                setData={setDataForGraph}
                values={values}
                dataForGraph={dataForGraph[0]}
                duration={parameters.t_end}
            />
            <Box>
                <Flex justifyContent="space-between">
                    <Heading as="h3">{values["name"]}</Heading>
                    <Flex alignItems="center">
                        Default:
                        <NumberInput
                            ml="0.2rem"
                            w="30%"
                            size="xs"
                            value={values["default"]}
                            onChange={(e) =>
                                setValues({
                                    type: "editDefault",
                                    index: e,
                                })
                            }
                        >
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </Flex>
                    <Tooltip label="Add a range">
                        <IconButton
                            bg="#16609E"
                            color="#FFFFFF"
                            aria-label="Call Segun"
                            size="sm"
                            cursor="pointer"
                            _hover={{ bg: "blue.500" }}
                            icon={<AddIcon />}
                            onClick={() => {
                                setValues({
                                    type: "add",
                                    payloadVariableDependent: {
                                        rangeDays: [
                                            lastValueInMatrix(values.rangeDays),
                                            lastValueInMatrix(
                                                values.rangeDays
                                            ) + 10,
                                        ],
                                        type: {
                                            name: NameFunction.static,
                                            value: 1,
                                        },
                                    },
                                });
                            }}
                        />
                    </Tooltip>
                </Flex>
                <Box
                    border="1px"
                    p="0.5"
                    borderColor="gray.200"
                    maxH="40vh"
                    h="40vh"
                    overflowY="scroll"
                >
                    {values["rangeDays"].map((range: number[], i: number) => (
                        <Flex
                            key={createIdComponent()}
                            h="3rem"
                            alignItems="center"
                            justifyContent="space-between"
                            borderBottom="1px"
                            borderColor="gray.200"
                        >
                            range: {i + 1}{" "}
                            <Flex w="50%" justifyContent="space-around">
                                <IconButton
                                    bg="#ffffff"
                                    color="#16609E"
                                    aria-label="Call Segun"
                                    size="xs"
                                    isDisabled={
                                        isRangeUpdating &&
                                        idRangeUpdating !== i &&
                                        idRangeUpdating !== -1
                                    }
                                    cursor="pointer"
                                    icon={<EditIcon />}
                                    onClick={() => {
                                        setIsRangeUpdating(true);
                                        setIdRangeUpdating(i);
                                    }}
                                />
                                <DateRangeVariableDependent
                                    beforeRange={
                                        values["rangeDays"][
                                            i === 0 ? 0 : i - 1
                                        ][1]
                                    }
                                    init={range[0]}
                                    end={range[1]}
                                    id={i}
                                    setDate={setValues}
                                    isRangeUpdating={isRangeUpdating}
                                    idRangeUpdating={idRangeUpdating}
                                    handleInput={{
                                        setId: setIdRangeUpdating,
                                        setIsRange: setIsRangeUpdating,
                                    }}
                                />
                            </Flex>
                            <Flex
                                w="50%"
                                alignItems="center"
                                justifyContent="end"
                            >
                                Type function:
                                <Select
                                    w="45%"
                                    size="sm"
                                    ml="0.2rem"
                                    value={values["type"][i]["name"]}
                                    onChange={(e) => {
                                        handleNameFunctionSelect(
                                            e.target.value,
                                            i,
                                            setValues
                                        );
                                    }}
                                >
                                    <option value={NameFunction.transition}>
                                        {NameFunction.transition}
                                    </option>
                                    <option value={NameFunction.static}>
                                        {NameFunction.static}
                                    </option>
                                    <option value={NameFunction.sinusoidal}>
                                        {NameFunction.sinusoidal}
                                    </option>
                                    <option value={NameFunction.square}>
                                        {NameFunction.square}
                                    </option>
                                </Select>
                                <PopoverVariableDependent
                                    data={values["type"][i]}
                                    i={i}
                                    setValues={setValues}
                                />
                                {values["type"].length !== 1 && (
                                    <IconButton
                                        bg="#ffffff"
                                        color="#16609E"
                                        aria-label="Call Segun"
                                        size="xs"
                                        isDisabled={isRangeUpdating}
                                        cursor="pointer"
                                        icon={<DeleteIcon />}
                                        onClick={() => {
                                            setValues({
                                                type: "delete",
                                                index: `${i}`,
                                            });
                                            setIdRangeUpdating(-1);
                                            setIsRangeUpdating(false);
                                        }}
                                    />
                                )}
                            </Flex>
                        </Flex>
                    ))}
                </Box>
                <ButtonGroup variant="outline" spacing="6" my="0.5rem">
                    <Button
                        w="50%"
                        size="sm"
                        colorScheme="blue"
                        onClick={() => {
                            const isCorrectRange = values["rangeDays"].every(
                                (e, i, arr) => {
                                    if (i > 0) {
                                        return e[0] >= arr[i - 1][1];
                                    }
                                    return true;
                                }
                            );
                            if (isCorrectRange) {
                                dispatch(
                                    update({
                                        type: "setVariableDependent",
                                        target: values["name"],
                                        payloadVariableDependent: {
                                            ...values,
                                            default: +values["default"],
                                        },
                                        positionVariableDependentTime,
                                    })
                                );
                                showSectionVariable(false);
                            } else {
                                toast({
                                    title: "Failed setting function",
                                    description:
                                        "Days ranges are wrong. Fix it for setting please!",
                                    status: "error",
                                    duration: 4000,
                                    isClosable: true,
                                    position: "bottom-left",
                                });
                            }
                        }}
                    >
                        Set
                    </Button>
                    <Button
                        w="50%"
                        size="sm"
                        onClick={() => showSectionVariable(false)}
                    >
                        Cancel
                    </Button>
                </ButtonGroup>
            </Box>
        </Box>
    );
};

export default SectionVariableDependentTime;
