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
import React from "react";

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
    return (
        <Flex alignItems="center">
            <Box>
                <Text align="left" fontSize="14px" mr="7px">
                    {numberInputName}
                </Text>
            </Box>
            <NumberInput
                maxW="75px"
                value={numberInputName !== "Population" ? value : `${value} %`}
                isDisabled={!!disabled}
                onChange={(e) => {
                    setValue(+e);
                }}
                size="sm"
                min={0}
                step={1}
            >
                <NumberInputField borderRadius="6px" />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
        </Flex>
    );
};

export default NumberInputMobilityMatrix;
