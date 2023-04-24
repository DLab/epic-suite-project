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
                <Heading
                    size="4xl"
                    fontSize="40px"
                    fontWeight="extrabold"
                    lineHeight="54px"
                    letterSpacing="-0.02em"
                    color="#1B1B3A"
                >
                    Epidemiological Modeling and Simulation
                </Heading>
                <Text fontSize="0.875rem" p="0.3rem">
                    Welcome to our epidemiological simulation platform! Before
                    starting, you must create and define your model's
                    configuration. Additionally, if you want to customize your
                    simulation, you can choose geographic areas to establish
                    initial conditions and use mobility matrices in
                    metapopulation models. Explore all these options to get more
                    accurate and useful results in your epidemiological
                    simulation!
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
                {/* descomentar esto */}
                <Flex>
                    <TableMobilityMatrix />
                </Flex>
            </Flex>
        </>
    );
};

export default SummaryTab;
