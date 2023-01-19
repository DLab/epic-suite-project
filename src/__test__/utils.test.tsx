import VariableDependentTime, {
    NameFunction,
    Sine,
    Square,
    StaticValue,
    Transition,
    TransitionFunction,
    TypePhase,
} from "../types/VariableDependentTime";
import addInLocalStorage from "../utils/addInLocalStorage";
import convertFiles, { TypeFile } from "../utils/convertFiles";
import createIdComponent from "../utils/createIdcomponent";
import postData from "../utils/fetchData";
import {
    createSeries,
    formatVariableDependentTime,
} from "../utils/getDataForGraphicVTD";
import reducerValuesObjects from "../utils/reducerValuesObject";
import reducer, { Actions, lastValueInMatrix } from "../utils/reducerVariableDependent";
import showOnlySelectedAttributes, {
    findValueByKeyInMatrix,
    getSubTypeTransitionFunction,
} from "../utils/showOnlySelectedAttributes";
import { InitialConditions } from "types/SimulationTypes";

const fakeLocalStorage = (() => {
    let store = {};

    return {
        getItem(key: string) {
            return store[key] || null;
        },
        setItem(key: string, value) {
            store[key] = value.toString();
        },
        removeItem(key: string) {
            delete store[key];
        },
        clear() {
            store = {};
        },
    };
})();

describe("utils functions", () => {
    beforeAll(() => {
        Object.defineProperty(window, "localStorage", {
            value: fakeLocalStorage,
        });
    });
    it("set correctly data into localstorage", () => {
        // Must not return nothing
        const dataForTest = {
            key: "test",
            data: [{ l: "asdf" }],
        };
        addInLocalStorage(dataForTest.data, dataForTest.key);
        // function add a key if it doesn't exist.
        expect(
            JSON.parse(window.localStorage.getItem(dataForTest.key))
        ).toEqual(dataForTest.data);
        addInLocalStorage(dataForTest.data, dataForTest.key);
        // function add new data in key value in localstorage
        expect(
            JSON.parse(window.localStorage.getItem(dataForTest.key))
        ).toEqual([...dataForTest.data, ...dataForTest.data]);
    });
    it("createIdComponent generate a UUID string", () => {
        const uuid = createIdComponent();
        expect(uuid.length).toBe(10);
    });
    it("reducer values works", () => {
        const initial = {
            S: 0,
            R: 0,
            I: 0,
            I_d: 0,
            I_ac: 0,
            E: 0,
            H: 0,
            H_acum: 0,
            V: 0,
            V_acum: 0,
            D: 0,
            D_acum: 0,
            Iv: 0,
            H_cap: 0,
        };
        const reducedValues = reducerValuesObjects(initial);
        expect(reducedValues).toBe(0);
    });
    it("showOnlySelectedAttributes gives right values", () => {
        const exampleLinear = showOnlySelectedAttributes(
            "ftype",
            0,
            getSubTypeTransitionFunction
        );

        const isLinear = getSubTypeTransitionFunction("ftype", 0);
        const isSigmoidal = getSubTypeTransitionFunction("ftype", undefined);
        const isQuadratic = getSubTypeTransitionFunction("ftype", 1);
        const staticFunction = getSubTypeTransitionFunction("type", 2);
        expect(isLinear).toBe("Linear");
        expect(isSigmoidal).toBe("Sigmoidal");
        expect(isQuadratic).toBe("Quadratic");
        expect(exampleLinear).toBe("Linear");
        expect(staticFunction).toBe(2);
    });
    it("postData Function receive data giving a url", async () => {
        const data = {
            t_init: 0,
            t_end: 600,
            function: {
                function: "events",
                values: [
                    0.3,
                    {
                        function: "sine",
                        min_val: 0,
                        max_val: 1,
                        period: 1,
                        initphase: "min",
                    },
                ],
                days: [
                    [0, 300],
                    [300, 700],
                ],
                default: 1,
            },
        };
        const getDataFunction = await postData(
            "http://192.168.2.131:5003/function",
            data
        );
        expect(getDataFunction.status).toBe("OK");
    });
    it("find value by key in matrix", () => {
        const matrix = Object.entries({
            name: "transition",
            ftype: 1,
            initvalue: 0,
            endvalue: 5,
            concavity: 2,
        });
        const findedValues = findValueByKeyInMatrix(matrix, "ftype", 0);
        expect(findedValues).toBeFalsy();
        const findedValuesTruthy = findValueByKeyInMatrix(matrix, "ftype", 1);
        expect(findedValuesTruthy).toBeTruthy();
        const shouldntFindValueEmptyKey = findValueByKeyInMatrix(
            matrix,
            "",
            ""
        );
        expect(shouldntFindValueEmptyKey).toBeFalsy();
        // sending a bad parameters
        expect(() => findValueByKeyInMatrix("", "ftype", 0)).toThrow();
    });
    it("getDataForGrahicVTD", async () => {
        // createSeries get a truthy response
        const data = [
            0.3,
            {
                function: "sine",
                min_val: 0,
                max_val: 1,
                period: 1,
                initphase: "min",
            },
        ];
        const serie = await createSeries(
            data,
            "http://192.168.2.131:5003/function",
            500,
            0.3,
            [
                [0, 300],
                [300, 500],
            ]
        );
        expect(serie).toBeTruthy();
    });
    it("convert format files", () => {
        // convert to TOML
        const dataForTest = {
            model: "asdf",
            name: "SIR",
        };
        const data = convertFiles(dataForTest);
        expect(typeof data).toBe("string");
        // JSON options return falsy data
        const json = convertFiles(dataForTest, TypeFile.JSON);
        expect(json).toBeFalsy();
        // Convert JSON to CSV
        const csv = convertFiles(dataForTest, TypeFile.CSV);
        expect(typeof csv).toBe("string");
    });
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
    it("formatVariableDependentTime", () => {
        const oneModel:
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
                    name: NameFunction.static,
                    value: 1.3,
                },
            ],
            rangeDays: [[0, 300]],
            isEnabled: true,
            default: 1,
            val: 0.5,
        };
        const formatedData = formatVariableDependentTime(
            dataExampleVariableDependentTime
        );
        const oneCaseFormattedData = formatVariableDependentTime(oneModel);
        // real example
        expect(formatedData).toBeTruthy();
        expect(formatedData).toHaveLength(4);
        // only static values
        expect(oneCaseFormattedData).toBeTruthy();
        expect(oneCaseFormattedData).toHaveLength(1);
        // should failing when function receive wrong type data
        expect(() => {
            return formatVariableDependentTime("asdf");
        }).toThrow();
    });
    it("reducerValuesObjects", () => {
        const initialConditions: InitialConditions = {
            S: 1,
            R: 1,
            I: 1,
            I_d: 1,
            I_ac: 1,
            E: 1,
            H: 1,
            H_acum: 1,
            V: 1,
            V_acum: 1,
            D: 1,
            D_acum: 1,
            Iv: 1,
            H_cap: 1,
        };
        const valuesReduced = reducerValuesObjects(initialConditions);
        expect(valuesReduced).toBeGreaterThanOrEqual(0);
        expect(valuesReduced).toBe(14);
    });
});
