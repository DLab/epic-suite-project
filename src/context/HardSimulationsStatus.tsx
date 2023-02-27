/* eslint-disable sonarjs/no-identical-functions */
import { createContext, useReducer, useState } from "react";

import {
    Actions,
    ActionsHardSim,
    HardSim,
    HardSimulationType,
    StatusSimulation,
    TypeHardSimulation,
} from "types/HardSimulationType";

export const initialStateHardSim: HardSimulationType = {
    status: StatusSimulation.NOTSTARTED,
    details: {
        type: TypeHardSimulation.NONE,
        idModel: 0,
        idProcess: "",
        description: "",
        result: "",
    },
};

export const HardSimSetted = createContext<HardSim>({
    hardSimulation: initialStateHardSim,
    setHardSimulation: () => {},
    getHardSimulation: () => initialStateHardSim,
});

type Props = {
    children?: React.ReactNode;
};

const HardSimulationContext: React.FC = ({ children }: Props) => {
    const reducer = (
        state: HardSimulationType = initialStateHardSim,
        action: ActionsHardSim
    ) => {
        if (action.type === Actions.RESET) {
            window.localStorage.setItem(
                "hardSimulationStatus",
                JSON.stringify(initialStateHardSim)
            );
            return initialStateHardSim;
        }
        if (action.type === Actions.SET) {
            window.localStorage.setItem(
                "hardSimulationStatus",
                JSON.stringify({
                    ...state,
                    details: {
                        ...state.details,
                        ...action.payload,
                    },
                    status: action.status,
                })
            );
            return {
                ...state,
                details: {
                    ...state.details,
                    ...action.payload,
                },
                status: action.status,
            };
        }
        if (action.type === Actions.SET_WITHOUT_NAME) {
            window.localStorage.setItem(
                "hardSimulationStatus",
                JSON.stringify({
                    ...state,
                    details: {
                        ...state.details,
                        ...action.payload,
                        name: state.details.name,
                        idModel: state.details.idModel,
                    },
                    status: action.status,
                })
            );
            return {
                ...state,
                details: {
                    ...state.details,
                    ...action.payload,
                    name: state.details.name,
                    idModel: state.details.idModel,
                },
                status: action.status,
            };
        }
        return state;
    };
    const [hardSimulation, setHardSimulation] = useReducer(
        reducer,
        initialStateHardSim
    );
    const getHardSimulation = () => hardSimulation;
    return (
        <HardSimSetted.Provider
            value={{ hardSimulation, setHardSimulation, getHardSimulation }}
        >
            {children}
        </HardSimSetted.Provider>
    );
};

export default HardSimulationContext;
