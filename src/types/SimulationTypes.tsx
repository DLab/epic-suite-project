import { EpidemicsData, InitialConditionsNewModel } from "./ControlPanelTypes";

export enum OptionFeature {
    None = "",
    Graph = "Graph",
    Geographic = "Geographic",
}

export interface InitialConditions {
    population: number;
    R: number | number[];
    I: number | number[];
    I_d: number | number[];
    I_ac: number | number[];
    E?: number | number[];
    H?: number | number[];
    H_d?: number | number[];
    H_acum?: number | number[];
    Iv_d?: number | number[];
    Iv_ac?: number | number[];
    V?: number | number[];
    V_acum?: number | number[];
    D?: number | number[];
    D_d?: number | number[];
    D_acum?: number | number[];
    Iv?: number | number[];
    H_cap?: number | number[];
}

export interface NewModelsParams {
    idNewModel: undefined | number | string;
    name: string;
    modelType: string;
    populationType: string;
    typeSelection: string;
    idGeo: undefined | number | string;
    idMobilityMatrix: undefined | number;
    idGraph: undefined | number;
    initialConditions: InitialConditionsNewModel[];
    numberNodes: number;
    t_init: string;
    idIntervention?: number | string;
}

export interface NewModelsAllParams {
    idNewModel: undefined | number | string;
    name: string;
    modelType: string;
    populationType: string;
    typeSelection: string;
    idGeo: undefined | number | string;
    idMobilityMatrix: undefined | number;
    idGraph: undefined | number;
    initialConditions: InitialConditionsNewModel[];
    numberNodes: number;
    t_init: string;
    parameters: EpidemicsData;
    idIntervention?: number | string;
}

export interface ActionsNewModelData {
    type: string;
    payload?: NewModelsAllParams;
    payloadInitialConditions?: InitialConditionsNewModel[];
    element?: string | boolean | number;
    target?: string;
    id?;
    localState?: NewModelsAllParams[];
}
export type ActionsNewModel = Omit<
    ActionsNewModelData,
    "localState" | "payload"
>;
export interface NewActionsNewModel extends ActionsNewModel {
    payload?: NewModelsParams;
    localState?: NewModelsParams[];
}
export interface NewModelType {
    mode: string;
    setMode: (value: string) => void;
    // idNewModelUpdating: number;
    // setIdNewModelUpdating: (value: ActionsIdSimulation) => void;
    newModel: NewModelsParams[] | [];
    setNewModel: (values: NewActionsNewModel) => void;
    completeModel: NewModelsAllParams[] | [];
    setCompleteModel: (values: ActionsNewModelData) => void;
    selectedModelsToSimulate: NewModelsAllParams[] | [];
    setSelectedModelsToSimulate: (values: NewModelsAllParams[]) => void;
    simulationsPopulatioType: string;
    setSimulationsPopulatioType: (value: string) => void;
    idModelUpdate: number | undefined;
    setIdModelUpdate: (value: number | undefined) => void;
    name: string;
    setName: (value: string) => void;
    idMobility: number;
    setIdMobility: (value: number) => void;
    idIntervention: number;
    setIdIntervention: (value: number | string) => void;
}

export interface SimulatorParams {
    name: string;
    idSim: number;
    idModel: number;
    idGeo: number;
    idGraph: number;
    typeSelection: OptionFeature;
    initialConditions: InitialConditions;
    t_init: string;
}

export interface ActionsSimulationData {
    type: string;
    payload?: SimulatorParams;
    payloadInitialConditions?: SimulatorParams["initialConditions"];
    element?: string | boolean | number;
    target?: string;
    id?;
    localState?: SimulatorParams[];
}

export interface ActionsIdSimulation {
    type: string;
    payload: number;
}

export interface SimulationType {
    idSimulationUpdating: number;
    // setIdSimulationUpdating: (value: number) => void;
    setIdSimulationUpdating: (value: ActionsIdSimulation) => void;
    simulation: SimulatorParams[] | [];
    setSimulation: (values: ActionsSimulationData) => void;
}
