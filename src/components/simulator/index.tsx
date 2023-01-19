import { useEffect, useContext } from "react";

import MainContentTab from "../mainContent/index";
import { NewModelSetted } from "context/NewModelsContext";
import { SelectFeature } from "context/SelectFeaturesContext";
import TabContext from "context/TabContext";
import { NewModelsAllParams, NewModelsParams } from "types/SimulationTypes";

const Simulator = () => {
    // set initial models and geoSelections from localstorage.
    const { setGeoSelections } = useContext(SelectFeature);
    const { setCompleteModel, setNewModel } = useContext(NewModelSetted);
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
        }
    }, [setGeoSelections, setCompleteModel, setNewModel]);

    return (
        <TabContext>
            <MainContentTab />
        </TabContext>
    );
};

export default Simulator;
