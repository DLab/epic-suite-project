/* eslint-disable sonarjs/no-duplicate-string */
import {
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Box,
    Text,
    Button,
    ButtonGroup,
    Flex,
    Stack,
    Radio,
    RadioGroup,
    useToast,
} from "@chakra-ui/react";
import { useState } from "react";

import {
    TransitionFunction,
    TypePhase,
} from "../../types/VariableDependentTime";

interface DataSetters {
    id: number;
    setVal: (values: unknown) => void;
    close: () => void;
}

interface StaticsProps extends DataSetters {
    value: number;
}
interface SineProps extends DataSetters {
    min: number;
    max: number;
    period: number;
    initPhase: TypePhase;
}
interface SquareProps extends SineProps {
    duty: number;
}
interface TransProps extends DataSetters {
    initvalue: number;
    endvalue: number;
    concavity: number;
    ftype: TransitionFunction;
}

export const StaticInputs = ({ value, id, setVal, close }: StaticsProps) => {
    const [state, setstate] = useState<string>(`${value}`);
    return (
        <Flex alignItems="center">
            <Text>Static Value:</Text>
            <NumberInput
                w="30%"
                ml="0.5"
                size="sm"
                min={0}
                step={0.01}
                value={state}
                onChange={(e) => setstate(e)}
            >
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
            <ButtonGroup mt={1} d="flex" justifyContent="flex-end">
                <Button
                    size="xs"
                    onClick={() => {
                        setVal({
                            type: "editElement",
                            index: id,
                            payloadTypeElement: {
                                name: "static",
                                value: +state,
                            },
                        });
                        close();
                    }}
                >
                    Set
                </Button>
                <Button size="xs" onClick={() => close()}>
                    Cancel
                </Button>
            </ButtonGroup>
        </Flex>
    );
};

