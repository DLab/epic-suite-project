import { InfoIcon, WarningIcon, WarningTwoIcon } from "@chakra-ui/icons";
import { Box, Flex, HStack, Icon, Select, Tooltip } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";

import { MobilityMatrix } from "context/MobilityMatrixContext";
import { NewModelSetted } from "context/NewModelsContext";
import { MobilityModes } from "types/MobilityMatrixTypes";
import type {
    NewModelsAllParams,
    NewModelsParams,
} from "types/SimulationTypes";

interface Props {
    setMatrixType: (value: string) => void;
    setIsDynamical: (value: boolean) => void;
}

const ModelsMobilityMatrixSelect = ({
    setMatrixType,
    setIsDynamical,
}: Props) => {
    const { newModel } = useContext(NewModelSetted);
    const { setIdMatrixModel, idMatrixModel } = useContext(MobilityMatrix);
    const [metaModelsList, setMetaModelsList] = useState([]);
    const [isSelectDisabeld, setIsSelectDisabeld] = useState(false);

    useEffect(() => {
        setMetaModelsList(
            newModel.filter(
                (model: NewModelsParams) =>
                    model.populationType === "metapopulation"
            )
        );
    }, [newModel]);

    useEffect(() => {
        if (idMatrixModel !== 0) {
            setIsSelectDisabeld(true);
        }
    }, [idMatrixModel]);

    return (
        <Flex pb="1rem" alignItems="center">
            <Select
                w="50%"
                size="sm"
                mr="15px"
                placeholder="Select model"
                bg="#F4F4F4"
                borderColor="#F4F4F4"
                borderRadius="8px"
                value={idMatrixModel}
                isDisabled={isSelectDisabeld}
                onChange={(e) => {
                    if (!e.target.value) {
                        setIdMatrixModel(0);
                    } else {
                        setIdMatrixModel(+e.target.value);
                    }
                    setMatrixType("");
                    setIsDynamical(false);
                }}
            >
                {metaModelsList.map((model: NewModelsParams) => {
                    return (
                        <option key={model.idNewModel} value={model.idNewModel}>
                            {model.name}
                        </option>
                    );
                })}
            </Select>{" "}
            {metaModelsList.length === 0 && (
                <Tooltip label="Please, create you a metapopulation model before to get a mobility matrix">
                    <Icon
                        as={WarningTwoIcon}
                        ml="0.3"
                        w="0.875rem "
                        color="#016FB9"
                    />
                </Tooltip>
            )}
        </Flex>
    );
};

export default ModelsMobilityMatrixSelect;
