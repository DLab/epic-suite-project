import { Box, Heading, Flex, Text, Center, Link, Icon } from "@chakra-ui/react";

import MicroscopeIcon from "../components/icons/MicroscopeIcon";
import WomanMedicalIcon from "../components/icons/WomanMedicalIcon";
import createIdComponent from "../utils/createIdcomponent";

const Page404 = () => {
    return (
        <Flex
            id={createIdComponent()}
            direction="column"
            marginY={4}
            h="79vh"
            align="center"
            justify="center"
        >
            <Icon
                id={createIdComponent()}
                as={WomanMedicalIcon}
                w={250}
                h={250}
                aria-label="Woman medical Icon"
                fill="none"
            />
            <Heading id={createIdComponent()} textAlign="center">
                Page not Found!{" "}
            </Heading>
            <Text id={createIdComponent()}>
                The page you are looking for does not exist
            </Text>
            <Box id={createIdComponent()} pt="5">
                <Center id={createIdComponent()}>
                    <Link
                        id={createIdComponent()}
                        pl="2"
                        href="/"
                        color="blue.700"
                        variant="ghost"
                    >
                        Home Page
                    </Link>
                    <Icon
                        id={createIdComponent()}
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

export default Page404;
