import {
    Flex,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    IconButton,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";

import PauseIcon from "components/icons/PauseIcon";
import PlayIcon from "components/icons/PlayIcon";
import { GraphicsData } from "context/GraphicsContext";
import type { KeysRealData, MapResultsData } from "types/GraphicsTypes";

interface Props {
    map: MapResultsData;
    isPlaying: boolean;
    setIsPlaying: (val: boolean) => void;
    simDay: number;
    setSimDay: (val: number) => void;
    population?: string;
}

/**
 * Component that allows you to put play or pause the visualization of the result of a simulation.
 * @subcategory Results
 * @component
 */
const PlayDataSlider = ({
    map,
    isPlaying,
    setIsPlaying,
    simDay,
    setSimDay,
    population,
}: Props) => {
    const [maxDayValue, setMaxDayValue] = useState(500);
    const { realDataSimulationKeys } = useContext(GraphicsData);

    useEffect(() => {
        if (map.parameter.includes("Real")) {
            let parameterValues;
            if (population === "metapopulation") {
                parameterValues = realDataSimulationKeys[0].I;
            } else {
                parameterValues = realDataSimulationKeys.filter(
                    (sim: KeysRealData) => {
                        return sim.name === map.nameSim;
                    }
                )[0].I;
            }
            const parameterValuesLength = Object.keys(parameterValues).length;
            setMaxDayValue(parseInt(parameterValuesLength.toString(), 10) - 1);
        } else {
            setMaxDayValue(parseInt(map.duration.toString(), 10) - 1);
        }
    }, [
        map.duration,
        map.nameSim,
        map.parameter,
        population,
        realDataSimulationKeys,
    ]);

    return (
        <Flex w="95%" m="2% 0">
            {!isPlaying ? (
                <IconButton
                    fontSize="20px"
                    bg="#016FB9"
                    color="#FFFFFF"
                    fill="white"
                    aria-label="Play"
                    size="sm"
                    cursor="pointer"
                    icon={<PlayIcon />}
                    mr="1rem"
                    onClick={() => {
                        setIsPlaying(true);
                    }}
                />
            ) : (
                <IconButton
                    fontSize="20px"
                    bg="#016FB9"
                    color="#FFFFFF"
                    fill="white"
                    aria-label="Play"
                    size="sm"
                    cursor="pointer"
                    icon={<PauseIcon />}
                    mr="1rem"
                    onClick={() => {
                        setIsPlaying(false);
                    }}
                />
            )}

            <Slider
                aria-label="slider-ex-1"
                defaultValue={1}
                max={maxDayValue}
                value={simDay}
                onChange={(value) => {
                    setSimDay(value);
                    setIsPlaying(false);
                }}
            >
                <SliderTrack>
                    <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
            </Slider>
        </Flex>
    );
};

export default PlayDataSlider;
