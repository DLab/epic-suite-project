import {
    CheckCircleIcon,
    InfoOutlineIcon,
    WarningTwoIcon,
} from "@chakra-ui/icons";
import { Button, Icon } from "@chakra-ui/react";
import React from "react";

import { StatusSimulation } from "types/HardSimulationType";

type Props = {
    status: StatusSimulation;
};

export const schemeColorStatus = {
    [StatusSimulation.NOTSTARTED]: () => <Icon as={CheckCircleIcon} />,
    [StatusSimulation.RECIEVED]: () => <Icon as={CheckCircleIcon} />,
    [StatusSimulation.STARTED]: () => <Icon as={CheckCircleIcon} />,
    [StatusSimulation.ERROR]: () => <Icon as={WarningTwoIcon} />,
    [StatusSimulation.FINISHED]: () => <Icon as={CheckCircleIcon} />,
    [StatusSimulation.CANCELED]: () => <Icon as={InfoOutlineIcon} />,
};

function Status({ status }: Props) {
    return <Button>{schemeColorStatus[status]()}</Button>;
}

export default Status;
