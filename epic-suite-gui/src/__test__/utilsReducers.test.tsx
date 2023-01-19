import VariableDependentTime, {
    NameFunction,
    Sine,
    Square,
    StaticValue,
    Transition,
    TransitionFunction,
    TypePhase,
} from "../types/VariableDependentTime";
import reducer, {
    Actions,
    handleNameFunctionSelect,
    lastValueInMatrix,
} from "../utils/reducerVariableDependent";

describe("reducers variable dependent time", () => {
    const dataExampleVariableDependentTime:
        | VariableDependentTime
        | {
              default: string;
              rangeDays: number[][];
              type: (Sine | Square | Transition | StaticValue)[];
              name: string;
              isEnabled: boolean;
              val: number;
          } = {
        name: "beta",
        type: [
            {
                name: NameFunction.transition,
                ftype: TransitionFunction.linear,
                concavity: 1,
                initvalue: 0,
                endvalue: 10,
            },
            {
                name: NameFunction.static,
                value: 1.3,
            },
            {
                name: NameFunction.sinusoidal,
                min: 0.1,
                max: 1,
                period: 20,
                initPhase: TypePhase.max,
            },
            {
                name: NameFunction.square,
                min: 0.1,
                max: 1,
                period: 20,
                initPhase: TypePhase.max,
                duty: 0.5,
            },
        ],
        rangeDays: [
            [0, 300],
            [300, 450],
            [450, 500],
            [500, 600],
        ],
        isEnabled: true,
        default: 1,
        val: 0.5,
    };
    it("reducers Variable Dependent: lastValueInMatrix", () => {
        // lastValueInMatrix return last number from matrix
        const data = lastValueInMatrix([
            [0, 4],
            [0, 5],
            [0, 4, 6],
        ]);
        expect(data).toBe(6);
    });
    it("editDefault return original state", () => {
        const actionsPredeterminated = {
            type: "whatever",
            payload: "whathever",
        };
        const returningOriginalState = reducer(
            dataExampleVariableDependentTime,
            actionsPredeterminated
        );
        expect(returningOriginalState).toEqual(
            dataExampleVariableDependentTime
        );
    });
    it("edit default value", () => {
        // edit default value
        const actionsDefaultValue = {
            type: "editDefault",
            index: "30",
        };
        const editDefaulValue = reducer(
            dataExampleVariableDependentTime,
            actionsDefaultValue
        );
        expect(editDefaulValue.default).toBe(`${30}`);
    });
    it("delete a value", () => {
        // delete last rangeDays and type function
        const actionForDelete = {
            type: "delete",
            index: "3",
        };
        const dataOriginalWithoutLastElement = reducer(
            dataExampleVariableDependentTime,
            actionForDelete
        );
        expect(dataOriginalWithoutLastElement.rangeDays).toEqual([
            [0, 300],
            [300, 450],
            [450, 500],
        ]);
        expect(dataOriginalWithoutLastElement.type).toEqual([
            {
                name: NameFunction.transition,
                ftype: TransitionFunction.linear,
                concavity: 1,
                initvalue: 0,
                endvalue: 10,
            },
            {
                name: NameFunction.static,
                value: 1.3,
            },
            {
                name: NameFunction.sinusoidal,
                min: 0.1,
                max: 1,
                period: 20,
                initPhase: TypePhase.max,
            },
        ]);
    });
    it("add new values in variable Dependent Time (range and type)", () => {
        // add values
        const actionsAdd: Actions = {
            type: "add",
            payloadVariableDependent: {
                rangeDays: [700, 800],
                type: {
                    name: NameFunction.static,
                    value: 2,
                },
            },
        };
        const addedRangesAndTypes = reducer(
            dataExampleVariableDependentTime,
            actionsAdd
        );
        expect(addedRangesAndTypes.rangeDays).toEqual([
            [0, 300],
            [300, 450],
            [450, 500],
            [500, 600],
            [700, 800],
        ]);
        expect(addedRangesAndTypes.type).toEqual([
            {
                name: NameFunction.transition,
                ftype: TransitionFunction.linear,
                concavity: 1,
                initvalue: 0,
                endvalue: 10,
            },
            {
                name: NameFunction.static,
                value: 1.3,
            },
            {
                name: NameFunction.sinusoidal,
                min: 0.1,
                max: 1,
                period: 20,
                initPhase: TypePhase.max,
            },
            {
                name: NameFunction.square,
                min: 0.1,
                max: 1,
                period: 20,
                initPhase: TypePhase.max,
                duty: 0.5,
            },
            {
                name: NameFunction.static,
                value: 2,
            },
        ]);
    });
    it("update day values", () => {
        const actionForUpdateDays = {
            type: "updateDay",
            index: "0",
            range: [0, 299],
        };
        const daysUpdated = reducer(
            dataExampleVariableDependentTime,
            actionForUpdateDays
        );
        expect(daysUpdated.rangeDays[0]).toEqual([0, 299]);
    });
    it("edit", () => {
        // should editing all
        const actionsForEditing: Actions = {
            type: "edit",
            payloadType: [
                {
                    name: NameFunction.static,
                    value: 0.3,
                },
            ],
        };
        const editTypesFunctions = reducer(
            dataExampleVariableDependentTime,
            actionsForEditing
        );
        expect(editTypesFunctions.type).toEqual([
            {
                name: NameFunction.static,
                value: 0.3,
            },
        ]);
    });
    it("edit any element", () => {
        const actionsEditingSpecificElement = {
            type: "editElement",
            index: "1",
            payloadTypeElement: {
                name: NameFunction.sinusoidal,
                min: 0,
                max: 1,
                period: 20,
                initPhase: TypePhase.max,
            },
        };
        const dataEdited = reducer(
            dataExampleVariableDependentTime,
            actionsEditingSpecificElement
        );
        expect(dataEdited.type.length).toBe(
            dataExampleVariableDependentTime.type.length
        );
        expect(dataEdited.type).toEqual([
            {
                name: NameFunction.transition,
                ftype: TransitionFunction.linear,
                concavity: 1,
                initvalue: 0,
                endvalue: 10,
            },
            {
                name: NameFunction.sinusoidal,
                min: 0,
                max: 1,
                period: 20,
                initPhase: TypePhase.max,
            },
            {
                name: NameFunction.sinusoidal,
                min: 0.1,
                max: 1,
                period: 20,
                initPhase: TypePhase.max,
            },
            {
                name: NameFunction.square,
                min: 0.1,
                max: 1,
                period: 20,
                initPhase: TypePhase.max,
                duty: 0.5,
            },
        ]);
    });
    it("handleNameFunctionSelect change state", () => {
        const options = {
            static: "static",
            sinusoidal: "sinusoidal",
            transition: "transition",
            square: "square",
            nothing: "nothing",
        };
        // const setVal = (data: unknown, index: string): void => {
        //     return undefined;
        // };
        const setVal = jest.fn((data: unknown, index: string) => undefined);
        handleNameFunctionSelect(options.static, 0, setVal);
        expect(setVal).toHaveBeenCalled();
        handleNameFunctionSelect(options.transition, 0, setVal);
        expect(setVal).toHaveBeenCalled();
        handleNameFunctionSelect(options.square, 0, setVal);
        expect(setVal).toHaveBeenCalled();
        handleNameFunctionSelect(options.sinusoidal, 0, setVal);
        expect(setVal).toHaveBeenCalled();
        handleNameFunctionSelect(options.nothing, 0, setVal);
        expect(setVal).toHaveBeenCalledTimes(4);
    });
});
