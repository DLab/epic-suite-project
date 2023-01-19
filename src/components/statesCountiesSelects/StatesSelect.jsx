import { Select } from "chakra-react-select";
import PropTypes from "prop-types";
import { useContext } from "react";

import { SelectFeature } from "../../context/SelectFeaturesContext";
import createIdComponent from "utils/createIdcomponent";

/**
 * Selector for US states.
 * @component
 */
const StatesSelect = ({ options, extentionOption }) => {
    const { states: statesSelected, setStates: setStatesSelected } =
        useContext(SelectFeature);

    return (
        <Select
            id={createIdComponent()}
            className="reactSelect"
            name="states"
            options={options}
            placeholder="Select states"
            closeMenuOnSelect
            size="sm"
            styles={{ background: "red" }}
            onChange={({ fips }) => {
                if (statesSelected.includes(fips)) {
                    setStatesSelected({ type: "remove-one", payload: [fips] });
                } else {
                    setStatesSelected({ type: "add", payload: [fips] });
                }
            }}
        />
    );
};

StatesSelect.propTypes = {
    options: PropTypes.arrayOf(PropTypes.any),
    extentionOption: PropTypes.string,
};

export default StatesSelect;
