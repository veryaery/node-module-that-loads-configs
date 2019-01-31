import * as path from "path";

import * as formats from "./formats";

import {
    Format,
    FormatReturnObject
} from "./Format";
import { RawFormat } from "./formats/RawFormat.format";
import { JSONFormat } from "./formats/JSONFormat.format";

import { ConfigFile } from "./ConfigFile";
import { ConfigDirectory } from "./ConfigDirectory";

export { ConfigFile } from "./ConfigFile";
export { ConfigDirectory } from "./ConfigDirectory";

export { Format };
export { formats };

formats.register_format(JSONFormat, [ "json" ]);

formats.set_default_format(RawFormat);

/**
 * Creates a new ConfigFile relative to process.cwd()
 * @example
 * import {
 *      ConfigFile,
 *      file
 * } from "mtlc";
 * 
 * const file: ConfigFile = file("config.json");
 * 
 * @param { string } file_path - File path relative to process.cwd()
 * @param { Format } [ format ]
 * @returns { ConfigFile }
 */
export function file(file_path: string, format?: Format): ConfigFile {
    return new ConfigFile(path.resolve(process.cwd(), file_path), format);
}

/**
 * Creates a new ConfigDirectory relative to process.cwd().   
 * The Directory's format will be applied to all of it's files
 * @example
 * import {
 *      ConfigDirectory,
 *      directory,
 *      formats
 * } from "mtlc";
 * 
 * const directory: ConfigDirectory = directory("configs", new formats.formats.JSONFormat());
 * 
 * @param { string } directory_path - Directory path relative to process.cwd() 
 * @param { Format } [ format ] 
 * @returns { ConfigDirectory }
 */
export function directory(directory_path: string, format?: Format): ConfigDirectory {
    return new ConfigDirectory(path.resolve(process.cwd(), directory_path), format);
}