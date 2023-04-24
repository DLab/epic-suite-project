import type { DeepPartial, Theme } from "@chakra-ui/react";
// eslint-disable-next-line import/no-extraneous-dependencies
import "@fontsource/noto-sans";

// extend the theme

const fonts: DeepPartial<Theme["fonts"]> = {
    body: "'Noto Sans', sans-serif",
    heading: "'Noto Sans', sans-serif",
};

export default fonts;
