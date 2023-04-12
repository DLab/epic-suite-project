import { Flex, Text } from "@chakra-ui/react";
import React from "react";

import type { InterventionsTypes } from "types/MobilityMatrixTypes";

import RangeConfig from "./RangeConfig";

interface Props {
    interventionList: InterventionsTypes[] | [];
    setInterventionList: (value: InterventionsTypes[] | []) => void;
}

const MobilityInterventions = ({
    interventionList,
    setInterventionList,
}: Props) => {
    const addIntervention = () => {
        const intervention = {
            id: Date.now(),
            startRange: 0,
            endRange: 500,
            intervention: "",
            value: 0,
        };

        setInterventionList([...interventionList, intervention]);
    };

    return (
        <Flex direction="column" mt="15px">
            <Flex direction="column" justifyContent="space-between" mb="10px">
                <Text fontSize="1rem" fontWeight={700} mb="15px">
                    Intervention day
                </Text>
                <Flex justify="space-between">
                    <Text fontSize="0.875rem">Range</Text>
                    <Text
                        color="#016FB9"
                        fontSize="0.875rem"
                        textDecorationLine="underline"
                        cursor="pointer"
                        onClick={() => addIntervention()}
                    >
                        + Add new
                    </Text>
                </Flex>
            </Flex>
            {interventionList.map((intervention) => {
                return (
                    <RangeConfig
                        key={intervention.id}
                        interventionData={intervention}
                        interventionList={interventionList}
                        setInterventionList={setInterventionList}
                    />
                );
            })}
        </Flex>
    );
};

export default MobilityInterventions;
