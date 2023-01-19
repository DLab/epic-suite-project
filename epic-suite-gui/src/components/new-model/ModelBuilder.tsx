import { Box, Flex, Portal } from "@chakra-ui/react";
// import SectionVariableDependentTime from "components/map-results/SectionVariableDependentTime";
import _ from "lodash";
import { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import ToastMessage from "../simulator/controllers/ToastMessage";
import ModelController from "components/new-model/ModelController";
import SectionVariableDependentTime from "components/new-model/SectionVariableDependentTime";
import { ControlPanel } from "context/ControlPanelContext";
import { NewModelSetted } from "context/NewModelsContext";
import { SelectFeature } from "context/SelectFeaturesContext";
import countiesData from "data/counties.json";
import stateData from "data/states.json";
import { update } from "store/ControlPanel";
import { NewModelsAllParams } from "types/SimulationTypes";
import VariableDependentTime from "types/VariableDependentTime";

import getArrayParametersByNode from "./GetParametersByNodes";

interface Props {
    setShowSectionVariable: (values: boolean) => void;
    setShowSectionInitialConditions: (value: boolean) => void;
    setPositionVDT: (value: number) => void;
    idGeo: number | string;
    modelCompartment: string;
    numberNodes: number;
    populationValue: string;
    dataSourceValue: string;
    modelName: string;
    startDate: Date;
    id: number;
}

/**
 * Container for parameter configuration.
 * @subcategory NewModel
 * @component
 */
const ModelBuilder = ({
    setShowSectionInitialConditions,
    setShowSectionVariable,
    setPositionVDT,
    idGeo,
    modelCompartment,
    numberNodes,
    populationValue,
    dataSourceValue,
    modelName,
    startDate,
    id,
}: Props) => {
    const { geoSelections: allGeoSelections } = useContext(SelectFeature);

    const [nodes, setNodes] = useState([]);
    // const { setParameters, parameters } = useContext(ControlPanel);
    const dispatch = useDispatch();
    const { completeModel } = useContext(NewModelSetted);

    /**
     * Returns a list with the name of the nodes of the geographical selection.
     * @param scale spatial scale of geographic selection.
     * @param featureSelected list of the fips of the states or counties of the geographic selection.
     * @returns {string[]}
     */
    const getNamesGeo = (scale, featureSelected) => {
        let nodesNamesArray = [];
        featureSelected.forEach((feature) => {
            if (scale === "States") {
                nodesNamesArray = [
                    ...nodesNamesArray,
                    stateData.data.find((state) => state[0] === feature)[2],
                ];
            } else {
                nodesNamesArray = [
                    ...nodesNamesArray,
                    countiesData.data.find((state) => state[5] === feature)[7],
                ];
            }
        });
        return nodesNamesArray;
    };

    useEffect(() => {
        if (
            dataSourceValue === "geographic" &&
            idGeo !== undefined &&
            idGeo !== ""
        ) {
            const geoSelected = allGeoSelections.find((geoSelection) => {
                return geoSelection.id === idGeo;
            });
            if (populationValue === "metapopulation") {
                const geoNames = getNamesGeo(
                    geoSelected.scale,
                    geoSelected.featureSelected
                );
                const allParametersByNodes = getArrayParametersByNode(
                    modelName,
                    modelCompartment,
                    startDate,
                    geoNames
                );
                dispatch(
                    update({
                        type: "update",
                        updateData: allParametersByNodes,
                    })
                );
                setNodes(geoNames);
            }
            if (populationValue === "monopopulation") {
                const allParametersByNodes = getArrayParametersByNode(
                    modelName,
                    modelCompartment,
                    startDate,
                    [geoSelected.name]
                );
                dispatch(
                    update({
                        type: "update",
                        updateData: allParametersByNodes,
                    })
                );
                setNodes([geoSelected.name]);
            }
        }
        if (dataSourceValue === "graph") {
            let graphsArray = [];
            const getGraphsNamesArray = () => {
                for (let i = 0; i < numberNodes; i += 1) {
                    const graphName = `Node ${i + 1}`;
                    graphsArray = [...graphsArray, graphName];
                }
                return graphsArray;
            };

            const graphsNamesArray = getGraphsNamesArray();
            const allParametersByNodes = getArrayParametersByNode(
                modelName,
                modelCompartment,
                startDate,
                graphsNamesArray
            );
            dispatch(
                update({ type: "update", updateData: allParametersByNodes })
            );
            setNodes(graphsNamesArray);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        allGeoSelections,
        dataSourceValue,
        idGeo,
        modelCompartment,
        numberNodes,
        populationValue,
    ]);
    useEffect(() => {
        const findedParameters = completeModel.find(
            (complete: NewModelsAllParams) => complete.idNewModel === id
        );
        if (!_.isEmpty(findedParameters)) {
            dispatch(
                update({
                    type: "update",
                    updateData: findedParameters.parameters,
                })
            );
        }
    }, [completeModel, id, dispatch]);
    return (
        <>
            <ModelController
                showSectionVariable={setShowSectionVariable}
                modelCompartment={modelCompartment}
                nodes={nodes}
                setPositionVDT={setPositionVDT}
                setShowSectionInitialConditions={
                    setShowSectionInitialConditions
                }
            />
        </>
    );
};

export default ModelBuilder;
