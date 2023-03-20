import { Flex, Button, Icon } from "@chakra-ui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import React, { useState, useContext, useEffect } from "react";

import { InterventionColection } from "../../context/InterventionsContext";
import BreadCrumb from "components/BreadCrumb";
import ContainerStrategy from "components/interventions-tab/ContainerStrategy";
import Strategy from "components/interventions-tab/Strategy";
import {
    Interventions,
    InterventionsModes,
    InterventionsTypes,
    NonpharmaceuticalSubStrategy,
    PharmaceuticalSubStrategy,
    TypeStrategy,
} from "types/InterventionsTypes";
import createIdComponent from "utils/createIdcomponent";

import InterventionsNameAndButtons from "./InterventionsNameAndButtons";
import InterventionsSavedSelect from "./InterventionsSavedSelect";

type StrategyType = {
    type?: TypeStrategy;
    subtype?: PharmaceuticalSubStrategy | NonpharmaceuticalSubStrategy;
};

const InterventionsTab = () => {
    const {
        interventionsMode,
        setInterventionMode,
        interventionsCreated,
        idInterventionToUpdate,
        setIdInterventionToUpdate,
        idInterventionModel,
        setOriginOfInterventionCreation,
        setIdInterventionModel,
    } = useContext(InterventionColection);
    const [secondModelLink, setSecondModelLink] = useState(undefined);
    const [strategy, setStrategy] = useState<StrategyType[]>([{}]);
    const [data, setData] = useState<InterventionsTypes[] | []>([]);

    useEffect(() => {
        if (
            secondModelLink &&
            interventionsMode === InterventionsModes.Update
        ) {
            const { id, modelId, interventions, name } =
                interventionsCreated.find(
                    (interv: Interventions) =>
                        interv.id === idInterventionToUpdate
                );
            setIdInterventionToUpdate(id);
            setData(interventions);
            const updatedStrategyObject = interventions.map(
                ({ type, subtype }) => ({
                    type,
                    subtype: subtype.subtype,
                })
            );
            setStrategy(updatedStrategyObject);
        }
    }, [
        idInterventionModel,
        idInterventionToUpdate,
        interventionsCreated,
        interventionsMode,
        secondModelLink,
        setIdInterventionModel,
        setIdInterventionToUpdate,
    ]);

    return (
        <Flex direction="column">
            <BreadCrumb
                firstLink="Interventions"
                secondLink={secondModelLink}
                setSecondLink={setSecondModelLink}
            />
            {interventionsMode === InterventionsModes.Initial ? (
                <Flex w="40%" mt="15px">
                    <InterventionsSavedSelect />
                    <Button
                        size="sm"
                        fontSize="0.625rem"
                        bg="#016FB9"
                        color="#FFFFFF"
                        onClick={() => {
                            setInterventionMode(InterventionsModes.Add);
                            setOriginOfInterventionCreation("interventionsTab");
                            setStrategy([]);
                            setIdInterventionModel("");
                        }}
                    >
                        <Icon w="14px" h="14px" as={PlusIcon} mr="5px" />
                        ADD NEW
                    </Button>
                </Flex>
            ) : (
                <Flex direction="column">
                    <InterventionsNameAndButtons
                        strategy={strategy}
                        setStrategy={setStrategy}
                        setData={setData}
                        data={data}
                    />
                    <Flex p="0 2%" h="100%" w="100%" mt="20px">
                        <ContainerStrategy>
                            {strategy.map((elem, i) => (
                                <Strategy
                                    key={createIdComponent()}
                                    position={i}
                                    setStrategy={setStrategy}
                                    type={elem.type}
                                    subtype={elem.subtype}
                                    data={data[i]}
                                    setData={setData}
                                />
                            ))}
                        </ContainerStrategy>
                    </Flex>
                </Flex>
            )}
        </Flex>
    );
};

export default InterventionsTab;
