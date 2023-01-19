import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Text,
    Icon,
} from "@chakra-ui/react";
import React from "react";

import InfoIcon from "components/icons/InfoIcon";
import NewLogo from "components/icons/NewLogo";

const AboutModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            <Icon
                w={7}
                h={7}
                as={InfoIcon}
                color="#FFFFFF"
                mb="15%"
                cursor="pointer"
                onClick={onOpen}
            />
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent
                    bg="#1B1B3A"
                    borderRadius="8px"
                    maxW="716px"
                    maxH="550px"
                    p="20px"
                >
                    <ModalHeader textAlign="center">
                        <Icon
                            as={NewLogo}
                            w={210}
                            h={110}
                            aria-label="EPIc Suite Logo"
                            fill="none"
                        />
                    </ModalHeader>
                    <ModalCloseButton bg="#016FB9" color="#FFFFFF" />
                    <ModalBody>
                        <Text color="#FFFFFF" textAlign="justify" m="15px 40px">
                            {" "}
                            The EPIc Suite is a web-based platform designed as
                            an enabling tool for epidemiological modeling and
                            simulation. The suite allows the creation of
                            pipelines for scientific research on epidemics,
                            offering capabilities for working with data,
                            embedding it in models, running simulations and
                            performing analysis and projections.
                            <br />
                            <br />
                            It is designed with a mix of simplicity of use,
                            offering a variety of tools, such as data
                            extraction, data fitting heuristics, dynamic
                            parameters for modeling tendency changes like
                            non-pharmaceutical interventions or new variant
                            appearance, integrated function builder, integrated
                            parameter sensitivity analysis, among others.
                        </Text>
                    </ModalBody>

                    <ModalFooter justifyContent="center">
                        <Text color="#3EBFE0">2022</Text>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default AboutModal;
