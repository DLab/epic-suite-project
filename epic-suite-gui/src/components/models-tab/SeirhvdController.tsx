/* eslint-disable @typescript-eslint/naming-convention */
import { Flex, IconButton, Switch, FormControl, Text } from "@chakra-ui/react";
import React, { useContext } from "react";
import { useDispatch } from "react-redux";

import FunctionIcon from "components/icons/FunctionIcon";
import NumberInputEpi from "components/NumberInputEpi";
import NumberInputVariableDependent from "components/NumberInputVariableDependent";
import { ControlPanel } from "context/ControlPanelContext";
import { update } from "store/ControlPanel";
import VariableDependentTime from "types/VariableDependentTime";
import createIdComponent from "utils/createIdcomponent";

import SupplementaryParameters from "./SupplementaryParameters";

type Props = {
    showSectionVariable: (values: boolean) => void;
    isEnableIconButton: Record<string, boolean[]>;
    duration: number;
    setIsEnableIconButton: (obj: Record<string, boolean[]>) => void;
    idNode: number;
    seirhvdProps: Record<string, VariableDependentTime[]>;
    setPositionVDT: (position: number) => void;
};
const supplementaryParametersKeys = {
    pE_Im: "pE_Icr",
    pE_Icr: "pE_Im",
    pH_R: "pH_D",
    pH_D: "pH_R",
    pIv_R: "pIv_H",
    pIv_H: "pIv_R",
};
const utilList = ["pH_R", "pIv_H", "pIv_R"];
const SeirhvdController = ({
    showSectionVariable,
    isEnableIconButton,
    setIsEnableIconButton,
    idNode,
    seirhvdProps,
    duration,
    setPositionVDT,
}: Props) => {
    const { description, setDataViewVariable } = useContext(ControlPanel);
    const dispatch = useDispatch();
    return (
        <>
            {Object.entries(seirhvdProps).map((param) => {
                if (
                    Object.keys(supplementaryParametersKeys).includes(param[0])
                ) {
                    return (
                        <SupplementaryParameters
                            key={createIdComponent()}
                            showSectionVariable={showSectionVariable}
                            setPositionVDT={setPositionVDT}
                            data={param[1]}
                            nameParam={param[0]}
                            supplementaryParam={
                                supplementaryParametersKeys[param[0]]
                            }
                            idNode={idNode}
                            duration={duration}
                            isEnableIconButton={isEnableIconButton}
                            setIsEnableIconButton={setIsEnableIconButton}
                        />
                    );
                }
                if (utilList.includes(param[0])) {
                    return "";
                }
                return (
                    <FormControl
                        key={createIdComponent()}
                        display="flex"
                        alignItems="center"
                    >
                        <Flex w="50%" justifyContent="space-between">
                            <NumberInputVariableDependent
                                value={param[1][idNode]?.val}
                                nameParams={param[0]}
                                name={`${param[0]}`}
                                description={description[param[0]].description}
                                step={description[param[0]].values.step}
                                min={description[param[0]].values.min}
                                max={description[param[0]].values.max}
                                isStateLocal
                                isDisabled={
                                    isEnableIconButton[param[0]][idNode]
                                }
                                duration={duration}
                                index={idNode}
                            />
                        </Flex>
                        <Flex
                            alignItems="center"
                            w="50%"
                            justifyContent="flex-end"
                        >
                            <Text fontSize="11px">Set function</Text>
                            <Switch
                                ml="0.5rem"
                                isChecked={isEnableIconButton[param[0]][idNode]}
                                onChange={(e) => {
                                    const subPermission: boolean[] =
                                        isEnableIconButton[param[0]];
                                    subPermission[idNode] = e.target.checked;
                                    setIsEnableIconButton({
                                        ...isEnableIconButton,
                                        [param[0]]: subPermission,
                                    });
                                    if (!e.target.checked) {
                                        showSectionVariable(false);
                                    }
                                    dispatch(
                                        update({
                                            type: "switch",
                                            target: param[0],
                                            switch: e.target.checked,
                                            positionVariableDependentTime:
                                                idNode,
                                        })
                                    );
                                }}
                            />

                            <IconButton
                                fill="white"
                                bg="#FFFFFF"
                                color="#16609E"
                                aria-label="Call Segun"
                                size="sm"
                                isDisabled={
                                    !isEnableIconButton[param[0]][idNode]
                                }
                                cursor="pointer"
                                icon={<FunctionIcon />}
                                ml="1rem"
                                onClick={() => {
                                    showSectionVariable(true);
                                    setDataViewVariable(param[1][idNode]);
                                }}
                            />
                        </Flex>
                    </FormControl>
                );
            })}
        </>
    );
};

export default SeirhvdController;
