import type { Dispatch } from "react";

export enum Actions {
    add = "add",
    update = "update",
    remove = "remove",
    reset = "reset",
}

export interface InterventionsActions {
    type: Actions;
    payload?: Interventions;
    id?: number;
    reset?: Interventions[] | [];
}

export enum InterventionsModes {
    Update = "Update",
    Add = "Add",
    Initial = "Initial",
}

export interface Interventions {
    id: number;
    modelId: number;
    name: string;
    interventions: InterventionsTypes[] | [];
}

export enum TypeStrategy {
    Pharmaceutical = "Pharmaceutical",
    Nonpharmaceutical = "Nonpharmaceutical",
}

export enum PharmaceuticalSubStrategy {
    Vaccination = "Vaccination",
}
export enum NonpharmaceuticalSubStrategy {
    LockDown = "LockDown",
    CordonSanitaire = "CordonSanitaire",
}
export interface ConfigStrategy {
    start: number;
    end: number;
    details: Record<string, unknown>;
}
export interface SubTypeStrategy {
    subtype: PharmaceuticalSubStrategy | NonpharmaceuticalSubStrategy;
    config: ConfigStrategy;
}

export interface InterventionsTypes {
    type: TypeStrategy;
    subtype: SubTypeStrategy;
}

export interface InterventionsProps {
    interventionsMode: InterventionsModes;
    setInterventionMode: (value: InterventionsModes) => void;
    interventionsCreated: Interventions[] | [];
    setInterventionsCreated: Dispatch<InterventionsActions>;
    idInterventionToUpdate: number;
    setIdInterventionToUpdate: (value: number) => void;
    originOfInterventionCreation: string;
    setOriginOfInterventionCreation: (value: string) => void;
    idInterventionModel: number;
    setIdInterventionModel: (value: unknown) => void;
}
