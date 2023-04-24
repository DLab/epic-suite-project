import { Box, Heading, Flex, Text, Center, Link, Icon } from "@chakra-ui/react";
import React from "react";

import MicroscopeIcon from "../components/icons/MicroscopeIcon";
import WomanMedicalIcon from "../components/icons/WomanMedicalIcon";

const Page404 = () => {
    return (
        <Flex
            direction="column"
            marginY={4}
            h="79vh"
            align="center"
            justify="center"
        >
            <Icon
                as={WomanMedicalIcon}
                w={250}
                h={250}
                aria-label="Woman medical Icon"
                fill="none"
            />
            <Heading textAlign="center">Page not Found! </Heading>
            <Text>The page you are looking for does not exist</Text>
            <Box pt="5">
                <Center>
                    <Link pl="2" href="/" color="blue.700" variant="ghost">
                        Home Page
                    </Link>
                    <Icon
                        as={MicroscopeIcon}
                        w={8}
                        h={8}
                        aria-label="Microscope Icon"
                        fill="none"
                    />
                </Center>
            </Box>
        </Flex>
    );
};

export default React.memo(Page404);
