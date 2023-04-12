/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-nested-ternary */
import { CloseIcon } from "@chakra-ui/icons";
import {
    Box,
    Flex,
    Heading,
    IconButton,
    Stat,
    StatGroup,
    StatLabel,
    StatNumber,
} from "@chakra-ui/react";

import { NameFunction } from "types/VariableDependentTime";
import type VariableDependentTime from "types/VariableDependentTime";
import showOnlySelectedAttributes, {
    findValueByKeyInMatrix,
    getSubTypeTransitionFunction,
} from "utils/showOnlySelectedAttributes";

type EmptyObject = Record<string, never>;

interface Props {
    data: VariableDependentTime | Record<string, never>;
    close: (value: boolean) => void;
}

const ViewVariableDependentTime = ({ data, close }: Props) => {
    return (
        <Box px="10" py="1rem" borderRadius="6px" boxShadow="sm" bg="#fffff">
            <Heading textAlign="justify">
                <Flex justifyContent="space-between" alignItems="center">
                    {data.name.toLocaleUpperCase()}{" "}
                    <IconButton
                        aria-label="Close Panel"
                        as={CloseIcon}
                        onClick={() => close(false)}
                        size="xs"
                    />
                </Flex>
            </Heading>
            {data.rangeDays.map((range, i) => (
                <>
                    <StatGroup w="50vw">
                        <Stat>
                            <StatLabel>Range: </StatLabel>
                            <StatNumber>{i + 1}</StatNumber>
                        </Stat>
                        <Stat>
                            <StatLabel>Init: </StatLabel>
                            <StatNumber>{range[0]}</StatNumber>
                        </Stat>
                        <Stat>
                            <StatLabel>End: </StatLabel>
                            <StatNumber>{range[1]}</StatNumber>
                        </Stat>
                        <Stat>
                            <StatLabel>Type Function: </StatLabel>
                            <StatNumber>{data.type[i].name}</StatNumber>
                        </Stat>
                        <Stat>
                            <StatLabel>Default: </StatLabel>
                            <StatNumber>{data.default}</StatNumber>
                        </Stat>
                    </StatGroup>
                    <StatGroup>
                        {Object.entries(data.type[i]).map(
                            ([key, values], _i, array) => {
                                if (
                                    key === "gw" &&
                                    !findValueByKeyInMatrix(array, "ftype", 1)
                                ) {
                                    return (
                                        <Stat>
                                            <StatLabel>{key}</StatLabel>
                                            <StatLabel>-</StatLabel>
                                        </Stat>
                                    );
                                }

                                if (key !== "name") {
                                    return (
                                        <Stat>
                                            <StatLabel>{key}</StatLabel>
                                            <StatNumber>
                                                <>
                                                    {showOnlySelectedAttributes(
                                                        key,
                                                        values,
                                                        getSubTypeTransitionFunction
                                                    )}
                                                </>
                                            </StatNumber>
                                        </Stat>
                                    );
                                }
                                return <Box />;
                            }
                        )}
                    </StatGroup>
                </>
            ))}
        </Box>
    );
};

export default ViewVariableDependentTime;
