import { cleanup, fireEvent, prettyDOM, render } from "@testing-library/react";

import PopoverVariableDependent from "../components/models-tab/PopoverVariableDependent";

const setValues = jest.fn((values: unknown) => undefined);
const dataForStatic = {
    name: "static",
    value: 3,
};
const dataForSine = {
    name: "sinusoidal",
    min: 0,
    max: 1,
    initPhase: 0,
    period: 20,
};
const dataSquare = {
    ...dataForSine,
    name: "square",
    duty: 1,
};
const dataTransition = {
    name: "transition",
    initValue: 0,
    endValue: 1,
    ftype: 0,
    concavity: 0,
};
describe("Popover VDT", () => {
    beforeEach(cleanup);
    const PopoverComponent = (data, i) =>
        render(
            <PopoverVariableDependent data={data} setValues={setValues} i={i} />
        );
    test("render component successfully", () => {
        const component = PopoverComponent(dataForStatic, 1);
    });
    test("render Static Input component after click trigger button", () => {
        const component = PopoverComponent(dataForStatic, 1);
        const buttonTriggerPopover = component.getByRole("button");
        fireEvent.click(buttonTriggerPopover);
        component.getByText("Static Value:");
    });
    test("render Sinusoidal Input component after click trigger button", () => {
        const component = PopoverComponent(dataForSine, 1);
        const buttonTriggerPopover = component.getByRole("button");
        fireEvent.click(buttonTriggerPopover);
        component.getByText("Sinusoidal");
    });
    test("render Square Input component after click trigger button", () => {
        const component = PopoverComponent(dataSquare, 1);
        const buttonTriggerPopover = component.getByRole("button");
        fireEvent.click(buttonTriggerPopover);
        component.getByText("Square");
    });
    test("render Transition Input component after click trigger button", () => {
        const component = PopoverComponent(dataTransition, 1);
        const buttonTriggerPopover = component.getByRole("button");
        fireEvent.click(buttonTriggerPopover);
        component.getByText("Transition");
    });
});
