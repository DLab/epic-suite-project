import { createContext, useReducer, useState } from "react";

import { Model } from "types/ControlPanelTypes";
import {
    DataGeoSelections,
    Action,
    StatesProps,
} from "types/SelectFeaturesTypes";

export const SelectFeature = createContext<StatesProps>({
    idGeoSelectionUpdate: 0,
    setIdGeoSelectionUpdate: () => {},
    mode: Model.Add,
    setMode: () => {},
    nameGeoSelection: "Geo Selection 1",
    setNameGeoSelection: () => {},
    scale: "States",
    setScale: () => {},
    simulationScale: "States",
    setSimulationScale: () => {},
    states: [],
    setStates: () => {},
    counties: [],
    setCounties: () => {},
    geoSelections: [],
    setGeoSelections: () => {},
    originOfGeoCreation: "",
    setOriginOfGeoCreation: () => {},
});

// eslint-disable-next-line react/prop-types
const SelectFeatureContext: React.FC = ({ children }) => {
    const initialStateGeoSelections: DataGeoSelections[] = [];
    const initialState: string[] = [];
    const eliminateDuplicatesData = (
        baseDataArray: string[] | [],
        newDataArray: string[]
    ) => {
        return [...baseDataArray, ...newDataArray].reduce((acc, item) => {
            if (!acc.includes(item)) {
                return [...acc, item];
            }
            return acc;
        }, []);
    };

    const reducer = (state: string[], action: Action) => {
        switch (action.type) {
            case "add":
                return eliminateDuplicatesData(state, action.payload);
            case "handle-select":
                if (state.includes(action.payload[0])) {
                    return state.filter((s: string) => s !== action.payload[0]);
                }
                return [...state, ...action.payload];
            case "remove":
                return [...action.payload];
            case "remove-one":
                return state.filter((s: string) => s !== action.payload[0]);
            case "add-all":
                return [...action.payload];
            case "reset":
                return [];
            case "update":
                return action.updateData;

            default:
                return state;
        }
    };

    const reducerGeoSelections = (
        state: DataGeoSelections[],
        action: Action
    ) => {
        switch (action.type) {
            case "addGeoSelection":
                return [...state, action.geoPayload];
            case "removeGeoSelection":
                return state.filter(
                    (geoSelection) => geoSelection.id !== +action.element
                );
            case "updateGeoSelection":
                return state.map((e) => {
                    if (e.id === +action.element) {
                        e.featureSelected = action.geoPayload.featureSelected;
                        e.name = action.geoPayload.name;
                    }
                    return e;
                });
            case "setInitialSelection":
                return [...state, ...action.initial];
            default:
                return state;
        }
    };

    const [states, setStates] = useReducer(reducer, initialState);
    const [counties, setCounties] = useReducer(reducer, initialState);
    const [geoSelections, setGeoSelections] = useReducer(
        reducerGeoSelections,
        initialStateGeoSelections
    );
    const [scale, setScale] = useState("States");
    const [simulationScale, setSimulationScale] = useState("States");
    const [nameGeoSelection, setNameGeoSelection] = useState("Geo Selection 1");
    const [mode, setMode] = useState<Model>(Model.Initial);
    const [idGeoSelectionUpdate, setIdGeoSelectionUpdate] = useState(0);
    const [originOfGeoCreation, setOriginOfGeoCreation] = useState("");

    return (
        <SelectFeature.Provider
            value={{
                idGeoSelectionUpdate,
                setIdGeoSelectionUpdate,
                mode,
                setMode,
                states,
                setStates,
                counties,
                setCounties,
                scale,
                setScale,
                simulationScale,
                setSimulationScale,
                nameGeoSelection,
                setNameGeoSelection,
                geoSelections,
                setGeoSelections,
                originOfGeoCreation,
                setOriginOfGeoCreation,
            }}
        >
            {children}
        </SelectFeature.Provider>
    );
};

export default SelectFeatureContext;
