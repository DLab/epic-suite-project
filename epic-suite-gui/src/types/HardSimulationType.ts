import type { Dispatch } from "react";

export interface HardSim {
    hardSimulation: HardSimulationType;
    setHardSimulation: Dispatch<ActionsHardSim>;
    getHardSimulation: () => HardSimulationType;
}
export interface HardSimulationType {
    details: DetailsHardSimulation;
    status: StatusSimulation;
}

export interface DetailsHardSimulation {
    type: TypeHardSimulation;
    idModel?: number;
    idProcess: string;
    description: string;
    result?: string | Record<string, unknown>;
    name?: string;
}

export enum StatusSimulation {
    NOTSTARTED = "NOTSTARTED",
    RECIEVED = "RECIEVED",
    STARTED = "STARTED",
    FINISHED = "FINISHED",
    ERROR = "ERROR",
    CANCELED = "CANCELED",
}

export enum TypeHardSimulation {
    DATAFIT = "DATAFIT",
    METAPOPULATION = "METAPOPULATION",
    NONE = "NONE",
}

export enum Actions {
    SET = "SET",
    RESET = "RESET",
    SET_WITHOUT_NAME = "SET_WITHOUT_NAME",
}

export interface ActionsHardSim {
    type: Actions;
    payload?: DetailsHardSimulation;
    status?: StatusSimulation;
}
