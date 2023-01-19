import data from "data/metapopulationData.json";

export default function userHandler(req, res) {
    const { method } = req;
    if (method === "GET") {
        res.send(data);
    } else {
        res.send("no se obtuvo la data");
    }
}
