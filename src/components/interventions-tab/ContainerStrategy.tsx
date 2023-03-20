import { Box, Flex, Heading } from "@chakra-ui/react";
import React from "react";

type Props = {
    children: React.ReactNode;
};

const ContainerStrategy: React.FC<Props> = ({ children }) => {
    return (
        <Flex
            direction="column"
            w="100%"
            borderRadius="8px"
            boxShadow="sm"
            border="1px solid #DDDDDD"
            mt="0.5rem"
            h="75vh"
            overflowY="auto"
            p="1rem"
        >
            <Heading as="h5" size="lg" pb="1rem">
                Interventions
            </Heading>
            {children}
        </Flex>
    );
};

export default ContainerStrategy;
