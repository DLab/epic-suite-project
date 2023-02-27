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
} from "@chakra-ui/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import React, { useRef, useContext } from "react";

import { MobilityMatrix } from "context/MobilityMatrixContext";
import { MobilityModes } from "types/MobilityMatrixTypes";

const DeleteMatrixAlert = () => {
    const {
        setMobilityMatrixList,
        idMobilityMatrixUpdate,
        setMatrixMode,
        mobilityMatrixList,
    } = useContext(MobilityMatrix);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();

    /**
     * Delete a mobility matrix.
     * @param {number} id of the matrix.
     */
    const deleteMatrix = (id: number) => {
        localStorage.removeItem("mobilityMatrixList");
        const mobilityMatrixFiltered = mobilityMatrixList.filter(
            (matrix) => matrix.id !== +id
        );
        localStorage.setItem(
            "mobilityMatrixList",
            JSON.stringify(mobilityMatrixFiltered)
        );
        setMobilityMatrixList({ type: "remove", element: `${id}` });
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
                <Icon w="1.25rem" h="1.25rem" as={TrashIcon} />
            </Button>

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete matrix
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
                                fontSize="0.625rem"
                                bg="#016FB9"
                                color="#FFFFFF"
                                letterSpacing="0.05em"
                            >
                                CANCEL
                            </Button>
                            <Button
                                onClick={() => {
                                    deleteMatrix(idMobilityMatrixUpdate);
                                    setMatrixMode(MobilityModes.Initial);
                                    onClose();
                                }}
                                size="sm"
                                fontWeight={700}
                                fontSize="0.625rem"
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

export default DeleteMatrixAlert;
