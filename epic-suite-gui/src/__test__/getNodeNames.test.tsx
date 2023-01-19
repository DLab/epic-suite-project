import getNodeNames from "../utils/getNodeNames";

describe("Test on getNodesNames", () => {
    test("in the case of a monopopulation model, it must return FIP", () => {
        const response = getNodeNames("04", true);
        expect(response).toBe("04");
    });
    test("should return the name of Arizona", () => {
        const response = getNodeNames("04", false);
        expect(response).toBe("Arizona");
    });
    test("should return the name of Houston, AL", () => {
        const response = getNodeNames("01069", false);
        expect(response).toBe("Houston, AL");
    });
});
