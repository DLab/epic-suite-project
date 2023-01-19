/* eslint-disable sonarjs/cognitive-complexity */
import {
    Switch,
    Flex,
    Text,
    Button,
    FormControl,
    FormLabel,
    Select,
    Radio,
    RadioGroup,
    DrawerFooter,
    Grid,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { GeometryObject } from "topojson-specification";

import countiesData_ from "../../data/counties-10m.json";
import stateData_ from "../../data/statesResults-10m.json";
import { GraphicsData } from "context/GraphicsContext";
import { NewModelSetted } from "context/NewModelsContext";
import { SelectFeature } from "context/SelectFeaturesContext";
import { MapResultsData } from "types/GraphicsTypes";
import { NewModelsAllParams } from "types/SimulationTypes";

interface Props {
    onClose: (val: boolean) => void;
}

/**
 * Component to configure the display of results on maps.
 * @subcategory Results
 * @component
 */
const ResultsMapsSelection = ({ onClose }: Props) => {
    const [isMap1Checked, setIsMap1Checked] = useState([false, false]);
    const [initialConditionsCheckBox, setinitialConditionsCheckBox] = useState([
        [],
        [],
    ]);
    const [initialConditionsRealCheckBox, setinitialConditionsRealCheckBox] =
        useState([[], []]);
    const [value, setValue] = React.useState(["", ""]);
    const [simIdToShowInMap, setSimIdToShowInMap] = useState(["", ""]);
    const [placeholderText, setPlaceholderText] = useState([
        "Select option",
        "Select option",
    ]);
    const [geoMapInfo, setGeoMapInfo] = useState<unknown[] | GeometryObject[]>([
        {},
        {},
    ]);

    const {
        dataToShowInMap,
        setDataToShowInMap,
        allGraphicData,
        setAllResults,
    } = useContext(GraphicsData);
    const { geoSelections } = useContext(SelectFeature);
    const mapArray = ["Map 1", "Map 2"];
    const { selectedModelsToSimulate } = useContext(NewModelSetted);

    /**
     * Returns an array with the keys of the initial conditions according to the id of the simulation.
     * @param {number} simId simulation id.
     * @returns {string[]}
     */
    const getInitialConditionsCheck = (simId, typeSim) => {
        // const initialConditionsSim = selectedModelsToSimulate.filter(
        //     (sim: NewModelsAllParams) => {
        //         return sim.idNewModel.toString() === simId;
        //     }
        // );

        // if (initialConditionsSim[0].modelType === "seir") {
        if (typeSim === "Sim") {
            return ["E", "E_d", "I", "I_d", "R", "R_d", "S"];
        }
        return ["D_d", "D_ac", "I", "I_ac", "I_d", "P"];

        // }
        // return Object.keys(
        //     initialConditionsSim[0]?.initialConditions[0].conditionsValues
        // );
    };

    useEffect(() => {
        const placeholderTextAux = placeholderText;
        if (dataToShowInMap.length === 1) {
            placeholderTextAux[0] = dataToShowInMap[0].nameSim;
            setPlaceholderText(placeholderTextAux);
        }
        if (dataToShowInMap.length === 2) {
            placeholderTextAux[0] = dataToShowInMap[0].nameSim;
            placeholderTextAux[1] = dataToShowInMap[1].nameSim;
            setPlaceholderText(placeholderTextAux);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const simIdToShowInMapAux = simIdToShowInMap;
        const geoMapInfoAux = geoMapInfo;
        const valueAux = value;
        const initialConditionsCheckBoxAux = initialConditionsCheckBox;
        const initialConditionsRealCheckBoxAux = initialConditionsRealCheckBox;
        if (
            dataToShowInMap.length === 1 &&
            dataToShowInMap[0].nameSim !== undefined
        ) {
            setIsMap1Checked([true, false]);
            simIdToShowInMapAux[0] = dataToShowInMap[0].idSim;
            geoMapInfoAux[0] = dataToShowInMap[0].geoDataSelected;
            setSimIdToShowInMap(simIdToShowInMapAux);
            setGeoMapInfo(geoMapInfoAux);
            valueAux[0] = dataToShowInMap[0].parameter;
            setValue(valueAux);
            initialConditionsCheckBoxAux[0] = getInitialConditionsCheck(
                dataToShowInMap[0].idSim,
                "Sim"
            );
            initialConditionsRealCheckBoxAux[0] = getInitialConditionsCheck(
                dataToShowInMap[0].idSim,
                "Real"
            );
            setinitialConditionsCheckBox(initialConditionsCheckBoxAux);
            setinitialConditionsRealCheckBox(initialConditionsRealCheckBoxAux);
        }
        if (
            dataToShowInMap.length === 2 &&
            dataToShowInMap[1].nameSim !== undefined
        ) {
            setIsMap1Checked([true, true]);
            simIdToShowInMapAux[0] = dataToShowInMap[0].idSim;
            simIdToShowInMapAux[1] = dataToShowInMap[1].idSim;
            geoMapInfoAux[0] = dataToShowInMap[0].geoDataSelected;
            geoMapInfoAux[1] = dataToShowInMap[1].geoDataSelected;
            setSimIdToShowInMap(simIdToShowInMapAux);
            setGeoMapInfo(geoMapInfoAux);
            valueAux[0] = dataToShowInMap[0].parameter;
            valueAux[1] = dataToShowInMap[1].parameter;
            setValue(valueAux);
            initialConditionsCheckBoxAux[0] = getInitialConditionsCheck(
                dataToShowInMap[0].idSim,
                "Sim"
            );
            initialConditionsRealCheckBoxAux[0] = getInitialConditionsCheck(
                dataToShowInMap[0].idSim,
                "Real"
            );
            initialConditionsCheckBoxAux[1] = getInitialConditionsCheck(
                dataToShowInMap[1].idSim,
                "Sim"
            );
            initialConditionsRealCheckBoxAux[1] = getInitialConditionsCheck(
                dataToShowInMap[1].idSim,
                "Real"
            );
            setinitialConditionsCheckBox(initialConditionsCheckBoxAux);
            setinitialConditionsRealCheckBox(initialConditionsRealCheckBoxAux);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Returns a json with the data of the polygons to use.
     * @param {number} idSim simulation id.
     * @returns {GeometryObject}
     */
    const getGeoDataSelected = (idSim) => {
        const { idGeo } = selectedModelsToSimulate.filter(
            (sim: NewModelsAllParams) => {
                return sim.idNewModel.toString() === idSim;
            }
        )[0];

        const { scale } = geoSelections.filter((geoSelection) => {
            return geoSelection.id === idGeo;
        })[0];

        const geoSelection = geoSelections.find(
            (element) => element.id === idGeo
        );
        let dataAux;
        if (scale === "States") {
            dataAux = JSON.parse(JSON.stringify(stateData_));
            const stateObject = JSON.parse(
                JSON.stringify(stateData_.objects.states.geometries)
            );
            const statesGeometries = geoSelection.featureSelected.map((id) => {
                return stateObject.filter((geometrieId) => {
                    return geometrieId.id === id;
                })[0];
            });
            dataAux.objects.states.geometries = statesGeometries;
        }
        if (scale === "Counties") {
            dataAux = JSON.parse(JSON.stringify(countiesData_));
            const countiesObject = JSON.parse(
                JSON.stringify(countiesData_.objects.counties.geometries)
            );
            const countiesGeometries = geoSelection.featureSelected.map(
                (id) => {
                    return countiesObject.filter((geometrieId) => {
                        return geometrieId.id === id;
                    })[0];
                }
            );
            dataAux.objects.counties.geometries = countiesGeometries;
        }

        return dataAux;
    };

    /**
     * Returns an object with the information to display on maps.
     * @param {number} index
     * @returns {MapResultsData}
     */
    const getDataToSave = (index: number) => {
        const {
            name,
            parameters,
            idGeo,
            t_init: tInit,
        } = selectedModelsToSimulate.filter((sim: NewModelsAllParams) => {
            return sim.idNewModel.toString() === simIdToShowInMap[index];
        })[0];

        const { scale } = geoSelections.filter((geoSelection) => {
            return geoSelection.id === idGeo;
        })[0];

        return {
            scale,
            nameSim: name,
            idSim: simIdToShowInMap[index],
            parameter: value[index],
            idGeo,
            duration: parameters.t_end,
            date: tInit,
            idMap: index,
            geoDataSelected: geoMapInfo[index],
        };
    };

    /**
     * Save the map information in the results context by clicking the "OK" button.
     */
    const saveDataToShowInMap = () => {
        const dataToShowInMapAux = dataToShowInMap;
        if (value[0] !== "") {
            const map1 = getDataToSave(0);
            dataToShowInMapAux[0] = map1;
        }
        if (value[1] !== "") {
            const map2 = getDataToSave(1);
            dataToShowInMapAux[1] = map2;
        }
        const setMaps = new Promise<void>((resolve, reject) => {
            setDataToShowInMap(dataToShowInMapAux);
            setAllResults([]);
            resolve();
        });
        setMaps.then(() => {
            setAllResults([].concat(dataToShowInMapAux, allGraphicData));
        });
    };

    return (
        <>
            {mapArray.map((map, index) => {
                const placeholderAux = placeholderText[index];
                return (
                    <FormControl
                        display="flex"
                        alignItems="center"
                        flexDirection="column"
                        m="5% 0"
                        key={map}
                    >
                        <Flex w="100%" m="2% 0">
                            <FormLabel mb="0">{map}</FormLabel>
                            <Switch
                                isChecked={isMap1Checked[index]}
                                onChange={(e) => {
                                    if (e.target.checked === false) {
                                        setinitialConditionsCheckBox([
                                            ...initialConditionsCheckBox.slice(
                                                0,
                                                index
                                            ),
                                            [],
                                            ...initialConditionsCheckBox.slice(
                                                index + 1
                                            ),
                                        ]);
                                        setinitialConditionsRealCheckBox([
                                            ...initialConditionsRealCheckBox.slice(
                                                0,
                                                index
                                            ),
                                            [],
                                            ...initialConditionsRealCheckBox.slice(
                                                index + 1
                                            ),
                                        ]);
                                        setValue([
                                            ...value.slice(0, index),
                                            "",
                                            ...value.slice(index + 1),
                                        ]);
                                        setSimIdToShowInMap([
                                            ...simIdToShowInMap.slice(0, index),
                                            "",
                                            ...simIdToShowInMap.slice(
                                                index + 1
                                            ),
                                        ]);
                                        setGeoMapInfo([
                                            ...geoMapInfo.slice(0, index),
                                            {},
                                            ...geoMapInfo.slice(index + 1),
                                        ]);
                                    }

                                    setIsMap1Checked([
                                        ...isMap1Checked.slice(0, index),
                                        e.target.checked,
                                        ...isMap1Checked.slice(index + 1),
                                    ]);
                                }}
                            />
                        </Flex>
                        {isMap1Checked[index] ? (
                            <>
                                <Select
                                    placeholder={placeholderAux}
                                    w="95%"
                                    m="0 2% 3% 2%"
                                    onChange={(e) => {
                                        const simId = e.target.value;
                                        // const initialConditionsSim =
                                        //     selectedModelsToSimulate.filter(
                                        //         (sim: NewModelsAllParams) => {
                                        //             return (
                                        //                 sim.idNewModel.toString() ===
                                        //                 simId
                                        //             );
                                        //         }
                                        //     );
                                        // let initialConditionsStrg;
                                        // let initialConditionsRealStrg;
                                        // if (
                                        //     initialConditionsSim[0]
                                        //         .populationType ===
                                        //     "metapopulation"
                                        // ) {
                                        const initialConditionsStrg = [
                                            "E",
                                            "E_d",
                                            "I",
                                            "I_d",
                                            "R",
                                            "R_d",
                                            "S",
                                        ];
                                        const initialConditionsRealStrg = [
                                            "D_d",
                                            "D_ac",
                                            "I",
                                            "I_ac",
                                            "I_d",
                                            "P",
                                        ];
                                        // } else {
                                        //     initialConditionsStrg = Object.keys(
                                        //         initialConditionsSim[0]
                                        //             .initialConditions[0]
                                        //             .conditionsValues
                                        //     );
                                        //     initialConditionsRealStrg =
                                        //         Object.keys(
                                        //             initialConditionsSim[0]
                                        //                 .initialConditions[0]
                                        //                 .conditionsValues
                                        //         );
                                        // }
                                        setinitialConditionsCheckBox([
                                            ...initialConditionsCheckBox.slice(
                                                0,
                                                index
                                            ),
                                            initialConditionsStrg,
                                            ...initialConditionsCheckBox.slice(
                                                index + 1
                                            ),
                                        ]);
                                        setinitialConditionsRealCheckBox([
                                            ...initialConditionsRealCheckBox.slice(
                                                0,
                                                index
                                            ),
                                            initialConditionsRealStrg,
                                            ...initialConditionsRealCheckBox.slice(
                                                index + 1
                                            ),
                                        ]);
                                        setSimIdToShowInMap([
                                            ...simIdToShowInMap.slice(0, index),
                                            simId,
                                            ...simIdToShowInMap.slice(
                                                index + 1
                                            ),
                                        ]);

                                        if (index === 0) {
                                            const geoInfoMap1 =
                                                getGeoDataSelected(simId);

                                            setGeoMapInfo([
                                                geoInfoMap1,
                                                geoMapInfo[1],
                                            ]);
                                        }
                                        if (index === 1) {
                                            const geoInfoMap2 =
                                                getGeoDataSelected(simId);

                                            setGeoMapInfo([
                                                geoMapInfo[0],
                                                geoInfoMap2,
                                            ]);
                                        }
                                    }}
                                >
                                    {selectedModelsToSimulate.map(
                                        (sim: NewModelsAllParams) => {
                                            return (
                                                sim.typeSelection ===
                                                    "geographic" && (
                                                    <option
                                                        key={sim.idNewModel}
                                                        value={sim.idNewModel}
                                                    >
                                                        {sim.name}
                                                    </option>
                                                )
                                            );
                                        }
                                    )}
                                </Select>
                                {initialConditionsCheckBox[index].length >
                                    0 && (
                                    <RadioGroup
                                        w="100%"
                                        onChange={(e) => {
                                            setValue([
                                                ...value.slice(0, index),
                                                e,
                                                ...value.slice(index + 1),
                                            ]);
                                        }}
                                        value={value[index]}
                                    >
                                        <Text mx="7%">Results</Text>
                                        <Grid
                                            mx="7%"
                                            templateColumns="repeat(3, 1fr)"
                                            gap={3}
                                        >
                                            {initialConditionsCheckBox[
                                                index
                                            ]?.map((paramKey) => {
                                                return (
                                                    <Radio
                                                        bg="white"
                                                        value={`${paramKey}`}
                                                        key={paramKey}
                                                    >
                                                        {paramKey}
                                                    </Radio>
                                                );
                                            })}
                                        </Grid>
                                        <Text mx="7%">Data</Text>
                                        <Grid
                                            mx="7%"
                                            templateColumns="repeat(3, 1fr)"
                                            gap={3}
                                        >
                                            {initialConditionsRealCheckBox[
                                                index
                                            ]?.map((paramKeyData) => {
                                                if (paramKeyData !== "R") {
                                                    return (
                                                        <Radio
                                                            bg="white"
                                                            value={`${paramKeyData} Real`}
                                                            key={`${paramKeyData} Real`}
                                                        >
                                                            {paramKeyData}
                                                        </Radio>
                                                    );
                                                }
                                                return false;
                                            })}
                                        </Grid>
                                    </RadioGroup>
                                )}
                            </>
                        ) : (
                            <Select
                                placeholder="Select option"
                                w="95%"
                                m="0 2%"
                                isDisabled
                            />
                        )}
                    </FormControl>
                );
            })}
            <DrawerFooter justifyContent="space-around">
                <Button
                    colorScheme="teal"
                    onClick={() => {
                        saveDataToShowInMap();
                        onClose(true);
                    }}
                >
                    Ok
                </Button>
                <Button
                    variant="outline"
                    onClick={() => {
                        onClose(true);
                    }}
                >
                    Cancel
                </Button>
            </DrawerFooter>
        </>
    );
};

export default ResultsMapsSelection;
