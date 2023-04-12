import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Tooltip,
    Flex,
    Icon,
} from "@chakra-ui/react";
import React from "react";

import ColorIcon from "../icons/ColorIcon";

import colorsScales from "./getColorsScales";

const colorOptions = ["Inferno", "Purple", "GnBu"];

interface Props {
    setColorScale: (value: string) => void;
}
const ColorScaleMenu = ({ setColorScale }: Props) => {
    return (
        <Menu>
            <MenuButton h="60%">
                <Tooltip label="Choose color scale">
                    <Icon
                        color="#016FB9"
                        as={ColorIcon}
                        cursor="pointer"
                        mr="6px"
                    />
                </Tooltip>
            </MenuButton>
            <MenuList>
                {colorOptions.map((scaleName) => {
                    return (
                        <MenuItem
                            value={scaleName}
                            onClick={() => setColorScale(scaleName)}
                        >
                            <Flex w="100%" justifyContent="space-between">
                                <Flex mr="3%">
                                    {colorsScales[scaleName].map((color) => {
                                        return (
                                            <i
                                                style={{
                                                    width: "18px",
                                                    height: "18px",
                                                    background: color,
                                                }}
                                            />
                                        );
                                    })}
                                </Flex>
                                <span>{scaleName}</span>
                            </Flex>
                        </MenuItem>
                    );
                })}
            </MenuList>
        </Menu>
    );
};

export default ColorScaleMenu;
