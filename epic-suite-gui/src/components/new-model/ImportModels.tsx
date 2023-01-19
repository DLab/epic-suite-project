/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
/* eslint-disable no-nested-ternary */
import { AttachmentIcon } from "@chakra-ui/icons";
import {
    useDisclosure,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Center,
    Tooltip,
    IconButton,
} from "@chakra-ui/react";
import _ from "lodash";
import { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";

import { REGEXTYPEMODEL } from "constants/verifyAttrTomlConstants";
import { NewModelSetted } from "context/NewModelsContext";
import { SelectFeature } from "context/SelectFeaturesContext";
import { update } from "store/ControlPanel";
import { EpidemicsData, InitialConditions } from "types/ControlPanelTypes";
import { DataParameters } from "types/ModelsTypes";
import { Action } from "types/SelectFeaturesTypes";
import { EpicConfigToml } from "types/TomlTypes";
import addInLocalStorage from "utils/addInLocalStorage";
import compareDate from "utils/compareDate";
import convertFiles, { TypeFile } from "utils/convertFiles";
import {
    cleanInitialConditions,
    TomlInitialConditions,
    prepareChunk,
    // TomlInitialConditions,
} from "utils/createChunkDependentTime";
import verifyAttrTomlRight from "utils/verifyAttrTomlRight";
import verifyTomlTypesAttr from "utils/verifyTomlTypesAttr";

import getGeoNames from "./getGeoNames";

const position = "bottom-left";

/**
 * Component that provides the functionality to be able to import models.
 * @subcategory models-tab
 * @component
 */
const ImportModels = () => {
    const { setGeoSelections } = useContext(SelectFeature);
    const { setCompleteModel, setNewModel } = useContext(NewModelSetted);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    return (
        <>
            <Tooltip label="Upload a simulation from TOML file config">
                <IconButton
                    bg="#FFFFFF"
                    color="#16609E"
                    aria-label="Call Segun"
                    size="sm"
                    cursor="pointer"
                    icon={<AttachmentIcon />}
                    onClick={onOpen}
                />
            </Tooltip>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Upload a file</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Center>
                            <input
                                type="file"
                                accept="application/toml"
                                onChange={(e) => {
                                    if (
                                        window.File &&
                                        window.FileReader &&
                                        window.FileList &&
                                        window.Blob
                                    ) {
                                        const reader = new FileReader();
                                        reader.readAsText(
                                            e.target.files[0],
                                            "UTF-8"
                                        );
                                        reader.onload = (est) => {
                                            // import data raw like JSON
                                            try {
                                                const importedData: EpicConfigToml =
                                                    convertFiles(
                                                        est.target.result,
                                                        TypeFile.JSON
                                                    ) as unknown as EpicConfigToml;
                                                verifyAttrTomlRight(
                                                    importedData
                                                );
                                                verifyTomlTypesAttr(
                                                    importedData
                                                );
                                                // transform parameters, initial conditions, date simulation
                                                // geographical entities for adding to diferents react context
                                                const {
                                                    compartments,
                                                    name,
                                                    model,
                                                } = importedData.model;
                                                const parameters = {
                                                    ...importedData.parameters
                                                        .dynamic,
                                                    ...importedData.parameters
                                                        .static,
                                                    compartments,
                                                    name_model: name,
                                                    name: model.match(
                                                        REGEXTYPEMODEL
                                                    )[0],
                                                };
                                                const geographData =
                                                    importedData.data;
                                                const idModel = Date.now();
                                                const idGeo = Date.now();

                                                const geoForAdd: Action = {
                                                    type: "addGeoSelection",
                                                    geoPayload: {
                                                        id: idGeo,
                                                        name:
                                                            geographData
                                                                .loc_name
                                                                .length > 0
                                                                ? geographData.loc_name
                                                                : "Imported from TOML",
                                                        scale:
                                                            (geographData.state
                                                                .length > 0
                                                                ? "States"
                                                                : geographData
                                                                      .county
                                                                      .length >
                                                                  0
                                                                ? "Counties"
                                                                : "") ?? "",
                                                        featureSelected:
                                                            geographData.state
                                                                .length > 0
                                                                ? _.isString(
                                                                      geographData.state
                                                                  )
                                                                    ? Array.of(
                                                                          geographData.state
                                                                      )
                                                                    : Array.from(
                                                                          geographData.state
                                                                      )
                                                                : geographData
                                                                      .county
                                                                      .length >
                                                                  0
                                                                ? _.isString(
                                                                      geographData.county
                                                                  )
                                                                    ? Array.of(
                                                                          geographData.county
                                                                      )
                                                                    : Array.from(
                                                                          geographData.county
                                                                      )
                                                                : [],
                                                    },
                                                };

                                                const alternativeCodes =
                                                    _.isArray(
                                                        importedData
                                                            .initialconditions.I
                                                    )
                                                        ? importedData.initialconditions.I.map(
                                                              (_init, i) =>
                                                                  `Node ${
                                                                      i + 1
                                                                  }`
                                                          )
                                                        : ["1"];
                                                const initialCond = getGeoNames(
                                                    geoForAdd.geoPayload
                                                        .featureSelected
                                                        .length > 0 &&
                                                        geographData.geo_topology ===
                                                            "meta"
                                                        ? geoForAdd.geoPayload
                                                              .featureSelected
                                                        : alternativeCodes,
                                                    geoForAdd.geoPayload.scale
                                                ).map((cod, i) => {
                                                    return {
                                                        name: cod,
                                                        conditionsValues:
                                                            Object.entries(
                                                                importedData.initialconditions
                                                            ).reduce(
                                                                (
                                                                    acc,
                                                                    [key, value]
                                                                ) => {
                                                                    return {
                                                                        ...acc,
                                                                        [key]: _.isArray(
                                                                            value
                                                                        )
                                                                            ? value[
                                                                                  i
                                                                              ]
                                                                            : value,
                                                                    };
                                                                },
                                                                {}
                                                            ),
                                                    };
                                                });
                                                const modelForAdd = {
                                                    idNewModel: idModel,
                                                    name,
                                                    modelType:
                                                        model.match(
                                                            REGEXTYPEMODEL
                                                        )[0],
                                                    idGeo,
                                                    t_init: compareDate(
                                                        parameters.t_init,
                                                        "2022/05/31"
                                                    ),
                                                    populationType: `${importedData.data.geo_topology}population`,
                                                    idGraph: 0,
                                                    initialConditions:
                                                        initialCond,
                                                    numberNodes:
                                                        initialCond.length,
                                                    typeSelection:
                                                        importedData.data.state
                                                            .length === 0 &&
                                                        importedData.data.county
                                                            .length === 0
                                                            ? "graph"
                                                            : "geographic",
                                                };
                                                setNewModel({
                                                    type: "add",
                                                    payload: modelForAdd,
                                                });
                                                setCompleteModel({
                                                    type: "add",
                                                    payload: {
                                                        ...modelForAdd,
                                                        parameters:
                                                            prepareChunk(
                                                                parameters
                                                            ),
                                                    },
                                                });
                                                if (
                                                    geoForAdd.geoPayload.scale
                                                        .length > 0
                                                ) {
                                                    setGeoSelections(geoForAdd);
                                                    addInLocalStorage(
                                                        [geoForAdd.geoPayload],
                                                        "geoSelection"
                                                    );
                                                }
                                                addInLocalStorage(
                                                    [
                                                        {
                                                            ...modelForAdd,
                                                            parameters:
                                                                prepareChunk(
                                                                    parameters
                                                                ),
                                                        },
                                                    ],
                                                    "newModels"
                                                );
                                                onClose();
                                                toast({
                                                    position,
                                                    title: "Models imported",
                                                    description:
                                                        "Models was imported successfully",
                                                    status: "success",
                                                    duration: 5000,
                                                    isClosable: true,
                                                });
                                            } catch (error) {
                                                toast({
                                                    position,
                                                    title: "Error",
                                                    description: `Uploading simulation failed. Check your TOML config and try later \n ${error}`,
                                                    status: "error",
                                                    duration: 5000,
                                                    isClosable: true,
                                                });
                                            }
                                        };
                                        reader.onerror = (err) => {
                                            toast({
                                                position,
                                                title: "Error",
                                                description:
                                                    "Occurs an error during import process",
                                                status: "error",
                                                duration: 5000,
                                                isClosable: true,
                                            });
                                        };
                                    } else {
                                        toast({
                                            position,
                                            title: "Doesn't supported API",
                                            description:
                                                "The File APIs are not fully supported by your browser.",
                                            status: "error",
                                            duration: 5000,
                                            isClosable: true,
                                        });
                                    }
                                }}
                            />
                        </Center>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ImportModels;
