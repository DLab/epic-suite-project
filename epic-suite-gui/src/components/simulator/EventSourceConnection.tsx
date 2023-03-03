/* eslint-disable no-console */
import { Box, Button, useToast } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";

import {
    HardSimSetted,
    initialStateHardSim,
} from "context/HardSimulationsStatus";
import {
    Actions,
    StatusSimulation,
    TypeHardSimulation,
} from "types/HardSimulationType";
import getResponseForHardMetaSimulation from "utils/eventSourceProcessResponse";
import { getData } from "utils/fetchData";

const bottonLeft = "bottom-left";
const EventSourceConnection = () => {
    const { setHardSimulation } = useContext(HardSimSetted);
    const [serverMessage, setServerMessage] = useState("");
    const toast = useToast();
    useEffect(() => {
        const source = new EventSource(
            `${process.env.NEXT_PUBLIC_SSE_URL}/stream`
        );
        source.onopen = (event) => {
            console.log("connected", event);
        };
        source.onmessage = (event) => {
            console.log("connected", event);
        };
        source.addEventListener("metapopulation", (e: MessageEvent) => {
            const { id, event, status, description } = JSON.parse(e.data);
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
        });
        source.addEventListener("datafit", (e: MessageEvent) => {
            console.log("fit", e);
            const { id, event, status, description } = JSON.parse(e.data);
            console.log({ id, event, status, description });
            setServerMessage(e.data);
            setHardSimulation({
                type: Actions.SET,
                payload: {
                    type: event.toUpperCase(),
                    idProcess: id,
                    description,
                    name: "",
                    idModel: 0,
                },
                status: status.toUpperCase(),
            });
        });
        source.onerror = (e) => {
            console.error("failed", e);
            setServerMessage(JSON.stringify(e));
        };
        return () => {
            source.removeEventListener("metapopulation", (e) => {
                getResponseForHardMetaSimulation(e, setHardSimulation);
            });
            // eslint-disable-next-line sonarjs/no-identical-functions
            source.removeEventListener("datafit", (e: MessageEvent) => {
                console.log("fit", e);
                const { id, event, status, description } = JSON.parse(e.data);
                console.log({ id, event, status, description });
                setServerMessage(e.data);
                setHardSimulation({
                    type: Actions.SET,
                    payload: {
                        type: event.toUpperCase(),
                        idProcess: id,
                        description,
                        name: "",
                        idModel: 0,
                    },
                    status: status.toUpperCase(),
                });
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
    return (
        <></>
        // <Box>
        //     <Button
        //         onClick={() => {
        //             setHardSimulation({
        //                 type: Actions.SET,
        //                 payload: {
        //                     type: TypeHardSimulation.METAPOPULATION,
        //                     idModel: 1234,
        //                     idProcess: "1234",
        //                     description: "testing",
        //                     result: "nana",
        //                 },
        //                 status: StatusSimulation.RECIEVED,
        //             });
        //             window.localStorage.setItem(
        //                 "hardSimulationStatus",
        //                 JSON.stringify({
        //                     status: StatusSimulation.RECIEVED,
        //                     details: {
        //                         type: TypeHardSimulation.METAPOPULATION,
        //                         idModel: 1234,
        //                         idProcess: "1234",
        //                         description: "testing",
        //                         result: "nana",
        //                     },
        //                 })
        //             );
        //         }}
        //     >
        //         setear
        //     </Button>
        //     <Button
        //         onClick={() => {
        //             setHardSimulation({ type: Actions.RESET });
        //             window.localStorage.setItem(
        //                 "hardSimulationStatus",
        //                 JSON.stringify(initialStateHardSim)
        //             );
        //         }}
        //     >
        //         resetear
        //     </Button>
        // </Box>
    );
};

export default EventSourceConnection;
