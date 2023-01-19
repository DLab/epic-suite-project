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

import { GraphicsData } from "context/GraphicsContext";
import { NewModelSetted } from "context/NewModelsContext";
import { NewModelsAllParams } from "types/SimulationTypes";

interface Props {
    setModelMode: (value: string) => void;
}

const DeleteModelAlert = ({ setModelMode }: Props) => {
    const {
        setNewModel,
        completeModel,
        setCompleteModel,
        idModelUpdate: id,
    } = useContext(NewModelSetted);
    const {
        setAllGraphicData,
        setRealDataSimulationKeys,
        setDataToShowInMap,
        setAllResults,
    } = useContext(GraphicsData);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();

    const deleteFromLocalStorage = () => {
        const modelFilter = [...completeModel].filter(
            (model: NewModelsAllParams) => model.idNewModel !== +id
        );
        localStorage.setItem("newModels", JSON.stringify(modelFilter));
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
                            Delete model
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
                                    setNewModel({
                                        type: "remove",
                                        element: id,
                                    });
                                    setCompleteModel({
                                        type: "remove",
                                        element: id,
                                    });
                                    deleteFromLocalStorage();
                                    setAllGraphicData([]);
                                    setRealDataSimulationKeys([]);
                                    setDataToShowInMap([]);
                                    setAllResults([].concat([], []));
                                    setModelMode("initial");
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

export default DeleteModelAlert;
