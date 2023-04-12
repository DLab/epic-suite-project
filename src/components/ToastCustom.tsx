/* eslint-disable no-nested-ternary */
import { Box, Divider, Heading, Stack } from "@chakra-ui/react";

import { StatusSimulation } from "types/HardSimulationType";

interface ToastProps {
    title: string;
    status: StatusSimulation;
    children?: React.ReactNode;
}

const ToastCustom = ({ title, status, children }: ToastProps) => (
    <Stack
        color="#ffffff"
        borderRadius="10px"
        w="20rem"
        p="5"
        bg={
            status === StatusSimulation.CANCELED ||
            status === StatusSimulation.ERROR
                ? "#8080A0"
                : status === StatusSimulation.FINISHED
                ? "#005086"
                : "#3EBFE0"
        }
    >
        <Heading fontSize="1.4rem">{title}</Heading>
        <Divider />
        <Box>{children}</Box>
    </Stack>
);
export default ToastCustom;
