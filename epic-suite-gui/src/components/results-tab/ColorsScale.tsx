import React, { useCallback, useEffect, useState } from "react";

import { colorGradient } from "./getColorsScales";

interface Props {
    maxValue: number;
    colorScale: string;
}

/**
 * Color scale for map display.
 * @subcategory Results
 * @component
 */
const ColorsScale = ({ maxValue, colorScale }: Props) => {
    const [scaleValues, setScaleValues] = useState([]);

    const getScaleValues = useCallback(() => {
        const rangeValue = Math.ceil(
            maxValue / colorGradient[colorScale].length
        );
        let min;
        let max;
        return colorGradient[colorScale].map((cc, ic) => {
            const index = colorGradient[colorScale].length - ic;
            if (ic === colorGradient[colorScale].length - 1) {
                min = 0;
                max = rangeValue;
            } else if (ic === 1 || ic === 3 || ic === 5 || ic === 7) {
                min = "none";
            } else if (ic === 0) {
                min = maxValue;
            } else {
                min = (index - 1) * rangeValue + 1;
                max = index * rangeValue;
            }
            return {
                color: `linear-gradient(${cc})`,
                minValue: min,
                maxValue: max,
            };
        });
    }, [colorScale, maxValue]);

    useEffect(() => {
        setScaleValues(getScaleValues());
    }, [getScaleValues]);

    /**
     * Returns the unit to which it should be rounded according to the maximum value of the simulation.
     * @returns {number}
     */
    const getQuantityIndicator = () => {
        let indicator;
        if (maxValue / 1000 >= 1) {
            indicator = 1000;
        } else if (maxValue / 100 >= 1) {
            indicator = 100;
        } else if (maxValue / 10 >= 1) {
            indicator = 10;
        } else {
            indicator = 1;
        }
        return indicator;
    };

    return (
        <div className="info legend">
            {scaleValues.map((scale) => {
                const quantityIndicator = getQuantityIndicator();
                const minRound =
                    Math.round(scale.minValue / quantityIndicator) *
                    quantityIndicator;

                return (
                    <div key={scale.color} style={{ textAlign: "initial" }}>
                        <i
                            className="box-legend"
                            style={{ background: scale.color }}
                        />
                        {scale.minValue !== "none" && (
                            <span>
                                {new Intl.NumberFormat("de-DE").format(
                                    minRound
                                )}
                            </span>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ColorsScale;
