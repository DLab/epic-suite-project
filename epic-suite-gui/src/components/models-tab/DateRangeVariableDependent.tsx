import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
    Box,
    Flex,
    IconButton,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
} from "@chakra-ui/react";
import { useState } from "react";

interface Props {
    init: number;
    end: number;
    id: number;
    beforeRange: number;
    setDate: (SetDate) => void;
    handleInput: HandleInput;
    idRangeUpdating: number;
    isRangeUpdating: boolean;
}
interface SetDate {
    type: string;
    payload: number[];
    id: number;
}
interface HandleInput {
    setId: (value: number) => void;
    setIsRange: (value: boolean) => void;
}
const DateRangeVariableDependent = ({
    init,
    end,
    id,
    setDate,
    handleInput,
    idRangeUpdating,
    isRangeUpdating,
    beforeRange,
}: Props) => {
    const [initVal, setInitVal] = useState(init);
    const [endVal, setEndVal] = useState(end);
    return (
        <>
            <NumberInput
                min={0}
                ml="0.2rem"
                mr="0.2rem"
                w="10rem"
                size="sm"
                isInvalid={id !== 0 && initVal - beforeRange < 0}
                value={initVal}
                onChange={(e) => setInitVal(+e)}
                isDisabled={!isRangeUpdating || idRangeUpdating !== id}
            >
                <NumberInputField borderRadius="6px" />
            </NumberInput>
            <NumberInput
                min={0}
                size="sm"
                w="10rem"
                value={endVal}
                onChange={(e) => setEndVal(+e)}
                isDisabled={!isRangeUpdating || idRangeUpdating !== id}
            >
                <NumberInputField borderRadius="6px" />
            </NumberInput>
            <Box w="3rem">
                {idRangeUpdating === id && (
                    <>
                        <IconButton
                            bg="white"
                            border="thin"
                            color="teal.500"
                            aria-label="Check date range button"
                            size="xs"
                            cursor="pointer"
                            icon={<CheckIcon />}
                            onClick={() => {
                                setDate({
                                    type: "updateDay",
                                    range: [initVal, endVal],
                                    index: id,
                                });
                                handleInput.setId(-1);
                                handleInput.setIsRange(false);
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
                                handleInput.setId(-1);
                                handleInput.setIsRange(false);
                            }}
                        />
                    </>
                )}
            </Box>
        </>
    );
};
export default DateRangeVariableDependent;
