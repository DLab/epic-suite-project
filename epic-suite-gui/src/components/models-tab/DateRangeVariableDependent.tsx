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
        <Flex w="80%" justifyContent="space-between" alignItems="center">
            Init:
            <NumberInput
                min={0}
                ml="0.2rem"
                w="35%"
                size="xs"
                isInvalid={id !== 0 && initVal - beforeRange < 0}
                value={initVal}
                onChange={(e) => setInitVal(+e)}
                isDisabled={!isRangeUpdating || idRangeUpdating !== id}
            >
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
            End:
            <NumberInput
                min={0}
                ml="0.2rem"
                w="35%"
                size="xs"
                value={endVal}
                onChange={(e) => setEndVal(+e)}
                isDisabled={!isRangeUpdating || idRangeUpdating !== id}
            >
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
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
        </Flex>
    );
};
export default DateRangeVariableDependent;
