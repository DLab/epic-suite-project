/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable @typescript-eslint/naming-convention */
import {
    Text,
    Flex,
    IconButton,
    Switch,
    FormControl,
    Heading,
} from "@chakra-ui/react";
import _ from "lodash";
import { useContext, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import NumberInputEpi from "../NumberInputEpi";
import FunctionIcon from "components/icons/FunctionIcon";
import NumberInputVariableDependent from "components/NumberInputVariableDependent";
import { ControlPanel } from "context/ControlPanelContext";
import { NewModelSetted } from "context/NewModelsContext";
import { update } from "store/ControlPanel";
import { RootState } from "store/store";
import { NewModelsAllParams } from "types/SimulationTypes";

import MobilityMatrixModel from "./mobility-matrix/MobilityMatrixModel";
import NodesParams from "./NodesParams";

interface Props {
    showSectionVariable: (values: boolean) => void;
    setShowSectionInitialConditions: (value: boolean) => void;
    setPositionVDT: (value: number) => void;
    nodes?: string[];
    modelCompartment?: string;
    populationValue: string;
    matrixId: number;
    setMatrixId: (value: number) => void;
}

/**
 * Accordion with the parameter settings of a model.
 * @subcategory NewModel
 * @component
 */
const ModelController = ({
    showSectionVariable,
    setShowSectionInitialConditions,
    setPositionVDT,
    modelCompartment,
    nodes,
    populationValue,
    matrixId,
    setMatrixId,
}: Props) => {
    const { description, setDataViewVariable, idModelUpdate } =
        useContext(ControlPanel);
    const { completeModel } = useContext(NewModelSetted);
    const parameters = useSelector((state: RootState) => state.controlPanel);
    const dispatch = useDispatch();
    const [isEnableIconButton, setIsEnableIconButton] = useState<
        Record<string, boolean[]>
    >(
        [
            parameters.rR_S,
            parameters.tE_I,
            parameters.tI_R,
            parameters.beta,
            parameters.alpha,
            parameters.Beta_v,
            parameters.vac_d,
            parameters.vac_eff,
            parameters.pE_Im,
            parameters.tE_Im,
            parameters.pE_Icr,
            parameters.tE_Icr,
            parameters.tEv_Iv,
            parameters.tIm_R,
            parameters.tIcr_H,
            parameters.pIv_R,
            parameters.tIv_R,
            parameters.pIv_H,
            parameters.tIv_H,
            parameters.pH_R,
            parameters.tH_R,
            parameters.pH_D,
            parameters.tH_D,
            parameters.pR_S,
            parameters.tR_S,
        ].reduce((acc, current) => {
            if (Array.isArray(current)) {
                return {
                    ...acc,
                    [current[0].name]: [
                        ...current.map((variable) => variable.isEnabled),
                    ],
                };
            }

            return {
                ...acc,
                [current.name]: [current.isEnabled],
            };
        }, {})
    );

    useEffect(() => {
        const paramsModelsToUpdate = completeModel.find(
            (model: NewModelsAllParams) => model.idNewModel === idModelUpdate
        );
        if (paramsModelsToUpdate) {
            dispatch(
                update({
                    type: "update",
                    updateData: paramsModelsToUpdate.parameters,
                })
            );
            setIsEnableIconButton(
                [
                    paramsModelsToUpdate.parameters.rR_S,
                    paramsModelsToUpdate.parameters.tE_I,
                    paramsModelsToUpdate.parameters.tI_R,
                    paramsModelsToUpdate.parameters.beta,
                    paramsModelsToUpdate.parameters.alpha,
                    paramsModelsToUpdate.parameters.Beta_v,
                    paramsModelsToUpdate.parameters.vac_d,
                    paramsModelsToUpdate.parameters.vac_eff,
                    paramsModelsToUpdate.parameters.pE_Im,
                    paramsModelsToUpdate.parameters.tE_Im,
                    paramsModelsToUpdate.parameters.pE_Icr,
                    paramsModelsToUpdate.parameters.tE_Icr,
                    paramsModelsToUpdate.parameters.tEv_Iv,
                    paramsModelsToUpdate.parameters.tIm_R,
                    paramsModelsToUpdate.parameters.tIcr_H,
                    paramsModelsToUpdate.parameters.pIv_R,
                    paramsModelsToUpdate.parameters.tIv_R,
                    paramsModelsToUpdate.parameters.pIv_H,
                    paramsModelsToUpdate.parameters.tIv_H,
                    paramsModelsToUpdate.parameters.pH_R,
                    paramsModelsToUpdate.parameters.tH_R,
                    paramsModelsToUpdate.parameters.pH_D,
                    paramsModelsToUpdate.parameters.tH_D,
                    paramsModelsToUpdate.parameters.pR_S,
                    paramsModelsToUpdate.parameters.tR_S,
                ].reduce((acc, current) => {
                    if (Array.isArray(current)) {
                        return {
                            ...acc,
                            [current[0].name]: [
                                ...current.map(
                                    (variable) => variable.isEnabled
                                ),
                            ],
                        };
                    }
                    // if (_.isEmpty(current)) {
                    //     return acc;
                    // }
                    return {
                        ...acc,
                        [current.name]: [current.isEnabled],
                    };
                }, {})
            );
        }
    }, [completeModel, dispatch, idModelUpdate]);

    return (
        <>
            {populationValue === "metapopulation" && (
                <MobilityMatrixModel
                    matrixId={matrixId}
                    setMatrixId={setMatrixId}
                />
            )}
            <Text fontSize="1rem" fontWeight={700} mb="5%" mt="5%">
                Common parameters
            </Text>
            <Flex justifyContent="space-between" wrap="wrap">
                <FormControl display="flex" alignItems="center">
                    <Flex w="50%" h="2rem" alignItems="center">
                        <NumberInputEpi
                            value={parameters.t_end}
                            nameParams="t_end"
                            name="Duration"
                            description="Duration days"
                            min={0}
                            step={1}
                            max={Infinity}
                            isInitialParameters
                            type="number"
                            isStateLocal
                        />
                    </Flex>
                </FormControl>
            </Flex>
            <Flex justifyContent="space-between" wrap="wrap">
                {modelCompartment !== "SEIRHVD" && (
                    <FormControl display="flex" alignItems="center">
                        <Flex w="50%" h="2rem" alignItems="center">
                            <NumberInputVariableDependent
                                value={parameters.tI_R.val}
                                nameParams="tI_R"
                                name={description.tI_R.alias}
                                description={description.tI_R.description}
                                step={description.tI_R.values.step}
                                min={description.tI_R.values.min}
                                max={description.tI_R.values.max}
                                isDisabled={isEnableIconButton.tI_R[0]}
                                duration={parameters.t_end}
                                isStateLocal
                            />
                        </Flex>
                        <Flex
                            alignItems="center"
                            w="50%"
                            justifyContent="flex-end"
                        >
                            <Text fontSize="0.688rem">Set function</Text>
                            <Switch
                                ml="0.5rem"
                                isChecked={isEnableIconButton.tI_R[0]}
                                onChange={(e) => {
                                    setIsEnableIconButton({
                                        ...isEnableIconButton,
                                        tI_R: [e.target.checked],
                                    });
                                    if (!e.target.checked) {
                                        showSectionVariable(false);
                                    }
                                    dispatch(
                                        update({
                                            type: "switch",
                                            target: "tI_R",
                                            switch: e.target.checked,
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
                                isDisabled={!isEnableIconButton.tI_R[0]}
                                cursor="pointer"
                                icon={<FunctionIcon />}
                                ml="1rem"
                                onClick={() => {
                                    setShowSectionInitialConditions(false);
                                    showSectionVariable(true);
                                    setDataViewVariable(parameters.tI_R);
                                }}
                            />
                        </Flex>
                    </FormControl>
                )}
            </Flex>
            <Flex justifyContent="space-between" wrap="wrap">
                {modelCompartment === "SEIR" && (
                    <FormControl display="flex" alignItems="center">
                        <Flex w="50%" h="2rem" alignItems="center">
                            <NumberInputVariableDependent
                                value={parameters.tE_I.val}
                                nameParams="tE_I"
                                name={description.tE_I.alias}
                                description={description.tE_I.description}
                                step={description.tE_I.values.step}
                                min={description.tE_I.values.min}
                                max={description.tE_I.values.max}
                                isDisabled={isEnableIconButton.tE_I[0]}
                                duration={parameters.t_end}
                                isStateLocal
                            />
                        </Flex>
                        <Flex
                            alignItems="center"
                            w="50%"
                            justifyContent="flex-end"
                        >
                            <Text fontSize="0.688rem">Set function</Text>
                            <Switch
                                ml="0.5rem"
                                isChecked={isEnableIconButton.tE_I[0]}
                                onChange={(e) => {
                                    setIsEnableIconButton({
                                        ...isEnableIconButton,
                                        tE_I: [e.target.checked],
                                    });
                                    if (!e.target.checked) {
                                        showSectionVariable(false);
                                    }
                                    dispatch(
                                        update({
                                            type: "switch",
                                            target: "tE_I",
                                            switch: e.target.checked,
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
                                isDisabled={!isEnableIconButton.tE_I[0]}
                                cursor="pointer"
                                icon={<FunctionIcon />}
                                ml="1rem"
                                onClick={() => {
                                    setShowSectionInitialConditions(false);
                                    showSectionVariable(true);
                                    setDataViewVariable(parameters.tE_I);
                                }}
                            />
                        </Flex>
                    </FormControl>
                )}
            </Flex>
            <Flex justifyContent="space-between" wrap="wrap">
                {modelCompartment !== "SEIRHVD" && (
                    <FormControl display="flex" alignItems="center">
                        <Flex w="50%" alignItems="center">
                            <NumberInputVariableDependent
                                value={parameters.rR_S.val}
                                nameParams="rR_S"
                                name={description.rR_S.alias}
                                description={description.rR_S.description}
                                step={description.rR_S.values.step}
                                min={description.rR_S.values.min}
                                max={description.rR_S.values.max}
                                isDisabled={isEnableIconButton.rR_S[0]}
                                duration={parameters.t_end}
                                isStateLocal
                            />
                        </Flex>
                        <Flex
                            alignItems="center"
                            w="50%"
                            justifyContent="flex-end"
                        >
                            <Text fontSize="0.688rem">Set function</Text>
                            <Switch
                                ml="0.5rem"
                                isChecked={isEnableIconButton.rR_S[0]}
                                onChange={(e) => {
                                    setIsEnableIconButton({
                                        ...isEnableIconButton,
                                        rR_S: [e.target.checked],
                                    });
                                    if (!e.target.checked) {
                                        showSectionVariable(false);
                                    }
                                    dispatch(
                                        update({
                                            type: "switch",
                                            target: "rR_S",
                                            switch: e.target.checked,
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
                                isDisabled={!isEnableIconButton.rR_S[0]}
                                cursor="pointer"
                                icon={<FunctionIcon />}
                                ml="1rem"
                                onClick={() => {
                                    setShowSectionInitialConditions(false);
                                    showSectionVariable(true);
                                    setDataViewVariable(parameters.rR_S);
                                }}
                            />
                        </Flex>
                    </FormControl>
                )}
            </Flex>
            <Flex justifyContent="space-between" wrap="wrap">
                <FormControl display="flex" alignItems="center">
                    <Flex w="50%" h="2rem" alignItems="center">
                        {modelCompartment !== "SEIRHVD" && (
                            <NumberInputEpi
                                value={parameters.pI_det}
                                nameParams="pI_det"
                                name={description.pI_det.alias}
                                description={description.pI_det.description}
                                step={description.pI_det.values.step}
                                min={description.pI_det.values.min}
                                max={description.pI_det.values.max}
                                type="number"
                                isInitialParameters
                                isStateLocal
                            />
                        )}
                    </Flex>
                </FormControl>
            </Flex>
            {modelCompartment === "SEIRHVD" && (
                <Flex justifyContent="space-between" wrap="wrap">
                    <FormControl display="flex" alignItems="center">
                        <Flex w="50%" h="2rem" alignItems="center">
                            <NumberInputEpi
                                value={parameters.populationfraction}
                                nameParams="populationfraction"
                                name={description.populationfraction.alias}
                                description={
                                    description.populationfraction.description
                                }
                                step={
                                    description.populationfraction.values.step
                                }
                                min={description.populationfraction.values.min}
                                max={description.populationfraction.values.max}
                                type="number"
                                isInitialParameters
                                isStateLocal
                            />
                        </Flex>
                    </FormControl>
                </Flex>
            )}
            <Heading as="h3" fontSize="1rem" mt="5%">
                Parameters per Nodes
            </Heading>
            {/* <Accordion allowToggle reduceMotion> */}
            <NodesParams
                beta={parameters.beta}
                alpha={parameters.alpha}
                mu={parameters.mu}
                nodes={nodes}
                duration={parameters.t_end}
                setIsEnableIconButton={setIsEnableIconButton}
                isEnableIconButton={isEnableIconButton}
                showSectionVariable={showSectionVariable}
                setShowSectionInitialConditions={
                    setShowSectionInitialConditions
                }
                setPositionVDT={setPositionVDT}
                modelCompartment={modelCompartment}
                otherParameters={{
                    Beta_v: parameters.Beta_v,
                    vac_d: parameters.vac_d,
                    vac_eff: parameters.vac_eff,
                    pE_Im: parameters.pE_Im,
                    tE_Im: parameters.tE_Im,
                    pE_Icr: parameters.pE_Icr,
                    tE_Icr: parameters.tE_Icr,
                    tEv_Iv: parameters.tEv_Iv,
                    tIm_R: parameters.tIm_R,
                    tIcr_H: parameters.tIcr_H,
                    pIv_R: parameters.pIv_R,
                    tIv_R: parameters.tIv_R,
                    pIv_H: parameters.pIv_H,
                    tIv_H: parameters.tIv_H,
                    pH_R: parameters.pH_R,
                    tH_R: parameters.tH_R,
                    pH_D: parameters.pH_D,
                    tH_D: parameters.tH_D,
                    pR_S: parameters.pR_S,
                    tR_S: parameters.tR_S,
                }}
            />
        </>
    );
};

export default ModelController;
