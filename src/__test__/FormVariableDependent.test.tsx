/* eslint-disable @typescript-eslint/dot-notation */
import { cleanup, fireEvent, prettyDOM, render } from "@testing-library/react";

import {
    SinoInputs,
    StaticInputs,
} from "../components/models-tab/FormVariableDependent";

const staticComponent = (value, id, setVal, close) =>
    render(
        <StaticInputs value={value} id={id} setVal={setVal} close={close} />
    );
const sineComponent = (min, max, period, initPhase, id, setVal, close) => {
    return render(
        <SinoInputs
            min={min}
            max={max}
            period={period}
            initPhase={initPhase}
            id={id}
            setVal={setVal}
            close={close}
        />
    );
};
const setValMock = jest.fn((values: unknown) => {});
const closeMock = jest.fn(() => {});
describe("Form Variable Dependent", () => {
    beforeEach(cleanup);
    test("When user add new value in input, this change", () => {
        const utils = staticComponent(2, 1, setValMock, closeMock);
        const input = utils.getByDisplayValue(2);
        fireEvent.input(input, {
            target: {
                value: 4,
            },
        });
        const newValue = utils.getByDisplayValue(4);
        expect(newValue["value"]).toBe("4");
    });
    test("When user click set button, call function", () => {
        const utils = staticComponent(2, 1, setValMock, closeMock);
        const buttonSet = utils.getByText("Set");
        fireEvent.click(buttonSet);
        expect(setValMock).toBeCalled();
        expect(closeMock).toBeCalled();
    });
    test("When user click set button, call function", () => {
        const utils = staticComponent(2, 1, setValMock, closeMock);
        const buttonSet = utils.getByText("Cancel");
        fireEvent.click(buttonSet);
        expect(closeMock).toBeCalled();
    });
    test("change values successfully", () => {
        const utils = sineComponent(0.1, 0.5, 10, 1, 1, setValMock, closeMock);
        const min = utils.getByDisplayValue(0.1);
        const max = utils.getByDisplayValue(0.5);
        const period = utils.getByDisplayValue(10);
        const initPhase = utils.getByDisplayValue(1);
        const option = {
            target: {
                value: 4,
            },
        };
        fireEvent.input(min, option);
        fireEvent.input(max, option);
        fireEvent.input(period, option);
        fireEvent.input(initPhase, option);
        expect(min["value"]).toBe("4");
        expect(max["value"]).toBe("4");
        expect(period["value"]).toBe("4");
        expect(initPhase["value"]).toBe("4");
    });
});
