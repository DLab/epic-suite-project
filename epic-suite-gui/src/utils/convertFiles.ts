/* eslint-disable prettier/prettier */
import toml, { Section } from "@ltd/j-toml";
import {Parser} from "json2csv";

export enum TypeFile {
    JSON = "JSON",
    CSV = "CSV",
    TOML = "TOML",
}

/**
 * It converts a JSON object into a TOML string
 * @param {any} data - the data to be converted
 * @param {TypeFile} typeFile - TypeFile = TypeFile.TOML
 * @returns the data in the format specified by the typeFile parameter.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const convertFiles = (data: any, typeFile: TypeFile = TypeFile.TOML): unknown => {
        if(typeFile === TypeFile.JSON){
            return toml.parse(data);
        }
        if(typeFile === TypeFile.CSV){
            const parser = new Parser()
            return parser.parse(data)
        }
        const dataAsTableToml = {
            model: Section(data.model),
            data: Section(data.data),
            initialconditions: Section(data.initialconditions),
            parameters: {
                static: Section(data.parameters.static),
                dynamic: Section(data.parameters.dynamic),
            },

        }
        return toml.stringify(dataAsTableToml,{newline: "\n", xBeforeNewlineInMultilineTable: "",forceInlineArraySpacing: 1}) // .replace(/\\/g, ''); // .replace(/"\{/i, "'{").replace(/\}"/i, "}'");   
};

export default convertFiles;
// export {}
