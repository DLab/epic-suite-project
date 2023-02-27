import { CloseIcon } from "@chakra-ui/icons";
import {
    Text,
    Accordion,
    AccordionPanel,
    AccordionButton,
    AccordionItem,
    Box,
    Flex,
    AccordionIcon,
    Divider,
} from "@chakra-ui/react";
import { useContext } from "react";

import countiesData from "../../data/counties.json";
import stateData from "../../data/states.json";
import { SelectFeature } from "context/SelectFeaturesContext";
import { DataCountiesObj, ObjStatesCounties } from "types/SelectFeaturesTypes";
import createIdComponent from "utils/createIdcomponent";

interface StatesSelected {
    stateSelected?: string[];
    countiesSelected?: string[];
}

type Acc = ObjStatesCounties[] | [];

/**
 * Component to select states or counties to a geographic selection.
 * @component
 */
const StatesSelectedCheckbox = ({
    stateSelected,
    countiesSelected,
}: StatesSelected) => {
    const { setStates, setCounties } = useContext(SelectFeature);

    const sortStrings = (property: string) => (a, b) => {
        if (a[property] > b[property]) {
            return 1;
        }
        if (a[property] < b[property]) {
            return -1;
        }
        return 0;
    };

    /**
     * Returns a list with the name and fip of the states of the geographical selection.
     */
    const statesOrdered = stateSelected
        ? stateSelected
              .map((e) => ({
                  value: e,
                  label: stateData.data.find((s) => s[0] === e)[2],
              }))
              .sort(sortStrings("value"))
        : [];

    /**
     * Returns a list with the name, fip of the states and their nested counties.
     */
    const countiesOrdered = countiesSelected
        ? countiesData.data
              .filter(
                  (c) => countiesSelected.includes(`${c[5]}`)
                  // Filter all counties includes in selection.
              )
              .reduce((acc: Acc, item) => {
                  // Reduce all data in a object.
                  const obj: ObjStatesCounties = {
                      state: item[0] as string,
                      labelState: item[2] as string,
                      counties: [
                          { value: item[5], label: item[4] },
                      ] as DataCountiesObj[],
                  };
                  const indexState = acc.findIndex(
                      (c: ObjStatesCounties) => c.state === item[0]
                  );
                  // isExist in object ? push : return actual value
                  if (indexState >= 0) {
                      acc[indexState].counties.push({
                          value: item[5] as string,
                          label: item[4] as string,
                      });
                      acc[indexState].counties.sort(sortStrings("value"));
                      return acc;
                  }
                  return [...acc, obj];
              }, [])
        : [];

    return (
        <Box id={createIdComponent()} overflowY="auto">
            {stateSelected &&
                statesOrdered.map((s) => {
                    return (
                        <Flex
                            id={createIdComponent()}
                            key={s.value}
                            direction="column"
                            mb="4%"
                        >
                            <Flex
                                justifyContent="space-between"
                                fontSize="0.875rem"
                            >
                                {s.label}
                                <CloseIcon
                                    id={createIdComponent()}
                                    w="10px"
                                    cursor="pointer"
                                    onClick={() =>
                                        setStates({
                                            type: "remove-one",
                                            payload: [s.value],
                                        })
                                    }
                                />
                            </Flex>
                            <Divider />
                        </Flex>
                    );
                })}
            {countiesSelected && (
                <Accordion id={createIdComponent()} allowMultiple>
                    {countiesOrdered.map((c: ObjStatesCounties) => {
                        const checkbox = c.counties.map((cc) => {
                            return (
                                <Flex
                                    id={createIdComponent()}
                                    key={cc.value}
                                    justifyContent="space-between"
                                    p="1% 5%"
                                >
                                    <Text
                                        id={createIdComponent()}
                                        fontSize="0.875rem"
                                        color="gray.600"
                                    >
                                        {cc.label}
                                    </Text>
                                    <CloseIcon
                                        id={createIdComponent()}
                                        w="10px"
                                        cursor="pointer"
                                        onClick={() => {
                                            setCounties({
                                                type: "remove-one",
                                                payload: [cc.value],
                                            });
                                        }}
                                    />
                                </Flex>
                            );
                        });
                        return (
                            <AccordionItem id={createIdComponent()}>
                                <h2 id={createIdComponent()}>
                                    <AccordionButton id={createIdComponent()}>
                                        <Box
                                            id={createIdComponent()}
                                            flex="1"
                                            textAlign="left"
                                            fontSize="0.875rem"
                                        >
                                            {c.labelState}
                                        </Box>
                                        <AccordionIcon
                                            id={createIdComponent()}
                                        />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel id={createIdComponent()}>
                                    {checkbox}
                                </AccordionPanel>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            )}
        </Box>
    );
};

export default StatesSelectedCheckbox;
