import { Box, Container, Stack, Text } from "@chakra-ui/react";

import createIdComponent from "utils/createIdcomponent";

export default function Footer() {
    return (
        <Box bg="#16609E" color="white" w="100%" maxHeight="8vh">
            <Container
                as={Stack}
                w="100%"
                py={4}
                direction={{ base: "column", md: "row" }}
                spacing={4}
                justify={{ base: "center", md: "space-between" }}
                align={{ base: "center", md: "center" }}
                maxHeight="8vh"
            >
                <Text>
                    Computational Biology Laboratory (DLab), Fundación Ciencia &
                    Vida
                </Text>
            </Container>
        </Box>
    );
}
