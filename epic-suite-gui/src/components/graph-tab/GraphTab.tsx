import { HStack, Text, Icon } from "@chakra-ui/react";

import ToolsIcon from "components/icons/ToolsIcon";
import createIdComponent from "utils/createIdcomponent";

const GraphTab = () => {
    return (
        <HStack h="100%" w="100%" justify="center" alignItems="center">
            <Icon w={12} h={12} as={ToolsIcon} />
            <Text color="gray.600" fontSize="4xl">
                In construction...
            </Text>
        </HStack>
    );
};

export default GraphTab;
