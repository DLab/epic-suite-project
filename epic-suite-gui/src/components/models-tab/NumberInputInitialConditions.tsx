import { InfoIcon } from "@chakra-ui/icons";
import {
    Box,
    Flex,
    Icon,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Text,
    Tooltip,
} from "@chakra-ui/react";
import React from "react";

import type { InitialConditions } from "types/ControlPanelTypes";

interface Props {
    value: InitialConditions;
    setValue: (val: unknown) => void;
    name: string;
    description: string;
}

const NumberInputInitialConditions = ({
    value,
    setValue,
    name,
    description,
}: Props) => {
    return (
        <Box>
            <Flex align="center">
                <Text align="left" fontSize="0.875rem">
                    {name}
                </Text>
                <Tooltip label={description}>
                    <Icon
                        as={InfoIcon}
                        ml="10%"
                        w="0.875rem "
                        color="#016FB9"
                    />
                </Tooltip>
            </Flex>
            <NumberInput
                maxW="120px"
                mr="1rem"
                value={!+value[name] ? 0 : value[name]}
                onChange={(e) => {
                    setValue({
                        ...value,
                        [name]: +e,
                    });
                }}
                size="sm"
                min={0}
                max={Infinity}
            >
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
        </Box>
    );
};

export default NumberInputInitialConditions;
