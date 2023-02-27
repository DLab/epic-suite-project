import {
    Alert,
    AlertDescription,
    AlertIcon,
    Box,
    Text,
    Heading,
    CloseButton,
    useDisclosure,
    Button,
    Flex,
} from "@chakra-ui/react";

import TableGeographic from "./TableGeographic";
import TableMobilityMatrix from "./TableMobilityMatrix";
import TableSimulations from "./TableSimulations";

/**
 * Model summary table container.
 * @category Summary tab
 * @component
 */
const SummaryTab = () => {
    const {
        isOpen: isVisible,
        onClose,
        onOpen,
    } = useDisclosure({ defaultIsOpen: true });
    return (
        <>
            <Box
                bg="white"
                maxH="60vh"
                overflowY="auto"
                border="1px solid #DDDDDD"
                borderRadius="8px"
                p="20px"
                m=" 15px 0"
            >
                <Text fontSize="1.75rem" fontWeight={800} color="#1B1B3A">
                    Epidemiological Modeling and Simulation
                </Text>
                <Text fontSize="0.875rem">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </Text>
            </Box>

            <Flex direction="column">
                <Flex
                    display="grid"
                    gridTemplateColumns="auto auto auto auto auto"
                    gridColumnGap="35px"
                >
                    <TableSimulations />
                    <TableGeographic />
                </Flex>
                <Flex>
                    <TableMobilityMatrix />
                </Flex>
            </Flex>
        </>
    );
};

export default SummaryTab;
