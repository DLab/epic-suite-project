import { Button } from "@chakra-ui/react";
import React from "react";

import { InterventionsTypes } from "types/MobilityMatrixTypes";

import MobilityInterventions from "./MobilityInterventions";

interface Props {
    interventionList: InterventionsTypes[] | [];
    setInterventionList: (value: InterventionsTypes[] | []) => void;
}
const RealMobilityMatrix = ({
    interventionList,
    setInterventionList,
}: Props) => {
    return (
        <>
            <Button
                size="sm"
                fontSize="10px"
                bg="#016FB9"
                color="#FFFFFF"
                w="100px"
            >
                GET MATRIX
            </Button>
            <MobilityInterventions
                interventionList={interventionList}
                setInterventionList={setInterventionList}
            />
        </>
    );
};

export default RealMobilityMatrix;
