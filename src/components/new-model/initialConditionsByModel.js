/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Returns the initial conditions according to the type of model.
 * @param {string} model model type: SIR, SEIR, SEIRHVD.
 * @returns {InitialConditions}
 */
const getInitialConditionsByModel = (model) => {
    if (model === "seirhvd") {
        return {
            I: 0,
            I_d: 0,
            I_ac: 0,
            population: 0,
            R: 0,
            E: 0,
            H_d: 0,
            H: 0,
            Iv_d: 0,
            Iv_ac: 0,
            D_d: 0,
            D: 0,
            Iv: 0,
            H_cap: 0,
            Sv: 0,
        };
    }
    return {
        I: 0,
        I_d: 0,
        I_ac: 0,
        population: 0,
        R: 0,
    };
};

/**
 * It delivers the initial preconditions according to the type of model.
 * @param {string} model model type: SIR, SEIR, SEIRHVD.
 * @param {InitialConditions} initCond previous values of the initial conditions.
 * @returns {InitialConditions}
 */
export const getPreviusInitialConditions = (model, initCond) => {
    if (model === "seirhvd") {
        return {
            I: initCond.I,
            I_d: initCond.I_d,
            I_ac: initCond.I_ac,
            population: initCond.population,
            R: initCond.R,
            E: initCond.E,
            H_d: initCond.H_d,
            H: initCond.H,
            Iv_d: initCond.Iv_d,
            Iv_ac: initCond.Iv_ac,
            D_d: initCond.D_d,
            D: initCond.D,
            Iv: initCond.Iv,
            H_cap: initCond.H_cap,
            Sv: initCond.Sv,
        };
    }
    return {
        I: initCond.I,
        I_d: initCond.I_d,
        I_ac: initCond.I_ac,
        population: initCond.population,
        R: initCond.R,
    };
};

/**
 * It delivers the initial conditions in the appropriate format, with their values acquired from the endpoint.
 * @param {Object} result values of the initial conditions delivered by the endpoint.
 * @returns {InitialConditions}
 */
export const postInitialConditionsByModel = (result) => {
    const {
        Compartment,
        D_d,
        D_ac,
        E,
        H_d,
        H_ac,
        I,
        I_ac,
        I_d,
        R,
        P,
        V_d,
        V_ac,
        H_cap,
        Sv,
        Iv,
    } = result;

    let payload;
    if (Compartment === "SIR" || Compartment === "SEIR") {
        payload = {
            I: +I,
            I_d: +I_d,
            I_ac: +I_ac,
            population: +P,
            R: 0,
        };
    }
    // if (Compartment === "SEIR") {
    //     payload = {
    //         I: +I_active,
    //         I_d: +I,
    //         I_ac: +I_acum,
    //         population: +S,
    //         R: +R,
    //         E: +E,
    //     };
    // }
    if (Compartment === "SEIRHVD") {
        payload = {
            I: +I,
            I_d: +I_d,
            I_ac: +I_ac,
            population: +P,
            R: 0,
            // E: +E,
            H_d: +H_d,
            H: +H_ac,
            Iv_d: +V_d,
            Iv_ac: +V_ac,
            D_d: +D_d,
            D: +D_ac,
            H_cap: 0,
            Iv: 0,
            Sv: 0,
        };
    }
    return payload;
};

export default getInitialConditionsByModel;
