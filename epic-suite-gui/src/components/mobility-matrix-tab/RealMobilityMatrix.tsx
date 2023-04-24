import { Button } from "@chakra-ui/react";
import { parse, isAfter, isBefore } from "date-fns";
import React, { useContext, useEffect, useState } from "react";

import { MobilityMatrix } from "context/MobilityMatrixContext";
import { NewModelSetted } from "context/NewModelsContext";
import { SelectFeature } from "context/SelectFeaturesContext";
import type { InterventionsTypes } from "types/MobilityMatrixTypes";
import type { DataGeoSelections } from "types/SelectFeaturesTypes";
import type { NewModelsParams } from "types/SimulationTypes";
import { getRealMatrix } from "utils/fetchData";
import { formatDate } from "utils/formatDate";

import MobilityInterventions from "./MobilityInterventions";

interface Props {
    interventionList: InterventionsTypes[] | [];
    setInterventionList: (value: InterventionsTypes[] | []) => void;
}

function ajustDateToDateRange(dateString: string): string {
    const date = parse(dateString, "yyyyMMdd", new Date());
    const minDate = parse("20190101", "yyyyMMdd", new Date());
    const maxDate = parse("20220101", "yyyyMMdd", new Date());
    if (isAfter(date, minDate) && isBefore(date, maxDate)) {
        return dateString;
    }
    return isAfter(date, minDate) ? "20211231" : "20190101";
}

const RealMobilityMatrix = ({
    interventionList,
    setInterventionList,
}: Props) => {
    const { setMatrix, idMatrixModel } = useContext(MobilityMatrix);
    const [isLoading, setIsLoading] = useState(false);
    const { newModel } = useContext(NewModelSetted);
    const { geoSelections } = useContext(SelectFeature);
    const [request, setRequest] = useState(undefined);

    useEffect(() => {
        const { t_init: init, idGeo } = newModel.find(
            (newMod: NewModelsParams) => newMod.idNewModel === idMatrixModel
        );
        const { featureSelected, scale } = geoSelections.find(
            (geoSel: DataGeoSelections) => geoSel.id === idGeo
        );
        const reqChunk = {
            timeInit: formatDate(
                ajustDateToDateRange(init.replaceAll("/", ""))
            ),
            timeEnd: "2021-12-31",
            scale,
            spatialSelection: featureSelected,
        };
        setRequest(reqChunk);
    }, [geoSelections, idMatrixModel, newModel, setRequest]);
    // console.log("-->", newModel, geoSelections);
    return (
        <>
            <Button
                isLoading={isLoading}
                loadingText="Submitting"
                size="sm"
                fontSize="10px"
                bg="#016FB9"
                color="#FFFFFF"
                w="100px"
                onClick={() =>
                    getRealMatrix(setMatrix, setIsLoading, request ?? undefined)
                }
            >
                GET MATRIX
            </Button>
            {/* descomentar cuando se implemente las intervenciones */}
            {/* <MobilityInterventions
                interventionList={interventionList}
                setInterventionList={setInterventionList}
            /> */}
        </>
    );
};

export default RealMobilityMatrix;
