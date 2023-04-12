import {
    Flex,
    Text,
    Spinner,
    HStack,
    useDisclosure,
    Grid,
    GridItem,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useContext, useEffect, useMemo } from "react";

import { NewModelSetted } from "context/NewModelsContext";
import { TabIndex } from "context/TabContext";
import type { NewModelsAllParams } from "types/SimulationTypes";
import createIdComponent from "utils/createIdcomponent";

import ResultsDrawer from "./ResultsDrawer";

const GraphicAndMapResults = dynamic(() => import("./GraphicAndMapResults"), {
    loading: () => (
        <Grid
            id={createIdComponent()}
            justifyContent="center"
            alignContent="center"
            w="90vw"
            h="50vh"
        >
            <Spinner
                id={createIdComponent()}
                thickness="4px"
                speed="0.65s"
                emptyColor="#8080A0"
                color="#016FB9"
                size="xl"
            />
        </Grid>
    ),
    ssr: false,
});

/**
 * Component responsible for displaying the results of the simulations.
 * @category Results
 * @component
 */
const Results = () => {
    const { aux: responseSim } = useContext(TabIndex);
    const {
        selectedModelsToSimulate,
        simulationsPopulatioType,
        setSimulationsPopulatioType,
    } = useContext(NewModelSetted);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const GraphicAndMapResultsMemo = useMemo(
        () => (
            <GraphicAndMapResults
                onOpen={onOpen}
                simulationsPopulationType={simulationsPopulatioType}
            />
        ),
        [onOpen, simulationsPopulatioType]
    );

    useEffect(() => {
        const monoModelExist = selectedModelsToSimulate.some(
            (model: NewModelsAllParams) => {
                return model.populationType === "monopopulation";
            }
        );

        const metaModelExist = selectedModelsToSimulate.some(
            (model: NewModelsAllParams) => {
                return model.populationType === "metapopulation";
            }
        );
        if (monoModelExist && metaModelExist) {
            setSimulationsPopulatioType("meta-mono");
        }
        if (monoModelExist && !metaModelExist) {
            setSimulationsPopulatioType("mono");
        }
        if (!monoModelExist && metaModelExist) {
            setSimulationsPopulatioType("meta");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedModelsToSimulate]);

    return (
        <Grid
            w="100%"
            p="5px"
            h="100%"
            templateColumns="repeat(5, 1fr)"
            templateRows="1fr 10fr"
            dir="column"
        >
            <GridItem
                colSpan={5}
                h="5vh"
                maxH="5vh"
                justifyContent="space-between"
            >
                <Flex justifyContent="space-between">
                    <Text color="#016FB9" fontSize="1.125rem" fontWeight="bold">
                        Results
                    </Text>
                    <ResultsDrawer
                        isOpen={isOpen}
                        onOpen={onOpen}
                        onClose={onClose}
                        simulationsPopulatioType={simulationsPopulatioType}
                    />
                </Flex>
            </GridItem>
            {responseSim ? (
                GraphicAndMapResultsMemo
            ) : (
                <GridItem
                    colSpan={5}
                    h="88vh"
                    w="98%"
                    justifyContent="center"
                    alignItems="center"
                >
                    <HStack
                        h="100%"
                        w="100%"
                        justify="center"
                        alignItems="center"
                    >
                        <Text color="#8080A0" fontSize="4xl">
                            Nothing Here
                        </Text>
                    </HStack>
                </GridItem>
            )}
        </Grid>
    );
};

export default Results;
