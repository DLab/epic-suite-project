import { Flex, Text } from "@chakra-ui/react";
import { useContext } from "react";

import { ControlPanel } from "context/ControlPanelContext";
import { InterventionColection } from "context/InterventionsContext";
import { NewModelSetted } from "context/NewModelsContext";
import { TabIndex } from "context/TabContext";
import { InterventionsModes } from "types/InterventionsTypes";

const ModelInterventions = () => {
    const {
        interventionsMode,
        setInterventionMode,
        interventionsCreated,
        setInterventionsCreated,
        originOfInterventionCreation,
        setOriginOfInterventionCreation,
        idInterventionToUpdate,
        setIdInterventionToUpdate,
        setIdInterventionModel,
    } = useContext(InterventionColection);
    const { setIndex } = useContext(TabIndex);
    const { idModelUpdate } = useContext(NewModelSetted);
    return (
        <Flex direction="column">
            <Flex justify="left" align="center">
                <Text fontSize="1rem" fontWeight={700}>
                    Interventions
                </Text>
                {!interventionsCreated.find(
                    (interv) => interv.id === idModelUpdate
                ) ? (
                    <Text
                        color="#016FB9"
                        fontSize="0.875rem"
                        textDecorationLine="underline"
                        cursor="pointer"
                        ml="4%"
                        onClick={() => {
                            setIdInterventionModel(idModelUpdate);
                            setInterventionMode(InterventionsModes.Add);
                            setIndex(6);
                            setOriginOfInterventionCreation("modelsTab");
                        }}
                    >
                        + Add interventions
                    </Text>
                ) : (
                    <Text
                        color="#016FB9"
                        fontSize="0.875rem"
                        textDecorationLine="underline"
                        cursor="pointer"
                        ml="4%"
                        onClick={() => {
                            setIdInterventionModel(idModelUpdate);
                            setInterventionMode(InterventionsModes.Update);
                            setIndex(6);
                            setOriginOfInterventionCreation("modelsTab");
                            setIdInterventionToUpdate(idModelUpdate);
                        }}
                    >
                        + View / edit interventions
                    </Text>
                )}
            </Flex>
        </Flex>
    );
};

export default ModelInterventions;
