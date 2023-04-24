import axios from "axios";

// export const getData = async (url) => {
//     const { data } = await axios(url);
//     return data;
// };
/**
 * It takes a URL and a body, and returns the data from the response
 * @param {string} url - The URL to send the request to.
 * @param body - The data to be sent to the server.
 * @returns The data from the response.
 */
const postData = async (url: string, body) => {
    const res = await axios.post(url, body);
    return res.data;
};
export const getData = async (url: string) => {
    const res = await axios.get(url);
    return res.data;
};
export const getRealMatrix = (
    setter,
    loadAdviceFunction,
    body: unknown = {
        timeInit: "2019-01-01",
        timeEnd: "2019-01-04",
        scale: "States",
        spatialSelection: ["10", "11"],
    },
    url = "http://localhost/covid19geomodeller/mobility/usa"
) => {
    loadAdviceFunction(true);
    fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
    })
        .then((e) => e.json())
        .then((data) => {
            if (data.error) {
                throw new Error(data.error);
            }
            setter(data);
        })
        .catch(() => {
            setter({});
        })
        .finally(() => loadAdviceFunction(false));
};

export default postData;
