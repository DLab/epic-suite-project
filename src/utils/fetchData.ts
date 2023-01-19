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
export default postData;
