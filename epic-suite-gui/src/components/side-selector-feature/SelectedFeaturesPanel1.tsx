import { Box, Text } from "@chakra-ui/react";
import { useContext } from "react";

import { SelectFeature } from "context/SelectFeaturesContext";
import createIdComponent from "utils/createIdcomponent";

import StatesSelectedCheckbox from "./StatesSelectedCheckbox";

interface Props {
    scale: string;
}
/**
 * Component that shows the selection of areas for geographic spaces.
 * @component
 */
const SelectedFeaturesPanel1 = ({ scale }: Props) => {
    const { counties, states } = useContext(SelectFeature);
    return (
        <Box mt="7%" p="3% 0" overflowY="auto" maxH="22vh">
            {scale === "States" && states.length > 0 && (
                <StatesSelectedCheckbox stateSelected={states} />
            )}
            {scale === "States" && states.length <= 0 && (
                <Text fontSize="0.875rem"> No states selected</Text>
            )}
            {scale === "Counties" && counties.length > 0 && (
                <StatesSelectedCheckbox countiesSelected={counties} />
            )}
            {scale === "Counties" && counties.length <= 0 && (
                <Text id={createIdComponent()} fontSize="0.875rem">
                    {" "}
                    No counties
                </Text>
            )}
        </Box>
    );
};

export default SelectedFeaturesPanel1;
