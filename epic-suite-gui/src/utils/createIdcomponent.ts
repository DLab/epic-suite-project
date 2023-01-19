import { v4 as uuidv4 } from "uuid";

const createIdComponent = () => {
    return uuidv4().slice(0, 10);
};

export default createIdComponent;
