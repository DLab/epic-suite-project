import { Flex, Input, Box } from "@chakra-ui/react";
import React, { useContext } from "react";

import GeoToastMessage1 from "components/geo-tab/selectorMap/GeoToastMessage1";
import SelectorMap1 from "components/geo-tab/selectorMap/SelectorMap1";
import SelectedFeaturesPanel1 from "components/side-selector-feature/SelectedFeaturesPanel1";
import { SelectFeature } from "context/SelectFeaturesContext";

interface Props {
    extentionOption: string;
    setExtentionOption: (value: string) => void;
}

const SetUpSelection = ({ extentionOption, setExtentionOption }: Props) => {
    const { mode } = useContext(SelectFeature);

    return (
        <Flex direction="column" w="30%" p="0 2%">
            {mode !== "Initial" && (
                <>
                    <SelectorMap1
                        extentionOption={extentionOption}
                        setExtentionOption={setExtentionOption}
                    />
                    {(extentionOption === "States" ||
                        extentionOption === "Counties") && (
                        <SelectedFeaturesPanel1 scale={extentionOption} />
                    )}
                </>
            )}
        </Flex>
    );
};

export default SetUpSelection;
