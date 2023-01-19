import { Flex, Input, Box } from "@chakra-ui/react";
import React, { useContext } from "react";

import { SelectFeature } from "context/SelectFeaturesContext";

import GeoToastMessage1 from "./selectorMap/GeoToastMessage1";

interface Props {
    extentionOption: string;
    setExtentionOption: (value: string) => void;
    geoSelectionName: string;
    setGeoSelectionName: (value: string) => void;
}
const NameAndButtons = ({
    extentionOption,
    setExtentionOption,
    geoSelectionName,
    setGeoSelectionName,
}: Props) => {
    const { mode } = useContext(SelectFeature);

    return (
        <Flex p="0 2%" mt="20px">
            {mode !== "Initial" && (
                <>
                    <Input
                        size="sm"
                        mr="2%"
                        w="350px"
                        bg="#ffffff"
                        fontSize="14px"
                        placeholder="Name"
                        value={geoSelectionName}
                        onChange={(e) => {
                            setGeoSelectionName(e.target.value);
                        }}
                    />
                    <Box textAlign="center">
                        <GeoToastMessage1
                            scale={extentionOption}
                            setScale={setExtentionOption}
                            geoSelectionName={geoSelectionName}
                        />
                    </Box>
                </>
            )}
        </Flex>
    );
};

export default NameAndButtons;
