interface VariableDependentTime {
    rangeDays: number[][];
    type: (Sine | Square | Transition | StaticValue)[];
    name: string;
    default: number;
    isEnabled: boolean;
    val: number;
}

export interface StaticValue {
    name: NameFunction.static;
    value: number;
}

export interface Sine {
    name: NameFunction;
    min: number;
    max: number;
    period: number;
    initPhase: TypePhase;
}
export enum NameFunction {
    sinusoidal = "sinusoidal",
    square = "square",
    static = "static",
    transition = "transition",
}
export enum TypePhase {
    min = 0,
    max = 1,
}
export interface Square extends Sine {
    duty: number;
}

export enum TransitionFunction {
    linear = 0,
    quadratic = 1,
    sigmoidal = 2,
}

export interface Transition {
    name: NameFunction;
    ftype: TransitionFunction;
    initvalue: number;
    endvalue: number;
    concavity?: number;
}
export interface DataForGraph {
    function: number[] | [];
    t: number[] | [];
}
export default VariableDependentTime;
