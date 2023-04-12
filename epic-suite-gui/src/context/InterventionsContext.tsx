import { createContext, useMemo, useReducer, useState } from "react";

import type { ChildrenProps } from "types/importTypes";
import { InterventionsModes, Actions } from "types/InterventionsTypes";
import type {
    InterventionsProps,
    Interventions,
    InterventionsActions,
} from "types/InterventionsTypes";

export const InterventionColection = createContext<InterventionsProps>({
    interventionsMode: InterventionsModes.Initial,
    setInterventionMode: () => {},
    interventionsCreated: [],
    setInterventionsCreated: () => {},
    originOfInterventionCreation: "",
    setOriginOfInterventionCreation: () => {},
    idInterventionToUpdate: 0,
    setIdInterventionToUpdate: () => {},
    idInterventionModel: 0,
    setIdInterventionModel: () => {},
});

// eslint-disable-next-line react/prop-types
const InterventionsContext: React.FC<ChildrenProps> = ({ children }) => {
    const initialStateInterventions: [] | Interventions[] = [];
    const reducer = (
        state: [] | Interventions[],
        action: InterventionsActions
    ) => {
        switch (action.type) {
            case Actions.add:
                return [...state, action.payload];
            case Actions.update:
                return state.map((e: Interventions) => {
                    if (e.id === action.id) {
                        return action.payload;
                    }
                    return e;
                });
            case Actions.remove:
                return state.filter((e: Interventions) => e.id !== +action.id);
            case Actions.reset:
                return action.reset;
            default:
                return state;
        }
    };
    const [interventionsMode, setInterventionMode] = useState(
        InterventionsModes.Initial
    );
    const [interventionsCreated, setInterventionsCreated] = useReducer(
        reducer,
        initialStateInterventions
    );
    const [originOfInterventionCreation, setOriginOfInterventionCreation] =
        useState("");
    const [idInterventionToUpdate, setIdInterventionToUpdate] = useState(0);
    const [idInterventionModel, setIdInterventionModel] = useState(0);
    const config = useMemo(
        () => ({
            interventionsMode,
            setInterventionMode,
            interventionsCreated,
            setInterventionsCreated,
            originOfInterventionCreation,
            setOriginOfInterventionCreation,
            idInterventionToUpdate,
            setIdInterventionToUpdate,
            idInterventionModel,
            setIdInterventionModel,
        }),
        [
            interventionsMode,
            interventionsCreated,
            originOfInterventionCreation,
            idInterventionToUpdate,
            idInterventionModel,
        ]
    );
    return (
        <InterventionColection.Provider value={config}>
            {children}
        </InterventionColection.Provider>
    );
};

export default InterventionsContext;
