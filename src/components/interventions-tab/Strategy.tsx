/* eslint-disable sonarjs/no-identical-functions */
import { CloseIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Text,
} from "@chakra-ui/react";
import React from "react";

import {
    NonpharmaceuticalSubStrategy,
    PharmaceuticalSubStrategy,
} from "types/InterventionsTypes";
import type {
    TypeStrategy,
    InterventionsTypes,
} from "types/InterventionsTypes";

// Resolve Repeated Functions

type StrategyType = {
    type?: TypeStrategy;
    subtype?: PharmaceuticalSubStrategy | NonpharmaceuticalSubStrategy;
    setStrategy: (val: unknown) => void;
    position: number;
    data: InterventionsTypes;
    setData: (val: unknown) => void;
};

const Strategy = ({
    type,
    subtype,
    setStrategy,
    position,
    data,
    setData,
}: StrategyType) => {
    const handleDeleteIntervention = () => {
        setStrategy((prev) => prev.filter((_e, i) => i !== position));
        setData((prev) => prev.filter((_e, i) => i !== position));
    };
    switch (subtype) {
        case PharmaceuticalSubStrategy.Vaccination:
            return (
                <Flex w="90%" justify="space-between" mb="0.5rem">
                    <Flex w="90%">
                        <Heading
                            alignSelf="center"
                            w="20%"
                            size="0.2rem"
                            as="h6"
                            mr="1rem"
                        >
                            {PharmaceuticalSubStrategy.Vaccination}
                        </Heading>
                        <HStack>
                            <Flex alignItems="center">
                                <Box>
                                    <Text align="left" fontSize="14px" w="80px">
                                        Vac_eff
                                    </Text>
                                </Box>
                                <NumberInput
                                    maxW="75px"
                                    value={
                                        data?.subtype?.config?.details
                                            ?.vacEff as number
                                    }
                                    onChange={(e) => {
                                        setData((prev) =>
                                            prev.map((interv, i) => {
                                                if (i === position) {
                                                    return {
                                                        ...interv,
                                                        subtype: {
                                                            ...interv.subtype,
                                                            config: {
                                                                ...interv
                                                                    .subtype
                                                                    .config,
                                                                details: {
                                                                    ...interv
                                                                        .subtype
                                                                        .config
                                                                        .details,
                                                                    vacEff: +e,
                                                                },
                                                            },
                                                        },
                                                    };
                                                }
                                                return interv;
                                            })
                                        );
                                    }}
                                    size="sm"
                                    min={0}
                                    max={1}
                                    step={0.1}
                                >
                                    <NumberInputField borderRadius="6px" />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </Flex>
                            <Flex alignItems="center">
                                <Box>
                                    <Text align="left" fontSize="14px" w="80px">
                                        Vac_beta
                                    </Text>
                                </Box>
                                <NumberInput
                                    maxW="75px"
                                    value={
                                        data?.subtype?.config?.details
                                            ?.vacBeta as number
                                    }
                                    onChange={(e) => {
                                        setData((prev) =>
                                            prev.map((interv, i) => {
                                                if (i === position) {
                                                    return {
                                                        ...interv,
                                                        subtype: {
                                                            ...interv.subtype,
                                                            config: {
                                                                ...interv
                                                                    .subtype
                                                                    .config,
                                                                details: {
                                                                    ...interv
                                                                        .subtype
                                                                        .config
                                                                        .details,
                                                                    vacBeta: +e,
                                                                },
                                                            },
                                                        },
                                                    };
                                                }
                                                return interv;
                                            })
                                        );
                                    }}
                                    size="sm"
                                    min={0}
                                    max={1}
                                    step={0.1}
                                >
                                    <NumberInputField borderRadius="6px" />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </Flex>
                            <Flex alignItems="center">
                                <Box>
                                    <Text align="left" fontSize="14px" w="80px">
                                        Init
                                    </Text>
                                </Box>
                                <NumberInput
                                    maxW="75px"
                                    value={
                                        data?.subtype?.config?.start as number
                                    }
                                    onChange={(e) => {
                                        setData((prev) =>
                                            prev.map((interv, i) => {
                                                if (i === position) {
                                                    return {
                                                        ...interv,
                                                        subtype: {
                                                            ...interv.subtype,
                                                            config: {
                                                                ...interv
                                                                    .subtype
                                                                    .config,
                                                                start: +e,
                                                            },
                                                        },
                                                    };
                                                }
                                                return interv;
                                            })
                                        );
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
                            <Flex alignItems="center">
                                <Box>
                                    <Text align="left" fontSize="14px" w="80px">
                                        End
                                    </Text>
                                </Box>
                                <NumberInput
                                    maxW="75px"
                                    value={data?.subtype?.config?.end as number}
                                    onChange={(e) => {
                                        setData((prev) =>
                                            prev.map((interv, i) => {
                                                if (i === position) {
                                                    return {
                                                        ...interv,
                                                        subtype: {
                                                            ...interv.subtype,
                                                            config: {
                                                                ...interv
                                                                    .subtype
                                                                    .config,
                                                                end: +e,
                                                            },
                                                        },
                                                    };
                                                }
                                                return interv;
                                            })
                                        );
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
                        </HStack>
                    </Flex>
                    <Button
                        bg="#8080A0"
                        onClick={handleDeleteIntervention}
                        _hover={{ cursor: "pointer" }}
                        size="xs"
                    >
                        <CloseIcon alignSelf="center" w="10px" color="white" />
                    </Button>
                </Flex>
            );
        case NonpharmaceuticalSubStrategy.CordonSanitaire:
            return (
                <Flex w="90%" justify="space-between" mb="0.5rem">
                    <Flex w="90%">
                        <Heading
                            alignSelf="center"
                            w="20%"
                            size="0.2rem"
                            as="h6"
                            mr="1rem"
                        >
                            {NonpharmaceuticalSubStrategy.CordonSanitaire}
                        </Heading>
                        <HStack>
                            <Flex alignItems="center">
                                <Box>
                                    <Text align="left" fontSize="14px" w="80px">
                                        Mov_red
                                    </Text>
                                </Box>
                                <NumberInput
                                    maxW="75px"
                                    value={
                                        data?.subtype?.config?.details
                                            ?.mobRed as number
                                    }
                                    onChange={(e) => {
                                        setData((prev) =>
                                            prev.map((interv, i) => {
                                                if (i === position) {
                                                    return {
                                                        ...interv,
                                                        subtype: {
                                                            ...interv.subtype,
                                                            config: {
                                                                ...interv
                                                                    .subtype
                                                                    .config,
                                                                details: {
                                                                    ...interv
                                                                        .subtype
                                                                        .config
                                                                        .details,
                                                                    mobRed: +e,
                                                                },
                                                            },
                                                        },
                                                    };
                                                }
                                                return interv;
                                            })
                                        );
                                    }}
                                    size="sm"
                                    min={0}
                                    max={1}
                                    step={0.1}
                                >
                                    <NumberInputField borderRadius="6px" />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </Flex>
                            <Flex alignItems="center">
                                <Box>
                                    <Text align="left" fontSize="14px" w="80px">
                                        Init
                                    </Text>
                                </Box>
                                <NumberInput
                                    maxW="75px"
                                    value={
                                        data?.subtype?.config?.start as number
                                    }
                                    onChange={(e) => {
                                        setData((prev) =>
                                            prev.map((interv, i) => {
                                                if (i === position) {
                                                    return {
                                                        ...interv,
                                                        subtype: {
                                                            ...interv.subtype,
                                                            config: {
                                                                ...interv
                                                                    .subtype
                                                                    .config,
                                                                start: +e,
                                                            },
                                                        },
                                                    };
                                                }
                                                return interv;
                                            })
                                        );
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
                            <Flex alignItems="center">
                                <Box>
                                    <Text align="left" fontSize="14px" w="80px">
                                        End
                                    </Text>
                                </Box>
                                <NumberInput
                                    maxW="75px"
                                    value={data?.subtype?.config?.end as number}
                                    onChange={(e) => {
                                        setData((prev) =>
                                            prev.map((interv, i) => {
                                                if (i === position) {
                                                    return {
                                                        ...interv,
                                                        subtype: {
                                                            ...interv.subtype,
                                                            config: {
                                                                ...interv
                                                                    .subtype
                                                                    .config,
                                                                end: +e,
                                                            },
                                                        },
                                                    };
                                                }
                                                return interv;
                                            })
                                        );
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
                        </HStack>
                    </Flex>
                    <Button
                        bg="#8080A0"
                        onClick={handleDeleteIntervention}
                        _hover={{ cursor: "pointer" }}
                        size="xs"
                    >
                        <CloseIcon alignSelf="center" w="10px" color="white" />
                    </Button>
                </Flex>
            );
        case NonpharmaceuticalSubStrategy.LockDown:
            return (
                <Flex w="90%" justify="space-between" mb="0.5rem">
                    <Flex w="90%">
                        <Heading w="20%" size="0.2rem" as="h6" mr="1rem">
                            {NonpharmaceuticalSubStrategy.LockDown}
                        </Heading>
                        <HStack>
                            <Flex alignItems="center">
                                <Box>
                                    <Text align="left" fontSize="14px" w="80px">
                                        Mov_red
                                    </Text>
                                </Box>
                                <NumberInput
                                    maxW="75px"
                                    value={
                                        data?.subtype?.config?.details
                                            ?.mobRed as number
                                    }
                                    onChange={(e) => {
                                        setData((prev) =>
                                            prev.map((interv, i) => {
                                                if (i === position) {
                                                    return {
                                                        ...interv,
                                                        subtype: {
                                                            ...interv.subtype,
                                                            config: {
                                                                ...interv
                                                                    .subtype
                                                                    .config,
                                                                details: {
                                                                    ...interv
                                                                        .subtype
                                                                        .config
                                                                        .details,
                                                                    mobRed: +e,
                                                                },
                                                            },
                                                        },
                                                    };
                                                }
                                                return interv;
                                            })
                                        );
                                    }}
                                    size="sm"
                                    min={0}
                                    max={1}
                                    step={0.1}
                                >
                                    <NumberInputField borderRadius="6px" />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </Flex>
                            <Flex alignItems="center">
                                <Box>
                                    <Text align="left" fontSize="14px" w="80px">
                                        Init
                                    </Text>
                                </Box>
                                <NumberInput
                                    maxW="75px"
                                    value={
                                        data?.subtype?.config?.start as number
                                    }
                                    onChange={(e) => {
                                        setData((prev) =>
                                            prev.map((interv, i) => {
                                                if (i === position) {
                                                    return {
                                                        ...interv,
                                                        subtype: {
                                                            ...interv.subtype,
                                                            config: {
                                                                ...interv
                                                                    .subtype
                                                                    .config,
                                                                start: +e,
                                                            },
                                                        },
                                                    };
                                                }
                                                return interv;
                                            })
                                        );
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
                            <Flex alignItems="center">
                                <Box>
                                    <Text align="left" fontSize="14px" w="80px">
                                        End
                                    </Text>
                                </Box>
                                <NumberInput
                                    maxW="75px"
                                    value={data?.subtype?.config?.end as number}
                                    onChange={(e) => {
                                        setData((prev) =>
                                            prev.map((interv, i) => {
                                                if (i === position) {
                                                    return {
                                                        ...interv,
                                                        subtype: {
                                                            ...interv.subtype,
                                                            config: {
                                                                ...interv
                                                                    .subtype
                                                                    .config,
                                                                end: +e,
                                                            },
                                                        },
                                                    };
                                                }
                                                return interv;
                                            })
                                        );
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
                        </HStack>
                    </Flex>
                    <Button
                        bg="#8080A0"
                        onClick={handleDeleteIntervention}
                        _hover={{ cursor: "pointer" }}
                        size="xs"
                    >
                        <CloseIcon alignSelf="center" w="10px" color="white" />
                    </Button>
                </Flex>
            );
        default:
            return <Box />;
    }
};

export default Strategy;
