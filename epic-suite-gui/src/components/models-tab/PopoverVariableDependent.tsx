import { EditIcon } from "@chakra-ui/icons";
import {
    IconButton,
    Popover,
    PopoverContent,
    PopoverTrigger,
    useDisclosure,
} from "@chakra-ui/react";
import React from "react";

import type {
    TransitionFunction,
    TypePhase,
} from "types/VariableDependentTime";

import {
    SinoInputs,
    SquareInputs,
    StaticInputs,
    TransitionInputs,
} from "./FormVariableDependent";

interface Props {
    data: DataPopover;
    setValues: (values: unknown) => void;
    i: number;
}
interface DataPopover {
    name?: string;
    value?: number;
    min?: number;
    max?: number;
    initvalue?: number;
    endvalue?: number;
    concavity?: number;
    initPhase?: TypePhase;
    period?: number;
    duty?: number;
    ftype?: TransitionFunction;
    gw?: number;
}
const PopoverVariableDependent = ({ data, setValues, i }: Props) => {
    const { onOpen, onClose, isOpen } = useDisclosure();
    return (
        <Popover isLazy isOpen={isOpen} onClose={onClose} onOpen={onOpen}>
            <PopoverTrigger>
                <IconButton
                    bg="#FFFFFF"
                    color="#16609E"
                    aria-label="Call Segun"
                    size="xs"
                    cursor="pointer"
                    icon={<EditIcon />}
                />
            </PopoverTrigger>
            <PopoverContent>
                {data.name === "static" && (
                    <StaticInputs
                        value={data.value}
                        id={i}
                        setVal={setValues}
                        close={onClose}
                    />
                )}
                {data.name === "sinusoidal" && (
                    <SinoInputs
                        min={data.min}
                        max={data.max}
                        initPhase={data.initPhase}
                        period={data.period}
                        setVal={setValues}
                        id={i}
                        close={onClose}
                    />
                )}
                {data.name === "square" && (
                    <SquareInputs
                        min={data.min}
                        max={data.max}
                        initPhase={data.initPhase}
                        period={data.period}
                        duty={data.duty}
                        setVal={setValues}
                        id={i}
                        close={onClose}
                    />
                )}
                {data.name === "transition" && (
                    <TransitionInputs
                        initvalue={data.initvalue}
                        endvalue={data.endvalue}
                        ftype={data.ftype}
                        concavity={data.concavity}
                        setVal={setValues}
                        id={i}
                        close={onClose}
                    />
                )}
            </PopoverContent>
        </Popover>
    );
};

export default PopoverVariableDependent;
