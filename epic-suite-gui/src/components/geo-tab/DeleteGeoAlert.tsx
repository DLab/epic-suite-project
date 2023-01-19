import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
    useDisclosure,
    Icon,
    useToast,
} from "@chakra-ui/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import React, { useRef, useContext } from "react";

import { NewModelSetted } from "context/NewModelsContext";
import { SelectFeature } from "context/SelectFeaturesContext";
import { Model } from "types/ControlPanelTypes";
import { NewModelsAllParams } from "types/SimulationTypes";

const DeleteGeoAlert = () => {
    const { completeModel } = useContext(NewModelSetted);
    const { idGeoSelectionUpdate, geoSelections, setGeoSelections, setMode } =
        useContext(SelectFeature);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();
    const toast = useToast();

    /**
     * Delete a geographic selection.
     * @param {number} id of the geographic selection.
     */
    const deleteGeoSelection = (id: number) => {
        localStorage.removeItem("geoSelection");
        const geoSelectionFilter = geoSelections.filter(
            (geoSelection) => geoSelection.id !== +id
        );
        localStorage.setItem(
            "geoSelection",
            JSON.stringify(geoSelectionFilter)
        );
        setGeoSelections({ type: "removeGeoSelection", element: `${id}` });
    };

    return (
        <>
            <Button
                onClick={onOpen}
                bg="#016FB9"
                color="#FFFFFF"
                size="sm"
                borderRadius="4px"
                aria-label="Delete geographic selection"
                p="0"
            >
                <Icon w="20px" h="20px" as={TrashIcon} />
            </Button>

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete selection
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure? You can't undo this action afterwards.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button
                                ref={cancelRef}
                                onClick={onClose}
                                size="sm"
                                fontWeight={700}
                                fontSize="10px"
                                bg="#016FB9"
                                color="#FFFFFF"
                                letterSpacing="0.05em"
                            >
                                CANCEL
                            </Button>
                            <Button
                                onClick={() => {
                                    const isGeoIdUsed = completeModel.some(
                                        (e: NewModelsAllParams) =>
                                            +e.idGeo === +idGeoSelectionUpdate
                                    );

                                    if (isGeoIdUsed) {
                                        toast({
                                            title: "Error",
                                            description:
                                                "This location is used by many models. It couldn´t delete",
                                            status: "error",
                                            duration: 3000,
                                            isClosable: true,
                                            position: "bottom-left",
                                        });
                                    } else {
                                        deleteGeoSelection(
                                            idGeoSelectionUpdate
                                        );
                                    }
                                    setMode(Model.Initial);
                                    onClose();
                                }}
                                size="sm"
                                fontWeight={700}
                                fontSize="10px"
                                ml={3}
                                bg="#016FB9"
                                color="#FFFFFF"
                                letterSpacing="0.05em"
                            >
                                DELETE
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};

export default DeleteGeoAlert;
