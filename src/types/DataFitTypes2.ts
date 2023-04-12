export interface LooseObject {
    [key: string]: unknown;
}

export interface FittedData {
    I?: LooseObject;
    I_ac?: LooseObject;
    name?: string;
    beta?: number;
    beta_days?: string;
    parameter?: number;
    prevState?: null;
    mu?: number;
}

export interface DataToFit {
    I?: LooseObject;
    I_ac?: LooseObject;
    name?: string;
    I_d_data?: string | LooseObject;
}

export interface DataFitProps {
    realDataToFit: DataToFit[];
    setRealDataToFit: (value: DataToFit[]) => void;
    fittedData: FittedData[];
    setFittedData: (value: FittedData[]) => void;
}
