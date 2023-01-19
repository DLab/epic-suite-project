import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
} from "@chakra-ui/react";
import React, { useContext } from "react";

import { SelectFeature } from "../context/SelectFeaturesContext";
import createIdComponent from "utils/createIdcomponent";

interface Props {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}

/**
 * Alert to confirm or cancel the elimination of a geographical selection.
 * @component
 */
const ResetAlerts = ({ isOpen, setIsOpen }: Props) => {
    const {
        scale,
        setCounties: setCountiesSelected,
        setStates: setStatesSelected,
    } = useContext(SelectFeature);
    const onClose = () => setIsOpen(false);
    const cancelRef = React.useRef();

    /**
     * Delete the selected states or counties.
     */
    const handleResetSelected = () => {
        setStatesSelected({ type: "reset" });
        setCountiesSelected({ type: "reset" });
        onClose();
    };

    return (
        <AlertDialog
            id={createIdComponent()}
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
        >
            <AlertDialogOverlay id={createIdComponent()}>
                <AlertDialogContent id={createIdComponent()}>
                    <AlertDialogHeader
                        id={createIdComponent()}
                        fontSize="lg"
                        fontWeight="bold"
                    >
                        Delete Selections
                    </AlertDialogHeader>

                    <AlertDialogBody id={createIdComponent()}>
                        Are you sure? The selected {scale} will be deleted.
                    </AlertDialogBody>

                    <AlertDialogFooter id={createIdComponent()}>
                        <Button
                            id={createIdComponent()}
                            ref={cancelRef}
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            id={createIdComponent()}
                            colorScheme="blue"
                            onClick={handleResetSelected}
                            ml={3}
                        >
                            Reset
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
};

export default ResetAlerts;
