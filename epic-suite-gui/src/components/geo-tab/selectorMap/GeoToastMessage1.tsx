import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { Button, useToast, Stack } from "@chakra-ui/react";
import _ from "lodash";
import { useContext, useState, useEffect } from "react";

import DeleteGeoAlert from "../DeleteGeoAlert";
import ToastCustom from "components/ToastCustom";
import { SelectFeature } from "context/SelectFeaturesContext";
import { TabIndex } from "context/TabContext";
import { Model } from "types/ControlPanelTypes";
import { StatusSimulation } from "types/HardSimulationType";
import type { DataGeoSelections } from "types/SelectFeaturesTypes";

interface Props {
    scale: string;
    setScale: (value: string) => void;
    geoSelectionName: string;
}

/**
 * Component to save geographic selections in context and local storage.
 * @subcategory MapTab
 * @component
 */
const GeoToastMessage1 = ({ scale, setScale, geoSelectionName }: Props) => {
    const toast = useToast();
    const [disabledButton, setDisabledButton] = useState(true);
    const {
        states,
        counties,
        geoSelections,
        setGeoSelections,
        mode,
        setMode,
        idGeoSelectionUpdate,
        setIdGeoSelectionUpdate,
        originOfGeoCreation,
    } = useContext(SelectFeature);
    const { setIndex } = useContext(TabIndex);

    const bottomLeft = "bottom-left";

    useEffect(() => {
        if (mode === Model.Update) {
            const {
                name,
                scale: oldScale,
                featureSelected,
            } = geoSelections.find((geoSelection) => {
                return (
                    geoSelection.id.toString() ===
                    idGeoSelectionUpdate.toString()
                );
            });

            const oldData = {
                name,
                scale: oldScale,
                featureSelected,
            };

            const newData = {
                name: geoSelectionName,
                scale,
                featureSelected:
                    (scale === "States" && states) ||
                    (scale === "Counties" && counties),
            };

            if (_.isEqual(oldData, newData)) {
                setDisabledButton(true);
            } else {
                setDisabledButton(false);
            }
        }
    }, [
        counties,
        geoSelectionName,
        geoSelections,
        idGeoSelectionUpdate,
        mode,
        scale,
        states,
    ]);

    /**
     * Save and update geographic selections in local storage.
     */
    const handleDataLocalStorage = () => {
        try {
            const localStorageExist =
                window.localStorage.getItem("geoSelection");
            if (!localStorageExist) {
                window.localStorage.setItem("geoSelection", JSON.stringify([]));
            }
            const dataGeoSelections = {
                id: Date.now(),
                name: geoSelectionName,
                scale,
                featureSelected:
                    (scale === "States" && states) ||
                    (scale === "Counties" && counties),
            };

            const dataGeoSelectionsCreated = JSON.parse(
                localStorage.getItem("geoSelection")
            );

            if (mode === Model.Update) {
                const updateDataParameters = {
                    id: idGeoSelectionUpdate,
                    name: geoSelectionName,
                    scale,
                    featureSelected:
                        (scale === "States" && states) ||
                        (scale === "Counties" && counties),
                };
                const indexDataToUpdate = dataGeoSelectionsCreated.findIndex(
                    (e: { id: number }) => e.id === idGeoSelectionUpdate
                );
                dataGeoSelectionsCreated[indexDataToUpdate] =
                    updateDataParameters;
                localStorage.setItem(
                    "geoSelection",
                    JSON.stringify(dataGeoSelectionsCreated)
                );
                setGeoSelections({
                    type: "updateGeoSelection",
                    element: `${idGeoSelectionUpdate}`,
                    geoPayload: dataGeoSelections,
                });
                setIdGeoSelectionUpdate(0);
                toast({
                    position: bottomLeft,
                    duration: 2000,
                    isClosable: true,
                    render: () => (
                        <ToastCustom
                            title="Selection Edited"
                            status={StatusSimulation.FINISHED}
                        >
                            "Your selection was updated successfully"
                        </ToastCustom>
                    ),
                });
                setMode(Model.Initial);
                setIndex(0);
            } else {
                localStorage.setItem(
                    "geoSelection",
                    JSON.stringify([
                        ...dataGeoSelectionsCreated,
                        dataGeoSelections,
                    ])
                );
                setGeoSelections({
                    type: "addGeoSelection",
                    geoPayload: dataGeoSelections,
                });
                toast({
                    position: bottomLeft,
                    duration: 2000,
                    isClosable: true,
                    render: () => (
                        <ToastCustom
                            title="Geographic Selection Created"
                            status={StatusSimulation.FINISHED}
                        >
                            "Your geographic selection was created successfully"
                        </ToastCustom>
                    ),
                });
                setMode(Model.Initial);
                if (originOfGeoCreation === "modelsTab") {
                    setIndex(1);
                } else {
                    setIndex(0);
                }
            }
        } catch (error) {
            toast({
                position: bottomLeft,
                duration: 2000,
                isClosable: true,
                render: () => (
                    <ToastCustom title="Error" status={StatusSimulation.ERROR}>
                        "Something failed. Try again later!"
                    </ToastCustom>
                ),
            });
        }
    };
    const repeatedNameGeoSelection = (nameGeoSelection: string): boolean => {
        return geoSelections.some(
            (geoSelection: DataGeoSelections) =>
                geoSelection.name === nameGeoSelection
        );
    };
    const veryfyIsSelfName = (
        idMod: number,
        currentNameGeoSelection: string
    ) => {
        return Boolean(
            geoSelections.find(
                (geoSelection: DataGeoSelections) => geoSelection.id === idMod
            )?.name === currentNameGeoSelection
        );
    };
    /**
     * If there is a geographic selection, it sends it to local storage.
     */
    const verifyGeoselection = () => {
        if (!geoSelectionName) {
            toast({
                position: bottomLeft,
                duration: 2000,
                isClosable: true,
                render: () => (
                    <ToastCustom title="Error" status={StatusSimulation.ERROR}>
                        "Cannot save a geographic selection without a name",
                    </ToastCustom>
                ),
            });
        } else if (
            (mode === Model.Add &&
                repeatedNameGeoSelection(geoSelectionName)) ||
            (mode === Model.Update &&
                repeatedNameGeoSelection(geoSelectionName) &&
                !veryfyIsSelfName(idGeoSelectionUpdate, geoSelectionName))
        ) {
            toast({
                position: bottomLeft,
                duration: 2000,
                isClosable: true,
                render: () => (
                    <ToastCustom title="Error" status={StatusSimulation.ERROR}>
                        "Name already exists"
                    </ToastCustom>
                ),
            });
        } else if (states.length !== 0 || counties.length !== 0) {
            handleDataLocalStorage();
        } else {
            toast({
                position: bottomLeft,
                duration: 2000,
                isClosable: true,
                render: () => (
                    <ToastCustom title="Error" status={StatusSimulation.ERROR}>
                        "At least one geographic area must be selected."
                    </ToastCustom>
                ),
            });
        }
    };

    return (
        <Stack spacing={4} direction="row" align="center">
            {mode === Model.Add && (
                <>
                    <Button
                        leftIcon={<CheckIcon />}
                        onClick={() => verifyGeoselection()}
                        bg="#016FB9"
                        color="#FFFFFF"
                        size="sm"
                        disabled={
                            !geoSelectionName ||
                            !scale ||
                            (counties.length === 0 && states.length === 0) ||
                            repeatedNameGeoSelection(geoSelectionName)
                        }
                        borderRadius="4px"
                        fontSize="10px"
                    >
                        CREATE SELECTION
                    </Button>
                    <Button
                        leftIcon={<CloseIcon />}
                        onClick={() => {
                            setScale("States");
                            setMode(Model.Initial);
                            setIdGeoSelectionUpdate(0);
                        }}
                        bg="#B9B9C9"
                        color="#FFFFFF"
                        size="sm"
                        // mt="20px"
                        borderRadius="4px"
                        fontSize="10px"
                    >
                        CANCEL
                    </Button>
                </>
            )}

            {mode === Model.Update && (
                <>
                    <Button
                        leftIcon={<CheckIcon />}
                        onClick={() => verifyGeoselection()}
                        isDisabled={disabledButton}
                        bg="#016FB9"
                        color="#FFFFFF"
                        size="sm"
                        // mt="20px"
                        borderRadius="4px"
                        fontSize="10px"
                    >
                        SAVE CHANGES
                    </Button>
                    <Button
                        leftIcon={<CloseIcon />}
                        bg="#B9B9C9"
                        color="#FFFFFF"
                        size="sm"
                        borderRadius="4px"
                        fontSize="10px"
                        // eslint-disable-next-line sonarjs/no-identical-functions
                        onClick={() => {
                            setScale("States");
                            setMode(Model.Initial);
                            setIdGeoSelectionUpdate(0);
                        }}
                    >
                        CANCEL
                    </Button>
                    <DeleteGeoAlert />
                </>
            )}
        </Stack>
    );
};

export default GeoToastMessage1;
