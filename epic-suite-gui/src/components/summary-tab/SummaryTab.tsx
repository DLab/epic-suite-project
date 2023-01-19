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
            {isVisible ? (
                <Box
                    bg="white"
                    maxH="60vh"
                    overflowY="auto"
                    border="1px solid #DDDDDD"
                    borderRadius="8px"
                    p="20px"
                    m=" 15px 0"
                >
                    <Text fontSize="40px" fontWeight={800} color="#1B1B3A">
                        Epidemiological Modeling and Simulation
                    </Text>
                    <Text>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat.
                    </Text>
                </Box>
            ) : (
                // <Alert
                //     mb="1rem"
                //     status="info"
                //     borderRadius="8px"
                //     justifyContent="space-between"
                //     p="10px"
                // >
                //     <Box>
                //         <AlertDescription color="#1B1B3A">
                //             Select all the models to simulate.
                //         </AlertDescription>
                //     </Box>
                //     <CloseButton
                //         alignSelf="flex-start"
                //         position="relative"
                //         right={-1}
                //         top={-1}
                //         onClick={onClose}
                //         color="#FFFFFF"
                //     />
                // </Alert>
                <Button onClick={onOpen}>Show Alert</Button>
            )}
            <Flex
                display="grid"
                gridTemplateColumns="auto auto auto auto auto"
                gridColumnGap="35px"
            >
                <TableSimulations />
                <TableGeographic />
            </Flex>
        </>
    );
};

export default SummaryTab;
