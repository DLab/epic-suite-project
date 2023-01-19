import { ChevronRightIcon } from "@chakra-ui/icons";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Icon,
} from "@chakra-ui/react";
import { HomeIcon } from "@heroicons/react/24/outline";
import React, { useContext, useEffect } from "react";

import { NewModelSetted } from "context/NewModelsContext";
import { SelectFeature } from "context/SelectFeaturesContext";
import { TabIndex } from "context/TabContext";
import { Model } from "types/ControlPanelTypes";
import { NewModelsAllParams } from "types/SimulationTypes";

interface Props {
    firstLink: string;
    secondLink?: string;
    setSecondLink?: (value: string) => void;
}

const BreadCrumb = ({ firstLink, secondLink, setSecondLink }: Props) => {
    const {
        completeModel,
        mode: modelMode,
        setMode: setModelMode,
        idModelUpdate: idModel,
    } = useContext(NewModelSetted);
    const { setMode, mode, idGeoSelectionUpdate, geoSelections } =
        useContext(SelectFeature);
    const { setIndex } = useContext(TabIndex);

    useEffect(() => {
        if (firstLink === "Models") {
            if (modelMode === "initial") {
                setSecondLink(undefined);
            }
            if (modelMode === "add") {
                setSecondLink("New");
            }
            if (modelMode === "update") {
                const { name } = completeModel.find(
                    (model: NewModelsAllParams) =>
                        model.idNewModel.toString() === idModel.toString()
                );
                setSecondLink(name);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [completeModel, firstLink, idModel, modelMode]);

    useEffect(() => {
        if (firstLink === "Geographic Selection") {
            if (mode === Model.Initial) {
                setSecondLink(undefined);
            }
            if (mode === Model.Add) {
                setSecondLink("New");
            }
            if (mode === Model.Update) {
                const { name } = geoSelections.find(
                    (selection) =>
                        selection.id.toString() ===
                        idGeoSelectionUpdate.toString()
                );
                setSecondLink(name);
            }
        }
    }, [
        firstLink,
        geoSelections,
        idGeoSelectionUpdate,
        mode,
        secondLink,
        setSecondLink,
    ]);

    return (
        <Breadcrumb
            spacing="8px"
            separator={<ChevronRightIcon color="gray.500" />}
        >
            <BreadcrumbItem>
                <BreadcrumbLink
                    onClick={() => {
                        setIndex(0);
                    }}
                >
                    {" "}
                    <Icon w="18px" h="18px" as={HomeIcon} color="#016FB9" />
                </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
                <BreadcrumbLink
                    onClick={() => {
                        if (firstLink === "Geographic Selection") {
                            setMode(Model.Initial);
                        }
                        if (firstLink === "Models") {
                            setModelMode("initial");
                        }
                    }}
                >
                    {firstLink}
                </BreadcrumbLink>
            </BreadcrumbItem>
            {secondLink && (
                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink>{secondLink}</BreadcrumbLink>
                </BreadcrumbItem>
            )}
        </Breadcrumb>
    );
};

export default BreadCrumb;
