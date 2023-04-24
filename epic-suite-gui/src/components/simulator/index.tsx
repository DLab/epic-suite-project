import { useEffect, useContext } from "react";

import MainContentTab from "../mainContent/index";
import {
    HardSimSetted,
    initialStateHardSim,
} from "context/HardSimulationsStatus";
import { InterventionColection } from "context/InterventionsContext";
import { MobilityMatrix } from "context/MobilityMatrixContext";
import { NewModelSetted } from "context/NewModelsContext";
import { SelectFeature } from "context/SelectFeaturesContext";
import TabContext from "context/TabContext";
import { Actions } from "types/HardSimulationType";
import { Actions as IntervActions } from "types/InterventionsTypes";
import type {
    NewModelsAllParams,
    NewModelsParams,
} from "types/SimulationTypes";

import EventSourceConnection from "./EventSourceConnection";

const Simulator = () => {
    // set initial models, geoSelections end matrixlist from localstorage.
    const { setGeoSelections } = useContext(SelectFeature);
    const { setCompleteModel, setNewModel } = useContext(NewModelSetted);
    const { setMobilityMatrixList } = useContext(MobilityMatrix);
    const { hardSimulation, setHardSimulation } = useContext(HardSimSetted);
    const { interventionsCreated, setInterventionsCreated } = useContext(
        InterventionColection
    );
    useEffect(() => {
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("geoSelection")) {
                const dataLocalStorageGeo =
                    window.localStorage.getItem("geoSelection");
                setGeoSelections({
                    type: "setInitialSelection",
                    initial: JSON.parse(dataLocalStorageGeo),
                });
            }
            if (window.localStorage.getItem("newModels")) {
                const dataLocalStorageNewModels =
                    window.localStorage.getItem("newModels");
                setCompleteModel({
                    type: "setInitial",
                    localState: JSON.parse(dataLocalStorageNewModels),
                });
                const utilArray = JSON.parse(dataLocalStorageNewModels);
                const fromLocalStorageToNewModelContext = utilArray.map(
                    (elem: NewModelsAllParams): NewModelsParams => {
                        const { parameters, ...rest } = elem;
                        return { ...rest };
                    }
                ) as NewModelsParams[];
                setNewModel({
                    type: "setInitial",
                    localState:
                        fromLocalStorageToNewModelContext as unknown as NewModelsParams[],
                });
            }
            if (window.localStorage.getItem("mobilityMatrixList")) {
                const dataLocalStorageMatrix =
                    window.localStorage.getItem("mobilityMatrixList");
                setMobilityMatrixList({
                    type: "setInitial",
                    localState: JSON.parse(dataLocalStorageMatrix),
                });
            }
            if (window.localStorage.getItem("Interventions")) {
                const dataLocalStorageMatrix =
                    window.localStorage.getItem("Interventions");
                setInterventionsCreated({
                    type: IntervActions.reset,
                    reset: JSON.parse(dataLocalStorageMatrix),
                });
            }
            if (window.localStorage.getItem("hardSimulationStatus")) {
                const { status, details } = JSON.parse(
                    window.localStorage.getItem("hardSimulationStatus")
                );
                setHardSimulation({
                    type: Actions.SET,
                    payload: details,
                    status,
                });
            } else {
                window.localStorage.setItem(
                    "hardSimulationStatus",
                    JSON.stringify(initialStateHardSim)
                );
            }
        }
    }, [
        setGeoSelections,
        setCompleteModel,
        setNewModel,
        setMobilityMatrixList,
        setHardSimulation,
        setInterventionsCreated,
    ]);
    useEffect(() => {
        window.localStorage.setItem(
            "Interventions",
            JSON.stringify(interventionsCreated)
        );
    }, [interventionsCreated]);
    return (
        <TabContext>
            <MainContentTab />
            <EventSourceConnection />
        </TabContext>
    );
};

export default Simulator;
