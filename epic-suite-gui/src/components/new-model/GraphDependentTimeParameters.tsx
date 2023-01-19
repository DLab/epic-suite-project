import { Button, Flex } from "@chakra-ui/react";
import React from "react";
import Plot from "react-plotly.js";

import VariableDependentTime, {
    DataForGraph,
    Sine,
    Square,
    StaticValue,
    Transition,
} from "types/VariableDependentTime";
import {
    createSeries,
    formatVariableDependentTime,
} from "utils/getDataForGraphicVTD";

type Props = {
    setData: (data: unknown) => void;
    values:
        | VariableDependentTime
        | {
              default: string;
              rangeDays: number[][];
              type: (Sine | Square | Transition | StaticValue)[];
              name: string;
              isEnabled: boolean;
              val: number;
          };
    dataForGraph: DataForGraph;
    duration: number;
};

const GraphDependentTimeParameters = ({
    setData,
    values,
    dataForGraph,
    duration,
}: Props) => {
    return (
        <Flex flexDirection="column" alignItems="center">
            <Plot
                data={[
                    {
                        x: dataForGraph.t,
                        y: dataForGraph.function,
                        type: "scatter",
                    },
                ]}
                layout={{
                    autosize: false,
                    width: 550,
                    height: 200,
                    margin: {
                        l: 50,
                        b: 30,
                        t: 50,
                    },
                    title: `${values.name} `,
                    legend: { xanchor: "end", x: 1, y: 1 },
                    showlegend: true,
                    xaxis: {
                        title: {
                            text: "Days",
                        },
                        autorange: true,
                    },
                    yaxis: {
                        title: {
                            text: "Values",
                        },
                        autorange: true,
                    },
                }}
                config={{
                    editable: false,
                    responsive: true,
                }}
            />
            <Button
                size="sm"
                mt="1%"
                onClick={async () => {
                    setData([
                        await createSeries(
                            formatVariableDependentTime(values),
                            `${process.env.NEXT_PUBLIC_INITIALCONDITIONS_URL}/function`,
                            +duration,
                            +values.default,
                            values.rangeDays
                        ),
                    ]);
                }}
            >
                {" "}
                Show Graph
            </Button>
        </Flex>
    );
};

export default GraphDependentTimeParameters;
