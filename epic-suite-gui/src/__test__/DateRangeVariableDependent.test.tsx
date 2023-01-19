/* eslint-disable @typescript-eslint/dot-notation */
import { Link, Icon } from "@chakra-ui/react";
import {
    fireEvent,
    cleanup,
    getByText,
    prettyDOM,
    render,
    screen,
    getRoles,
} from "@testing-library/react";
import renderer from "react-test-renderer";

import DateRangeVariableDependent from "../components/models-tab/DateRangeVariableDependent";

// import DateRangeVariableDependent from "@/components/models-tab/DateRangeVariableDependent";
const setId = jest.fn((data: number) => undefined);
const setIsRange = jest.fn((data: boolean) => undefined);
const setDate = jest.fn((SetDate: unknown) => undefined);

const DataRangeComponent = (
    init,
    end,
    id,
    beforeRange,
    idRange,
    isRangeUpdating = true
) => {
    return render(
        <DateRangeVariableDependent
            init={init}
            end={end}
            id={id}
            beforeRange={beforeRange}
            setDate={setDate}
            handleInput={{
                setId,
                setIsRange,
            }}
            idRangeUpdating={idRange}
            isRangeUpdating={isRangeUpdating}
        />
    );
};

describe("DateRangeVariableDependent", () => {
    beforeEach(cleanup);
    test("Should inputs are disabled", () => {
        const input = DataRangeComponent(
            0,
            5,
            2,
            1,
            4,
            false
        ).getByDisplayValue(5);
        expect(input["disabled"]).toBe(true);
    });
    test("Should component containing this string: 'Init:','End:'", () => {
        const component = DataRangeComponent(0, 5, 2, 1, 4, false);
        component.getByText(/Init:/i);
        component.getByText(/End:/i);
    });
    test("Input change its value when user editing input value", () => {
        const component = DataRangeComponent(0, 5, 2, 1, 4);
        const initInput = component.getByDisplayValue(0);
        const endInput = component.getByDisplayValue(5);
        fireEvent.input(initInput, {
            target: { value: 2 },
        });
        expect(initInput["value"]).toBe("2");
        screen.getByDisplayValue(2);
        fireEvent.input(endInput, {
            target: { value: 3 },
        });
        expect(endInput["value"]).toBe("3");
    });
    test("if inputs are disabled, check & close button must be hidden", () => {
        const component = DataRangeComponent(0, 5, 2, 1, 4);
        expect(() => screen.getByLabelText(/check date/i)).toThrow();
        expect(() => screen.getByLabelText(/cancel date/i)).toThrow();
    });
    test("external setters are called when user click them", () => {
        const component = DataRangeComponent(1, 5, 2, 1, 2);
        fireEvent.click(component.getByLabelText(/check date/i));
        expect(setId).toBeCalled();
        expect(setIsRange).toBeCalled();
        expect(setDate).toBeCalled();
        fireEvent.click(component.getByLabelText(/cancel date/i));
        expect(setId).toBeCalledTimes(2);
        expect(setIsRange).toBeCalledTimes(2);
    });
});
