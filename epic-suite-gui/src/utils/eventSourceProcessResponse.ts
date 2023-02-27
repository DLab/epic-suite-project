import { Actions, StatusSimulation } from "types/HardSimulationType";

const getResponseForHardMetaSimulation = (
    data,
    setHardSimulation,
    ...otherParameters
) => {
    const [type, idProcess, description, status] = otherParameters;
    let listResponse;
    let globalResultsListResponse;
    let name;
    if (status === StatusSimulation.FINISHED) {
        const { results, global_results: globalResults } =
            JSON.parse(data).results;
        const [nameModel] = Object.keys(results);
        name = nameModel;
        const jsonResponse = JSON.parse(results[name]);

        const jsonGlobalResultsResponse = JSON.parse(globalResults[name]);
        listResponse = Object.keys(jsonResponse).map((key) => {
            return { name: key, ...jsonResponse[key] };
        });

        globalResultsListResponse = { name: "general" };
        Object.keys(jsonGlobalResultsResponse).forEach((key) => {
            globalResultsListResponse = {
                ...globalResultsListResponse,
                [key]: Object.values(jsonGlobalResultsResponse[key]),
            };
        });
    }
    setHardSimulation({
        type: Actions.SET_WITHOUT_NAME,
        payload: {
            type,
            idProcess,
            description,
            ...(name && { name }),
            ...(status === StatusSimulation.FINISHED && {
                result: {
                    result: listResponse,
                    globalResult: globalResultsListResponse,
                },
            }),
        },
        status: status.toUpperCase(),
    });
};

export default getResponseForHardMetaSimulation;
