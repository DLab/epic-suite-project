import { FormControl, Radio, RadioGroup, HStack } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useContext, useState, useEffect } from "react";

import countyData from "../../../data/counties.json";
import data from "../../../data/states.json";
import CountiesSelect from "components/statesCountiesSelects/CountiesSelect";
import StatesSelect from "components/statesCountiesSelects/StatesSelect";
import { SelectFeature } from "context/SelectFeaturesContext";
import { Model } from "types/ControlPanelTypes";

/**
 * Component that displays the settings for creating a geographic selection.
 * @subcategory MapTab
 * @component
 */
const SelectorMap1 = ({ extentionOption, setExtentionOption }) => {
    const {
        mode,
        scale,
        // setScale,
        // states,
        // counties,
        setCounties: setCountiesSelected,
        setStates: setStatesSelected,
    } = useContext(SelectFeature);
    // const [extentionOption, setExtentionOption] = useState("National");

    const [stateOptions, setStateOptions] = useState([]);
    const [countiesOptions, setCountiesOptions] = useState([]);
    // const [isOpen, setIsOpen] = useState(false);
    const options = [
        {
            label: "STATES",
            options: stateOptions,
        },
    ];
    const optionsCounty = [
        {
            label: "COUNTY",
            options: countiesOptions,
        },
    ];

    /**
     * @returns Returns a list of all state names and their fips.
     */
    const getStatesOptions = () => {
        const statesOptions = data.data.map((state) => {
            return { value: state[1], label: state[2], fips: state[0] };
        });
        return setStateOptions(statesOptions);
    };

    /**
     * Provide a list of all the county names and their fips.
     */
    const getCountiesOptions = () => {
        const getCounties = countyData.data.map((state) => {
            return { value: state[5], label: state[7] };
        });
        setCountiesOptions(getCounties);
    };

    useEffect(() => {
        if (mode === "Update") {
            setExtentionOption(scale);
        }
        // if (scale === "National") {
        //     setExtentionOption("0");
        // } else if (scale === "States") {
        //     setExtentionOption("1");
        // } else {
        //     setExtentionOption("2");
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scale]);

    // useEffect(() => {
    //     if (mode === Model.Initial) {
    //         setStatesSelected({ type: "reset" });
    //         setCountiesSelected({ type: "reset" });
    //     }
    //     // if (extentionOption === "0") {
    //     //     setScale("National");
    //     // } else if (extentionOption === "1") {
    //     //     setScale("States");
    //     // } else {
    //     //     setScale("Counties");
    //     // }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [mode]);

    useEffect(() => {
        getStatesOptions();
        getCountiesOptions();
    }, []);

    return (
        <FormControl>
            <RadioGroup
                mt="7%"
                onChange={setExtentionOption}
                value={extentionOption}
            >
                <HStack display="flex" justifyContent="space-evenly">
                    {mode === Model.Add && (
                        <>
                            {" "}
                            {/* <Radio
                                id="radio-national"
                                name="radio-national"
                                bg="white"
                                border="1px"
                                borderColor="#5B58AD"
                                value="National"
                            >
                                <span style={{ fontSize: "14px" }}>
                                    National
                                </span>
                            </Radio> */}
                            <Radio
                                id="radio-state"
                                name="radio-state"
                                bg="white"
                                border="1px"
                                borderColor="#5B58AD"
                                value="States"
                            >
                                <span style={{ fontSize: "14px" }}>State</span>
                            </Radio>
                            <Radio
                                id="radio-county"
                                name="radio-county"
                                bg="white"
                                border="1px"
                                borderColor="#5B58AD"
                                value="Counties"
                            >
                                <span style={{ fontSize: "14px" }}>County</span>
                            </Radio>
                        </>
                    )}
                    {mode === Model.Update && (
                        <>
                            {" "}
                            {/* <Radio
                                id="radio-national"
                                name="radio-national"
                                bg="white"
                                border="1px"
                                borderColor="#5B58AD"
                                value="National"
                                isDisabled
                            >
                                <span style={{ fontSize: "14px" }}>
                                    National
                                </span>
                            </Radio> */}
                            <Radio
                                id="radio-state"
                                name="radio-state"
                                bg="white"
                                border="1px"
                                borderColor="#5B58AD"
                                value="States"
                                isDisabled
                            >
                                <span style={{ fontSize: "14px" }}>State</span>
                            </Radio>
                            <Radio
                                id="radio-county"
                                name="radio-county"
                                bg="white"
                                border="1px"
                                borderColor="#5B58AD"
                                value="Counties"
                                isDisabled
                            >
                                <span style={{ fontSize: "14px" }}>County</span>
                            </Radio>
                        </>
                    )}
                </HStack>
            </RadioGroup>
            {extentionOption === "States" && (
                <FormControl mt="0.6rem">
                    <StatesSelect
                        options={options}
                        extentionOption={extentionOption}
                    />
                </FormControl>
            )}
            {extentionOption === "Counties" && (
                <CountiesSelect
                    options={options}
                    optionsCounty={optionsCounty}
                />
            )}
            {/* <Center>
                <Button
                    mt="0.5rem"
                    variant="ghost"
                    colorScheme="blue"
                    fontSize="14px"
                    onClick={() => {
                        if (states.length === 0 && counties.length === 0) {
                            return;
                        }
                        setIsOpen(true);
                    }}
                >
                    Reset
                </Button>
                <ResetAlerts isOpen={isOpen} setIsOpen={setIsOpen} />
            </Center> */}
        </FormControl>
    );
};

export default SelectorMap1;

SelectorMap1.propTypes = {
    extentionOption: PropTypes.string,
    setExtentionOption: PropTypes.func,
};
