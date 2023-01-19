import { FormControl, Button, Box } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import PropTypes from "prop-types";
import { useContext, useState } from "react";

import { SelectFeature } from "../../context/SelectFeaturesContext";
import countyData from "../../data/counties.json";
import createIdComponent from "utils/createIdcomponent";

/**
 * US counties selector.
 * @component
 */
const CountiesSelect = ({ options, optionsCounty }) => {
    const { counties: countiesSelected, setCounties: setCountiesSelected } =
        useContext(SelectFeature);
    const [optionsCounties, setOptionsCounties] = useState([]);
    const [countyFeature, setCountyFeature] = useState("");
    const [countyFeaturesByState, setCountyFeaturesByState] = useState("");

    /**
     * Returns all counties in a state.
     * @param {*} codState states code.
     * @returns {Array}
     */
    const handleAddCountiesByState = (codState) => {
        return countyData.data
            .filter((c) => c[0] === codState)
            .map((c) => c[5]);
    };

    /**
     * Add or delete a county from the geographic selection.
     * @param {number} counties county fip.
     * @param {boolean} isSelecting
     * @returns {boolean}
     */
    const handleAddCounties = (counties, isSelecting = true) => {
        // Selecting all counties by states
        if (counties.length === 2) {
            const allCountiesInState = handleAddCountiesByState(counties);
            /* Remove counties */
            if (!isSelecting) {
                const newCountiesSelected = [...countiesSelected].filter(
                    (c) => !allCountiesInState.includes(c)
                );
                setCountiesSelected({
                    type: "remove",
                    payload: newCountiesSelected,
                });
                return false;
            }
            /* Add counties */
            const selectedCounties = new Set([
                ...countiesSelected,
                ...allCountiesInState,
            ]);
            setCountiesSelected({ type: "add-all", payload: selectedCounties });
            return true;
        }
        // Remove one county
        if (!isSelecting) {
            const countiesWithoutSelectedFeature = [...countiesSelected].filter(
                (c) => c !== counties
            );
            /* Remove only if not undefined */
            if (countiesWithoutSelectedFeature)
                setCountiesSelected({
                    type: "remove",
                    payload: countiesWithoutSelectedFeature,
                });
            return false;
        }
        // Verify if a county exists in context
        const isSelectedInContext = [...countiesSelected].some(
            (c) => c === counties
        );
        if (isSelectedInContext) {
            return true;
        }
        // If it not exists, add it
        setCountiesSelected({
            type: "add",
            payload: [counties],
        });

        return true;
    };

    /**
     * Filter the counties according to a US state.
     * @param {number} val county fip.
     * @returns {Array} list with the name and fips of all the counties of the selected state.
     */
    const handleOptionsCounties = (val) => {
        return (
            optionsCounty[0].options.filter((e) => e.value.startsWith(val)) ??
            ""
        );
    };
    return (
        <Box id={createIdComponent()}>
            <FormControl id={createIdComponent()} mt="0.6rem">
                <Select
                    id={createIdComponent()}
                    name="states"
                    className="reactSelect"
                    options={options}
                    placeholder="Select state"
                    size="sm"
                    onChange={({ fips }) => {
                        setCountyFeaturesByState(fips);
                        setOptionsCounties(handleOptionsCounties(fips));
                    }}
                />
            </FormControl>
            <FormControl id={createIdComponent()} mt="0.6rem">
                <Select
                    id={createIdComponent()}
                    name="counties"
                    className="reactSelect"
                    options={optionsCounties}
                    placeholder="Select cunties"
                    size="sm"
                    w="100%"
                    onChange={({ value }) => setCountyFeature(value)}
                />
                <Box
                    id={createIdComponent()}
                    w="100%"
                    textAlign="right"
                    pt="0.3rem"
                >
                    <Button
                        id={createIdComponent()}
                        isDisabled={!countyFeature}
                        size="xs"
                        m="0 3% 0 0"
                        colorScheme="blue"
                        onClick={() => handleAddCounties(countyFeature)}
                    >
                        Add
                    </Button>
                    <Button
                        id={createIdComponent()}
                        size="xs"
                        onClick={() => handleAddCounties(countyFeature, false)}
                    >
                        Remove
                    </Button>
                </Box>
            </FormControl>
        </Box>
    );
};
CountiesSelect.propTypes = {
    options: PropTypes.arrayOf(PropTypes.any),
    optionsCounty: PropTypes.arrayOf(PropTypes.any),
};
export default CountiesSelect;
