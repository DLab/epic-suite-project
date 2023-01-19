/* eslint-disable sonarjs/no-identical-functions */
import { createContext, useReducer, useState } from "react";

import {
    ActionsIdSimulation,
    ActionsNewModelData,
    NewModelType,
    NewModelsParams,
    NewModelsAllParams,
    NewActionsNewModel,
} from "types/SimulationTypes";

export const NewModelSetted = createContext<NewModelType>({
    mode: "add",
    setMode: () => {},
    idModelUpdate: 0,
    setIdModelUpdate: () => {},
    // idNewModelUpdating: 0,
    // setIdNewModelUpdating: () => {},
    completeModel: [],
    setCompleteModel: () => {},
    newModel: [],
    setNewModel: () => {},
    selectedModelsToSimulate: [],
    setSelectedModelsToSimulate: () => {},
    simulationsPopulatioType: "",
    setSimulationsPopulatioType: () => {},
    name: "",
    setName: () => {},
});

// eslint-disable-next-line react/prop-types
const NewModelsContext: React.FC = ({ children }) => {
    const initialState: NewModelsParams | [] = [];
    const initialStateCompleteModel: NewModelsAllParams | [] = [];

    const reducer = (
        state: NewModelType["newModel"],
        action: NewActionsNewModel
    ) => {
        switch (action.type) {
            case "add":
                return [...state, action.payload];
            case "update":
                return state.map((e) => {
                    if (e.idNewModel === action.id) {
                        e[action.target] = action.element;
                    }
                    return e;
                });
            case "update-initial-conditions":
                return state.map((e) => {
                    if (e.idNewModel === action.id) {
                        e.initialConditions = action.payloadInitialConditions;
                    }
                    return e;
                });
            case "update-all":
                return state.map((e, index) => {
                    if (e.idNewModel === action.id) {
                        // eslint-disable-next-line no-param-reassign
                        state[index] = action.payload;
                    }
                    return e;
                });
            case "remove":
                return state.filter(
                    (e: NewModelsParams) => e.idNewModel !== +action.element
                );
            case "setInitial":
                return [...state, ...action.localState];
            default:
                return state;
        }
    };
    const reducerCompleteModel = (
        state: NewModelType["completeModel"],
        action: ActionsNewModelData
    ) => {
        switch (action.type) {
            case "add":
                return [...state, action.payload];
            case "update":
                return state.map((e) => {
                    if (e.idNewModel === action.id) {
                        e[action.target] = action.element;
                    }
                    return e;
                });
            case "initial-conditions":
                return state.map((e) => {
                    if (e.idNewModel === action.id) {
                        e.initialConditions = action.payloadInitialConditions;
                    }
                    return e;
                });
            case "update-all":
                return state.map((e, index) => {
                    if (e.idNewModel === action.id) {
                        // eslint-disable-next-line no-param-reassign
                        state[index] = action.payload;
                    }
                    return e;
                });
            case "remove":
                return state.filter(
                    (e: NewModelsAllParams) => e.idNewModel !== +action.element
                );
            case "setInitial":
                return [...state, ...action.localState];
            default:
                return state;
        }
    };
    const reducerIdSimulation = (
        state: number,
        action: ActionsIdSimulation
    ) => {
        if (action.type === "set") {
            return action.payload;
        }
        return state;
    };
    const [mode, setMode] = useState("initial");
    const [newModel, setNewModel] = useReducer(reducer, initialState);
    const [selectedModelsToSimulate, setSelectedModelsToSimulate] = useState(
        []
    );
    const [completeModel, setCompleteModel] = useReducer(
        reducerCompleteModel,
        initialStateCompleteModel
    );
    // const [idNewModelUpdating, setIdNewModelUpdating] = useReducer(
    //     reducerIdSimulation,
    //     0
    // );
    const [simulationsPopulatioType, setSimulationsPopulatioType] =
        useState<string>();
    const [idModelUpdate, setIdModelUpdate] = useState(undefined);
    const [name, setName] = useState("");
    return (
        <NewModelSetted.Provider
            value={{
                mode,
                setMode,
                completeModel,
                setCompleteModel,
                newModel,
                setNewModel,
                // idNewModelUpdating,
                // setIdNewModelUpdating,
                selectedModelsToSimulate,
                setSelectedModelsToSimulate,
                simulationsPopulatioType,
                setSimulationsPopulatioType,
                idModelUpdate,
                setIdModelUpdate,
                name,
                setName,
            }}
        >
            {children}
        </NewModelSetted.Provider>
    );
};

export default NewModelsContext;
