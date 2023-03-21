import pandas as pd
from flask import abort

# DEFINICIÓN DE COMPARTIMENTOS

# A dictionary that contains the compartment names and the keys that are associated with each
# compartment.
compartmentDict = {
    "SIR": ["P", "I", "I_ac", "I_d", "D_d", "D_ac"],
    "SEIR": ["P", "I", "I_ac", "I_d", "D_d", "D_ac"],
    "SEIRHVD": ["P", "I", "I_ac", "I_d", "H_d", "H_ac", "V_d", "V_ac", "D_d", "D_ac"],
}


# compartimentos correspondientes a cada modelo
def compartment(c, modelDict):
    """
    It takes a compartment name and a model dictionary and returns a dictionary with the compartment
    name and the values for the keys in the compartment dictionary
    
    :param c: the compartment name
    :param modelDict: a dictionary of the model parameters
    :return: A dictionary with the compartment name and the values of the keys in the compartmentDict
    """
    keys = compartmentDict[c]
    result = {"Compartment": c}

    for k in keys:
        result[k] = modelDict[k]

    return result


# -----------------------------------------------------------------------------------------------


def endpointResponse(route, df, model, scaleName, t_init, t_end, arr_fips):
    """
    It takes a route, a dataframe, a model, a scaleName, a t_init, a t_end, and an array of FIPS codes.
    It then returns a final_result.
    
    :param route: the route that the user is requesting
    :param df: the dataframe that contains the data
    :param model: the model name
    :param scaleName: "States" or "Counties"
    :param t_init: the initial date of the simulation
    :param t_end: the end date of the data you want to retrieve
    :param arr_fips: array of FIPS codes
    :return: a dictionary with the following structure:
    {
        "P": {
            "0": "0",
            "1": "0",
            "2": "0",
            "3": "0",
            "4": "0",
            "5": "0",
            "6": "0",
            "7": "
    """
    type_fips, final_result = None, None

    arr_dfs = []

    if scaleName == "States":  # statesUSA
        type_fips = "FIPS_state"

    elif scaleName == "Counties":  # countiesUSA
        type_fips = "FIPS_county"

    for fips in arr_fips:
        df_tmp = df[
            (df["DateTime"] >= t_init)
            & (df["DateTime"] <= t_end)
            & (df[type_fips] == fips)
        ]
        arr_dfs.append(df_tmp)

    df_compile = pd.concat(arr_dfs)
    if df_compile.empty:
        abort(400, description="*ERROR. There is not data for that date or spatial entity")

    attr = ["DateTime"]

    for a in compartmentDict[model]:
        attr.append(a)

    df_reduce = df_compile.loc[
        :, attr
    ]  

    df_groupby = pd.DataFrame(df_reduce.groupby(["DateTime"]).sum())
    df_groupby = df_groupby.reset_index(
        level=None, drop=False, inplace=False, col_level=0, col_fill=""
    )

    requiredDates = df_groupby["DateTime"].tolist()

    n_day = ""
    long = len(requiredDates)
    tmp_result = {}

    if long == 1:
        P, I, I_ac, I_d, H_d, H_ac, V_d, V_ac, D_d, D_ac = 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    else:
        P, I, I_ac, I_d, H_d, H_ac, V_d, V_ac, D_d, D_ac = (
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
        )

    tmp_dict = {
        "P": P,
        "I": I,
        "I_ac": I_ac,
        "I_d": I_d,
        "H_d": H_d,
        "H_ac": H_ac,
        "V_d": V_d,
        "V_ac": V_ac,
        "D_d": D_d,
        "D_ac": D_ac,
    }

    for c in compartmentDict[model]:
        for date in requiredDates:
            n_day = df_groupby.index[df_groupby["DateTime"] == date].tolist()[0]

            if long == 1 and route == "initCond":
                tmp_dict[c] = str(
                    int(df_groupby[df_groupby["DateTime"] == date][c].sum())
                )
            elif long > 1 and route == "realData":
                tmp_dict[c][n_day] = str(
                    int(df_groupby[df_groupby["DateTime"] == date][c].sum())
                )

            tmp_result[c] = tmp_dict[c]

    final_result = compartment(model, tmp_result)

    return final_result
