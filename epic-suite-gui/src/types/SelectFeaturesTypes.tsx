import { Model } from "types/ControlPanelTypes";

export interface DataGeoSelections {
    id: number;
    name?: string;
    scale: string;
    featureSelected: string[];
}

export interface Action {
    type: string;
    payload?: string[];
    geoPayload?: DataGeoSelections;
    element?: string;
    target?: string;
    updateData?: string[];
    initial?: DataGeoSelections[];
}

export interface StatesProps {
    mode: Model;
    setMode: (value: Model) => void;
    nameGeoSelection: string;
    setNameGeoSelection: (value: string) => void;
    scale: string;
    setScale: (value: string) => void;
    simulationScale: string;
    setSimulationScale: (value: string) => void;
    states: string[];
    setStates: (value: Action) => void;
    counties?: string[] | null | undefined;
    setCounties: (value: Action) => void;
    geoSelections: DataGeoSelections[];
    setGeoSelections: (values: Action) => void;
    idGeoSelectionUpdate: number;
    setIdGeoSelectionUpdate: (value: number) => void;
    originOfGeoCreation: string;
    setOriginOfGeoCreation: (value: string) => void;
}

export interface DataCountiesObj {
    value: string;
    label: string;
}

export interface ObjStatesCounties {
    state: string;
    labelState: string;
    counties: DataCountiesObj[];
}
