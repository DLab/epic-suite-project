import { Box, Center, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import type { NextPageContext } from "next";

import MicroscopeIcon from "components/icons/MicroscopeIcon";
import WomanMedicalIcon from "components/icons/WomanMedicalIcon";

interface ErrorProps {
    statusCode: number;
}

function ErrorPage({ statusCode }: ErrorProps) {
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
            <Heading textAlign="center">Oops! Something went wrong. </Heading>
            <Text pt="2rem">
                It looks like an error has occurred in the application.
            </Text>
            <Text>
                But don't worry, our engineering team is working hard to fix it.
            </Text>
            <Text>
                In the meantime, you can try refreshing the page or trying again
                later.
            </Text>
        </Flex>
    );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext): ErrorProps => {
    // eslint-disable-next-line no-nested-ternary
    const statusCode = res ? res.statusCode : err ? err.statusCode : 400;
    return { statusCode };
};

export default ErrorPage;
