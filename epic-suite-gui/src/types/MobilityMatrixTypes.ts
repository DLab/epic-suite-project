export enum MobilityModes {
    Update = "Update",
    Add = "Add",
    Initial = "Initial",
}

export interface Actions {
    payload?: MobilityMatrixListProps;
    type: string;
    element?: string | boolean | number;
    target?: string;
    id?;
    payloadInterventions?: InterventionsTypes[];
    localState?: MobilityMatrixListProps[];
}

export interface MobilityMatrixListProps {
    id: number;
    populationData?: string;
    geoId: number;
    modelId: number;
    nodes: number;
    populationPercentage?: number;
    graphTypes?: string;
    dynamical: boolean;
    cicleDays?: number;
    modulationOption?: string;
    interventions: InterventionsTypes[];
    nameMobilityMatrix: string;
    type: string;
    matrix?: MobilityMatrixRealData | undefined;
}

export interface InterventionsTypes {
    id: number;
    startRange: number;
    endRange: number;
    intervention: string;
    value?: number;
}

export interface MobilityMatrixProps {
    idMatrixModel: number;
    setIdMatrixModel: (value: number) => void;
    idMobilityMatrixUpdate: number;
    setIdMobilityMatrixUpdate: (value: number) => void;
    matrixMode: MobilityModes;
    setMatrixMode: (value: MobilityModes) => void;
    mobilityMatrixList: MobilityMatrixListProps[];
    setMobilityMatrixList: (value: Actions) => void;
    originOfMatrixCreation: string;
    setOriginOfMatrixCreation: (value: string) => void;
    mobilityMatrixType: string;
    setMobilityMatrixType: (value: string) => void;
    matrix: MobilityMatrixRealData | undefined;
    setMatrix: (value: MobilityMatrixRealData) => void;
}

export type Matrix = {
    tags: string[];
    values: number[][];
};

export interface MobilityMatrixRealData {
    [key: string | number]: Matrix;
}
