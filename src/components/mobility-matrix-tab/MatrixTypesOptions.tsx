import { RadioGroup, Radio, Stack } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";

import { MobilityMatrix } from "context/MobilityMatrixContext";
import { NewModelSetted } from "context/NewModelsContext";
import { NewModelsParams } from "types/SimulationTypes";

interface Props {
    matrixType: string;
    setMatrixType: (value: string) => void;
    setIsDynamical: (value: boolean) => void;
}

const MatrixTypesOptions = ({
    matrixType,
    setMatrixType,
    setIsDynamical,
}: Props) => {
    const { idMatrixModel } = useContext(MobilityMatrix);
    const { newModel } = useContext(NewModelSetted);
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        if (idMatrixModel !== 0) {
            const { typeSelection } = newModel.find(
                (model: NewModelsParams) => model.idNewModel === idMatrixModel
            );
            if (typeSelection === "graph") {
                setMatrixType("artificial");
                setIsDisabled(true);
            } else {
                setIsDisabled(false);
                setIsDynamical(true);
            }
        }
    }, [idMatrixModel, newModel, setIsDynamical, setMatrixType]);

    return (
        <>
            {idMatrixModel !== 0 && (
                <RadioGroup
                    size="sm"
                    mb="17px"
                    value={matrixType}
                    onChange={(e) => {
                        setMatrixType(e);
                    }}
                >
                    <Stack direction="row" spacing="24px">
                        <Radio value="artificial">Artificial</Radio>
                        <Radio isDisabled={isDisabled} value="real">
                            Real
                        </Radio>
                    </Stack>
                </RadioGroup>
            )}
        </>
    );
};

export default MatrixTypesOptions;
