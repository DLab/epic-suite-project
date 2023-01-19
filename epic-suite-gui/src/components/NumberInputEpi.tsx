/* eslint-disable complexity */
import { CheckIcon, CloseIcon, InfoIcon } from "@chakra-ui/icons";
import {
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Flex,
    Text,
    Tooltip,
    Icon,
    IconButton,
    Box,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { update } from "store/ControlPanel";

interface Props {
    value: number;
    nameParams: string;
    description: string;
    step?: number;
    max?: number;
    min?: number;
    type: string;
    isInitialParameters?: boolean;
    isDisabled?: boolean;
    name?: string;
    index?: number;
    isStateLocal?: boolean;
}

/**
 * Input to insert the values of the model parameters.
 * @component
 */
const NumberInputEpi = ({
    value,
    nameParams,
    step,
    max = Infinity,
    min = 0,
    type,
    isInitialParameters,
    isDisabled,
    name,
    description,
    index,
    isStateLocal = false,
}: Props) => {
    const [localValue, setLocalValue] = useState<string>(`${value}`);
    const [isEditingLocalValue, setIsEditingLocalValue] =
        useState<boolean>(false);
    const dispatch = useDispatch();
    /**
     * Saves the new value of a parameter.
     * @param val new parameter value.
     */
    const handleChange = (val: string | number) => {
        if (isStateLocal) {
            setIsEditingLocalValue(true);
            setLocalValue(`${val}`);
        } else {
            dispatch(
                update({
                    type: "set",
                    positionVariableDependentTime: index,
                    target: nameParams,
                    payload: +localValue,
                })
            );
        }
    };
    useEffect(() => {
        setLocalValue(`${value}`);
    }, [value]);

    return (
        <>
            <Box minW="30%">
                <Text
                    align="left"
                    fontSize="11px"
                    color={isDisabled && "gray.200"}
                >
                    {name ?? nameParams}
                </Text>
            </Box>

            {/* {type === "slider" && (
                <>
                    <NumberInput
                        fontSize="11px"
                        maxW="70px"
                        mr="1rem"
                        onChange={handleChange}
                        size="xs"
                        min={+min}
                        max={+max}
                        step={step}
                        value={!isStateLocal ? value : localValue}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                    <Slider
                        flex="1"
                        focusThumbOnChange={false}
                        id="slider-number-input"
                        value={!isStateLocal ? +value : +localValue}
                        step={step}
                        min={+min}
                        max={+max}
                        onChange={handleChange}
                    >
                        <SliderTrack>
                            <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb fontSize="sm" boxSize="32px">
                            {!isStateLocal ? +value : +localValue}
                        </SliderThumb>
                    </Slider>
                </>
            )} */}
            {type === "number" && !isInitialParameters && (
                <NumberInput
                    maxH="20px"
                    minW="75px"
                    mx="0.2rem"
                    fontSize="11px"
                    // defaultValue={value}
                    onChange={handleChange}
                    size="xs"
                    min={0}
                    max={max}
                    step={step}
                    variant="outline"
                    isDisabled
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            )}
            {isInitialParameters && !isStateLocal && (
                <NumberInput
                    maxH="20px"
                    maxW="75px"
                    mx="0.2rem"
                    fontSize="11px"
                    value={value}
                    onChange={handleChange}
                    size="xs"
                    min={min}
                    max={max}
                    step={step}
                    variant="outline"
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            )}
            {isInitialParameters && isStateLocal && (
                <NumberInput
                    maxH="20px"
                    minW="75px"
                    mx="0.2rem"
                    fontSize="11px"
                    value={localValue}
                    onChange={handleChange}
                    size="xs"
                    min={min}
                    max={max}
                    step={step}
                    variant="outline"
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            )}

            {isStateLocal && isEditingLocalValue && (
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
                                    type: "set",
                                    positionVariableDependentTime: index,
                                    target: nameParams,
                                    payload: +localValue,
                                })
                            );
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
            )}
            <Tooltip label={description}>
                <Icon as={InfoIcon} color="#016FB9" />
            </Tooltip>
        </>
    );
};

export default NumberInputEpi;
