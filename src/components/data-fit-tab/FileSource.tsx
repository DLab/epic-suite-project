import { Box, Button } from "@chakra-ui/react";
import React from "react";

/**
 * Option to get real data from a file upload.
 * @subcategory DataFitTab
 * @component
 */
const FileSource = () => {
    return (
        <Box m="0 0 3% 5%">
            <Button size="sm" colorScheme="blue" variant="outline">
                Upload
            </Button>
        </Box>
    );
};

export default FileSource;
