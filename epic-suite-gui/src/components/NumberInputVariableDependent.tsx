import { CheckIcon, CloseIcon, InfoIcon } from "@chakra-ui/icons";
import {
    Flex,
    Icon,
    IconButton,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Tooltip,
    Text,
    Box,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { update } from "store/ControlPanel";
import { NameFunction } from "types/VariableDependentTime";

interface Props {
    value: number;
    nameParams: string;
    description: string;
    step?: number;
    max?: number;
    min?: number;
    isDisabled?: boolean;
    name?: string;
    index?: number;
    isStateLocal?: boolean;
    duration?: number;
    isSupplementary?: boolean;
    supplementaryParam?: string;
}

/**
 * Input to insert the values of the time-dependent parameters of the models.
 * @component
 */
const NumberInputVariableDependent = ({
    value,
    nameParams,
    step,
    max = Infinity,
    min = 0,
    isDisabled,
    index,
    isStateLocal = false,
    name,
    description,
    duration,
    isSupplementary = false,
    supplementaryParam,
}: Props) => {
    const [localValue, setLocalValue] = useState<string>(`${value}`);
    const [isEditingLocalValue, setIsEditingLocalValue] =
        useState<boolean>(false);
    const dispatch = useDispatch();

    /**
     * Saves the new values of the time-dependent variables.
     * @param val new parameter value.
     */
    const handleChange = (val: string | number) => {
        dispatch(
            update({
                type: "setVariableDependent",
                payloadVariableDependent: {
                    rangeDays: [[0, duration]],
                    type: [
                        {
                            name: NameFunction.static,
                            value: +val,
                        },
                    ],
                    name: nameParams,
                    default: 7,
                    isEnabled: false,
                    val: +val,
                },
                positionVariableDependentTime: index ?? -1,
                target: nameParams,
            })
        );
    };
    // const handleChange = (val: string | number) => {
    //     if (isStateLocal) {
    //         setIsEditingLocalValue(true);
    //         setLocalValue(`${val}`);
    //     } else {
    //         dispatch(
    //             update({
    //                 type: "setVariableDependent",
    //                 payloadVariableDependent: {
    //                     rangeDays: [[0, duration]],
    //                     type: [
    //                         {
    //                             name: NameFunction.static,
    //                             value: +val,
    //                         },
    //                     ],
    //                     name: nameParams,
    //                     default: 7,
    //                     isEnabled: false,
    //                     val: +val,
    //                 },
    //                 positionVariableDependentTime: index ?? -1,
    //                 target: nameParams,
    //             })
    //         );
    //     }
    // };
    useEffect(() => {
        setLocalValue(`${value}`);
    }, [value]);
    return (
        <>
            <Box w="5rem">
                <Text
                    align="left"
                    fontSize="11px"
                    color={isDisabled && "gray.200"}
                >
                    {name ?? nameParams}
                </Text>
            </Box>

            <NumberInput
                w="100%"
                mx="0.2rem"
                fontSize="11px"
                value={!isStateLocal ? value : localValue}
                onChange={handleChange}
                size="xs"
                min={min}
                max={max}
                step={step}
                variant="outline"
                isDisabled={isDisabled}
            >
                <NumberInputField borderRadius="8px" />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
            <Tooltip label={description}>
                <Icon as={InfoIcon} color="#016FB9" />
            </Tooltip>

            {/* {isStateLocal && isEditingLocalValue && (
                <Flex mt="0.5rem" justifyContent="end">
                    <IconButton
                        bg="white"
                        border="thin"
                        color="teal.500"
                        aria-label="Check date range button"
                        size="xs"
                        cursor="pointer"
                        icon={<CheckIcon />}
                        onClick={() => {
                            dispatch(
                                update({
                                    type: "setVariableDependent",
                                    payloadVariableDependent: {
                                        rangeDays: [[0, duration]],
                                        type: [
                                            {
                                                name: NameFunction.static,
                                                value: +localValue,
                                            },
                                        ],
                                        name: nameParams,
                                        default: 7,
                                        isEnabled: false,
                                        val: +localValue,
                                    },
                                    positionVariableDependentTime: index ?? -1,
                                    target: nameParams,
                                })
                            );
                            if (isSupplementary) {
                                const param = localValue;
                                const supplementaryValueFromParam = Number(
                                    1 - parseFloat(param)
                                ).toFixed(2);
                                dispatch(
                                    update({
                                        type: "setVariableDependent",
                                        payloadVariableDependent: {
                                            rangeDays: [[0, duration]],
                                            type: [
                                                {
                                                    name: NameFunction.static,
                                                    value: +supplementaryValueFromParam,
                                                },
                                            ],
                                            name: supplementaryParam,
                                            default: 7,
                                            isEnabled: false,
                                            val: +supplementaryValueFromParam,
                                        },
                                        positionVariableDependentTime:
                                            index ?? -1,
                                        target: supplementaryParam,
                                    })
                                );
                            }
                            setIsEditingLocalValue(false);
                        }}
                    />
                    <IconButton
                        bg="white"
                        color="red.500"
                        aria-label="Cancel date range button"
                        size="xs"
                        cursor="pointer"
                        icon={<CloseIcon />}
                        onClick={() => {
                            setIsEditingLocalValue(false);
                            setLocalValue(`${value}`);
                        }}
                    />
                </Flex>
            )} */}
        </>
    );
};

export default NumberInputVariableDependent;
