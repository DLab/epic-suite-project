import { createContext, useReducer, useState } from "react";

import {
    MobilityMatrixProps,
    MobilityModes,
    MobilityMatrixListProps,
    Actions,
} from "types/MobilityMatrixTypes";

export const MobilityMatrix = createContext<MobilityMatrixProps>({
    idMatrixModel: 0,
    setIdMatrixModel: () => {},
    idMobilityMatrixUpdate: 0,
    setIdMobilityMatrixUpdate: () => {},
    matrixMode: MobilityModes.Initial,
    setMatrixMode: () => {},
    mobilityMatrixList: [],
    setMobilityMatrixList: () => {},
    originOfMatrixCreation: "",
    setOriginOfMatrixCreation: () => {},
    mobilityMatrixType: "",
    setMobilityMatrixType: () => {},
});

// eslint-disable-next-line react/prop-types
const MobilityMatrixContext: React.FC = ({ children }) => {
    const initialStateMobilityMatrix: MobilityMatrixListProps | [] = [];
    const reducer = (state: MobilityMatrixListProps[], action: Actions) => {
        switch (action.type) {
            case "add":
                return [...state, action.payload];
            case "update":
                return state.map((e) => {
                    if (e.id === action.id) {
                        e[action.target] = action.element;
                    }
                    return e;
                });
            case "update-interventions":
                return state.map((e) => {
                    if (e.id === action.id) {
                        e.interventions = action.payloadInterventions;
                    }
                    return e;
                });
            case "update-all":
                return state.map((e, index) => {
                    if (e.id === action.id) {
                        // eslint-disable-next-line no-param-reassign
                        state[index] = action.payload;
                    }
                    return e;
                });
            case "remove":
                return state.filter(
                    (e: MobilityMatrixListProps) => e.id !== +action.element
                );
            case "remove-several":
                return state.filter(
                    (e: MobilityMatrixListProps) =>
                        e.modelId !== +action.element
                );
            case "setInitial":
                return [...state, ...action.localState];
            default:
                return state;
        }
    };

    const [idMatrixModel, setIdMatrixModel] = useState(0);
    const [idMobilityMatrixUpdate, setIdMobilityMatrixUpdate] = useState(0);
    const [matrixMode, setMatrixMode] = useState(MobilityModes.Initial);
    const [mobilityMatrixList, setMobilityMatrixList] = useReducer(
        reducer,
        initialStateMobilityMatrix
    );
    const [originOfMatrixCreation, setOriginOfMatrixCreation] = useState("");
    const [mobilityMatrixType, setMobilityMatrixType] = useState("");

    return (
        <MobilityMatrix.Provider
            value={{
                idMatrixModel,
                setIdMatrixModel,
                idMobilityMatrixUpdate,
                setIdMobilityMatrixUpdate,
                matrixMode,
                setMatrixMode,
                mobilityMatrixList,
                setMobilityMatrixList,
                originOfMatrixCreation,
                setOriginOfMatrixCreation,
                mobilityMatrixType,
                setMobilityMatrixType,
            }}
        >
            {children}
        </MobilityMatrix.Provider>
    );
};

export default MobilityMatrixContext;
