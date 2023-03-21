/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable no-console */
import { useToast } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";

import { DataFit } from "context/DataFitContext";
import { HardSimSetted } from "context/HardSimulationsStatus";
import { Actions, StatusSimulation } from "types/HardSimulationType";
import getResponseForHardMetaSimulation from "utils/eventSourceProcessResponse";
import { getData } from "utils/fetchData";

const bottonLeft = "bottom-left";

const EventSourceConnection = () => {
    const { setHardSimulation } = useContext(HardSimSetted);
    const { setFittedData } = useContext(DataFit);
    const toast = useToast();
    // eslint-disable-next-line sonarjs/cognitive-complexity
    useEffect(() => {
        const source = new EventSource(
            `${process.env.NEXT_PUBLIC_SSE_URL}/stream`
        );
        source.addEventListener("metapopulation", (e: MessageEvent) => {
            const { id, event, status, description } = JSON.parse(e.data);
            const idProcessLocalStorage = JSON.parse(
                window.localStorage.getItem("hardSimulationStatus")
            ).details.idProcess;

            if (id === idProcessLocalStorage) {
                getData(`${process.env.NEXT_PUBLIC_SSE_URL}/process/${id}`)
                    .then((d) => {
                        getResponseForHardMetaSimulation(
                            d,
                            setHardSimulation,
                            event,
                            id,
                            description,
                            status
                        );
                        if (status === StatusSimulation.FINISHED) {
                            toast({
                                position: bottonLeft,
                                title: "Simulation finished",
                                description:
                                    "Simulation was completed successfully",
                                status: "success",
                                duration: 3000,
                                isClosable: true,
                            });
                        }
                    })
                    // eslint-disable-next-line no-console
                    .catch((err) => {
                        console.log("error", err);
                        toast({
                            position: bottonLeft,
                            title: "Error",
                            description: "Your simulation has failed",
                            status: "error",
                            duration: 3000,
                            isClosable: true,
                        });
                    });
            }
        });
        source.addEventListener("datafit", (e: MessageEvent) => {
            const { id, event, status, description } = JSON.parse(e.data);
            const idProcessLocalStorage = JSON.parse(
                window.localStorage.getItem("hardSimulationStatus")
            ).details.idProcess;

            if (id === idProcessLocalStorage) {
                getData(`${process.env.NEXT_PUBLIC_SSE_URL}/process/${id}`)
                    .then((d) => {
                        const {
                            status: statusSim,
                            results: { results },
                        } = JSON.parse(d);
                        if (statusSim === StatusSimulation.FINISHED) {
                            const fitResModel = {
                                model: results.simulation,
                            };
                            const val = Object.values(fitResModel);
                            const keys = Object.keys(fitResModel);
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            const { I_d, I_ac, name } = val
                                .map((simString: string) =>
                                    JSON.parse(simString)
                                )
                                .map((sim, i) => ({
                                    name: keys[i],
                                    ...sim,
                                }))[0];
                            const fittedData2 = {
                                I: I_d,
                                I_ac,
                                name,
                                beta: results.beta_values,
                                beta_days: results.beta_days,
                                mu: results.mu,
                            };
                            setFittedData([fittedData2]);
                        }
                        setHardSimulation({
                            type: Actions.SET_WITHOUT_NAME,
                            payload: {
                                type: event.toUpperCase(),
                                description,
                                idProcess: id,
                            },
                            status: status.toUpperCase(),
                        });
                    })
                    // eslint-disable-next-line no-console
                    .catch((err) => {
                        console.log("error", err);
                        toast({
                            position: bottonLeft,
                            title: "Error",
                            description: "Fitting has failed",
                            status: "error",
                            duration: 3000,
                            isClosable: true,
                        });
                    });
            }
        });
        source.onerror = (e) => {
            console.error("failed", e);
        };
        return () => {
            source.removeEventListener("metapopulation", (e: MessageEvent) => {
                const { id, event, status, description } = JSON.parse(e.data);
                const idProcessLocalStorage = JSON.parse(
                    window.localStorage.getItem("hardSimulationStatus")
                ).details.idProcess;

                if (id === idProcessLocalStorage) {
                    getData(`${process.env.NEXT_PUBLIC_SSE_URL}/process/${id}`)
                        .then((d) => {
                            getResponseForHardMetaSimulation(
                                d,
                                setHardSimulation,
                                event,
                                id,
                                description,
                                status
                            );
                            if (status === StatusSimulation.FINISHED) {
                                toast({
                                    position: bottonLeft,
                                    title: "Simulation finished",
                                    description:
                                        "Simulation was completed successfully",
                                    status: "success",
                                    duration: 3000,
                                    isClosable: true,
                                });
                            }
                        })
                        // eslint-disable-next-line no-console
                        .catch((err) => {
                            console.log("error", err);
                            toast({
                                position: bottonLeft,
                                title: "Error",
                                description: "Your simulation has failed",
                                status: "error",
                                duration: 3000,
                                isClosable: true,
                            });
                        });
                }
            });
            source.removeEventListener("datafit", (e: MessageEvent) => {
                const { id, event, status, description } = JSON.parse(e.data);
                const idProcessLocalStorage = JSON.parse(
                    window.localStorage.getItem("hardSimulationStatus")
                ).details.idProcess;
                if (id === idProcessLocalStorage) {
                    getData(`${process.env.NEXT_PUBLIC_SSE_URL}/process/${id}`)
                        .then((d) => {
                            const {
                                status: statusSim,
                                results: { results },
                            } = JSON.parse(d);
                            if (statusSim === StatusSimulation.FINISHED) {
                                const fitResModel = {
                                    model: results.simulation,
                                };
                                const val = Object.values(fitResModel);
                                const keys = Object.keys(fitResModel);
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                const { I_d, I_ac, name } = val
                                    .map((simString: string) =>
                                        JSON.parse(simString)
                                    )
                                    .map((sim, i) => ({
                                        name: keys[i],
                                        ...sim,
                                    }))[0];
                                const fittedData2 = {
                                    I: I_d,
                                    I_ac,
                                    name,
                                    beta: results.beta_values,
                                    beta_days: results.beta_days,
                                    mu: results.mu,
                                };
                                setFittedData([fittedData2]);
                            }
                            setHardSimulation({
                                type: Actions.SET_WITHOUT_NAME,
                                payload: {
                                    type: event.toUpperCase(),
                                    description,
                                    idProcess: id,
                                },
                                status: status.toUpperCase(),
                            });
                        })
                        // eslint-disable-next-line no-console
                        .catch((err) => {
                            console.log("error", err);
                            toast({
                                position: bottonLeft,
                                title: "Error",
                                description: "Fitting has failed",
                                status: "error",
                                duration: 3000,
                                isClosable: true,
                            });
                        });
                }
            });
            source.close();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setHardSimulation]);
    useEffect(() => {
        if (window.localStorage.getItem("hardSimulationStatus")) {
            const {
                status,
                details: { idProcess, description, type },
            } = JSON.parse(window.localStorage.getItem("hardSimulationStatus"));
            if (
                status === StatusSimulation.RECIEVED ||
                status === StatusSimulation.STARTED
            ) {
                getData(
                    `${process.env.NEXT_PUBLIC_SSE_URL}/process/${idProcess}`
                )
                    .then((d) =>
                        getResponseForHardMetaSimulation(
                            d,
                            setHardSimulation,
                            type,
                            idProcess,
                            description,
                            status
                        )
                    )
                    .catch((err) => console.log("error", err));
            }
        }
    }, [setHardSimulation]);
    return <></>;
};

export default EventSourceConnection;
