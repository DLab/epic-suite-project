import {
    Box,
    Flex,
    FormControl,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Text,
} from "@chakra-ui/react";
import React, { useState } from "react";

interface Props {
    numberInputName: string;
    value?: number;
    setValue?: (value: number) => void;
    disabled?: boolean;
}

const NumberInputMobilityMatrix = ({
    numberInputName,
    value,
    setValue,
    disabled,
}: Props) => {
    const [locVal, setLocVal] = useState(`${value}`);
    return (
        <>
            <Box w="5rem">
                <Text align="left" fontSize="14px">
                    {numberInputName}
                </Text>
            </Box>
            <NumberInput
                maxH="20px"
                maxW="90px"
                mx="0.2rem"
                fontSize="11px"
                value={
                    numberInputName !== "Population" ? locVal : `${locVal} %`
                }
                isDisabled={!!disabled}
                onChange={(e) => {
                    setLocVal(e);
                }}
                onBlur={() => {
                    setValue(+locVal);
                }}
                size="xs"
                min={0}
                step={1}
                variant="outline"
                borderRadius="8px"
            >
                <NumberInputField borderRadius="6px" />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
        </>
    );
};

export default NumberInputMobilityMatrix;
