import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";

import { DataFit } from "context/DataFitContext";

interface Props {
    param: string;
    index: number;
}

/**
 * Table with the value of the adjusted data according to ranges.
 * @subcategory DataFitTab
 * @component
 */
const FitParameterTable = ({ param, index }: Props) => {
    const [rangeArray, setRangeArray] = useState([]);
    const [paramValueArray, setParamValueArray] = useState([]);
    const { fittedData } = useContext(DataFit);

    useEffect(() => {
        const lengthData = Object.keys(fittedData[index].I).length;
        const parseParmDays = JSON.parse(fittedData[index].beta_days);
        const parseParam = JSON.parse(fittedData[index][param]);
        setParamValueArray(parseParam);
        setRangeArray([0, ...parseParmDays, lengthData]);
    }, [fittedData, index, param]);

    return (
        <TableContainer>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Interval [days]</Th>
                        <Th>Values</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {paramValueArray.map((paramValue, indexParam) => {
                        return (
                            <Tr key={paramValue}>
                                <Td>
                                    {rangeArray[indexParam]} -{" "}
                                    {rangeArray[indexParam + 1]}
                                </Td>
                                <Td>{paramValue}</Td>
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
        </TableContainer>
    );
};

export default FitParameterTable;