export const SinoInputs = ({
    min,
    max,
    period,
    initPhase,
    id,
    setVal,
    close,
}: SineProps) => {
    const [minVal, setMinVal] = useState(`${min}`);
    const [maxVal, setMaxVal] = useState<string>(`${max}`);
    const [periodVal, setPeriodVal] = useState(period);
    const [initPhaseVal, setInitPhaseVal] = useState<number>(initPhase);
    const toast = useToast();
    return (
        <Flex direction="column">
            <Text>Sinusoidal</Text>
            <Flex wrap="wrap" direction="column">
                <Flex>
                    Min:
                    <NumberInput
                        w="35%"
                        size="xs"
                        value={minVal}
                        min={0}
                        step={0.01}
                        onChange={(e) => setMinVal(e)}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </Flex>
                <Flex>
                    Max:
                    <NumberInput
                        w="35%"
                        size="xs"
                        value={maxVal}
                        min={0}
                        step={0.01}
                        isInvalid={maxVal <= minVal}
                        onChange={(e) => setMaxVal(e)}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </Flex>
                <Flex>
                    Period:
                    <NumberInput
                        w="35%"
                        size="xs"
                        value={periodVal}
                        min={0}
                        step={0.01}
                        onChange={(e) => setPeriodVal(+e)}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </Flex>
                <Flex>
                    InitPhase:
                    <RadioGroup
                        value={initPhaseVal}
                        size="sm"
                        onChange={(e) => {
                            if (+e === TypePhase.min) {
                                setInitPhaseVal(TypePhase.min);
                            } else {
                                setInitPhaseVal(TypePhase.max);
                            }
                        }}
                    >
                        <Stack direction="row">
                            <Radio value={TypePhase.min}>min</Radio>
                            <Radio value={TypePhase.max}>max</Radio>
                        </Stack>
                    </RadioGroup>
                </Flex>
            </Flex>
            <ButtonGroup d="flex" justifyContent="flex-end">
                <Button
                    size="xs"
                    onClick={() => {
                        if (minVal >= maxVal) {
                            toast({
                                title: "Failed setting function",
                                description:
                                    "min must to be lesser than max. Fix it for setting please!",
                                status: "error",
                                duration: 4000,
                                isClosable: true,
                                position: "bottom-right",
                            });
                        } else {
                            setVal({
                                type: "editElement",
                                index: id,
                                payloadTypeElement: {
                                    name: "sinusoidal",
                                    min: +minVal,
                                    max: +maxVal,
                                    period: periodVal,
                                    initPhase: initPhaseVal,
                                },
                            });
                            close();
                        }
                    }}
                >
                    Set
                </Button>
                <Button size="xs" onClick={() => close()}>
                    Cancel
                </Button>
            </ButtonGroup>
        </Flex>
    );
};
export const SquareInputs = ({
    min,
    max,
    period,
    initPhase,
    duty,
    id,
    setVal,
    close,
}: SquareProps) => {
    const [minVal, setMinVal] = useState<string>(`${min}`);
    const [maxVal, setMaxVal] = useState<string>(`${max}`);
    const [periodVal, setPeriodVal] = useState<number>(period);
    const [initPhaseVal, setInitPhaseVal] = useState<number>(initPhase);
    const [dutyVal, setDutyVal] = useState<string>(`${duty}`);
    const toast = useToast();
    return (
        <Flex direction="column">
            <Text>Square</Text>
            <Flex wrap="wrap">
                Min:
                <NumberInput
                    size="xs"
                    value={minVal}
                    onChange={(e) => setMinVal(e)}
                    w="35%"
                    min={0}
                    step={0.01}
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                Max:
                <NumberInput
                    size="xs"
                    value={maxVal}
                    onChange={(e) => setMaxVal(e)}
                    w="35%"
                    min={0}
                    step={0.01}
                    isInvalid={maxVal <= minVal}
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                Period:
                <NumberInput
                    size="xs"
                    value={periodVal}
                    onChange={(e) => setPeriodVal(+e)}
                    w="35%"
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                Duty:
                <NumberInput
                    precision={2}
                    w="35%"
                    size="xs"
                    value={dutyVal}
                    min={0}
                    step={0.01}
                    max={1}
                    onChange={(e) => setDutyVal(e)}
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                InitPhase:
                <RadioGroup
                    defaultValue={initPhaseVal}
                    value={initPhaseVal}
                    // eslint-disable-next-line sonarjs/no-identical-functions
                    onChange={(e) => {
                        if (+e === TypePhase.min) {
                            setInitPhaseVal(TypePhase.min);
                        } else {
                            setInitPhaseVal(TypePhase.max);
                        }
                    }}
                >
                    <Stack direction="row">
                        <Radio value={TypePhase.min}>Min</Radio>
                        <Radio value={TypePhase.max}>Max</Radio>
                    </Stack>
                </RadioGroup>
            </Flex>
            <ButtonGroup d="flex" justifyContent="flex-end">
                <Button
                    size="xs"
                    onClick={() => {
                        if (+minVal >= +maxVal) {
                            toast({
                                title: "Failed setting function",
                                description:
                                    "min must to be lesser than max. Fix it for setting please!",
                                status: "error",
                                duration: 4000,
                                isClosable: true,
                                position: "bottom-right",
                            });
                        } else {
                            setVal({
                                type: "editElement",
                                index: id,
                                payloadTypeElement: {
                                    name: "square",
                                    min: +minVal,
                                    max: +maxVal,
                                    period: periodVal,
                                    initPhase: +initPhaseVal,
                                    duty: +dutyVal,
                                },
                            });
                            close();
                        }
                    }}
                >
                    Set
                </Button>
                <Button size="xs" onClick={() => close()}>
                    Cancel
                </Button>
            </ButtonGroup>
        </Flex>
    );
};
export const TransitionInputs = ({
    ftype,
    initvalue,
    endvalue,
    concavity,
    id,
    setVal,
    close,
}: TransProps) => {
    const [transitionVal, setTransitionVal] =
        useState<TransitionFunction>(ftype);
    const [initVal, setInitVal] = useState<string>(`${initvalue}`);
    const [endVal, setEndVal] = useState<string>(`${endvalue}`);
    const [concavityVal, setConcavityVal] = useState<number>(concavity);
    const toast = useToast();
    return (
        <Flex direction="column" p="0.5rem">
            <Text>Transition</Text>
            <RadioGroup
                value={transitionVal}
                // eslint-disable-next-line sonarjs/no-identical-functions
                onChange={(e) => {
                    if (+e === 0) {
                        setTransitionVal(TransitionFunction.linear);
                    } else if (+e === 1) {
                        setTransitionVal(TransitionFunction.quadratic);
                    } else {
                        setTransitionVal(TransitionFunction.sigmoidal);
                    }
                }}
            >
                <Stack direction="row">
                    <Radio value={TransitionFunction.linear}>Linear</Radio>
                    <Radio value={TransitionFunction.quadratic}>
                        Quadratic
                    </Radio>
                    <Radio value={TransitionFunction.sigmoidal}>
                        Sigmoidal
                    </Radio>
                </Stack>
            </RadioGroup>
            <Flex wrap="wrap">
                initial value:
                <NumberInput
                    w="35%"
                    size="xs"
                    value={initVal}
                    min={0}
                    step={0.01}
                    onChange={(e) => setInitVal(e)}
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                End value:
                <NumberInput
                    w="35%"
                    size="xs"
                    value={endVal}
                    min={0}
                    step={0.01}
                    onChange={(e) => setEndVal(e)}
                    isInvalid={endVal <= initVal}
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                <Flex>
                    {transitionVal === 1 && (
                        <>
                            Concavity:
                            <RadioGroup
                                value={concavityVal}
                                // eslint-disable-next-line sonarjs/no-identical-functions
                                onChange={(e) => {
                                    setConcavityVal(+e);
                                }}
                            >
                                <Stack direction="row">
                                    <Radio value={0}>Concave</Radio>
                                    <Radio value={1}>Convex</Radio>
                                </Stack>
                            </RadioGroup>
                        </>
                    )}
                </Flex>
            </Flex>
            <ButtonGroup d="flex" justifyContent="flex-end" mt="0.5">
                <Button
                    size="xs"
                    onClick={() => {
                        if (initVal >= endVal) {
                            toast({
                                title: "Failed setting function",
                                description:
                                    "min must to be lesser than max. Fix it for setting please!",
                                status: "error",
                                duration: 4000,
                                isClosable: true,
                                position: "bottom-right",
                            });
                        } else {
                            setVal({
                                type: "editElement",
                                index: id,
                                payloadTypeElement: {
                                    name: "transition",
                                    initvalue: +initVal,
                                    endvalue: +endVal,
                                    ftype: +transitionVal,
                                    concavity: +concavityVal,
                                },
                            });
                            close();
                        }
                    }}
                >
                    Set
                </Button>
                <Button size="xs" onClick={() => close()}>
                    Cancel
                </Button>
            </ButtonGroup>
        </Flex>
    );
};
