import * as path from "path";

import * as formats from "./formats";

import { Format } from "./Format";
import { RawFormat } from "./formats/RawFormat.format";
import { JSONFormat } from "./formats/JSONFormat.format";

import { ConfigFile } from "./ConfigFile";
import { ConfigDirectory } from "./ConfigDirectory";

export { ConfigFile } from "./ConfigFile";
export { 
    ConfigDirectory,
    ConfigDirectoryReadOptions
} from "./ConfigDirectory";
export { FormatReturnObject} from "./Format";

export { Format };
export { formats };

formats.register_format(JSONFormat, [ "json" ]);

formats.set_default_format(RawFormat);

/**
 * Creates a new ConfigFile relative to process.cwd()
 * @example
 * import * as mtlc from "mtlc";
 * 
 * const file: mtlc.ConfigFile = mtlc.file("config.json");
 * 
 * @param { string } file_path - File path relative to process.cwd()
 * @param { ?Format } format - Data and content transformation format
 * @returns { ConfigFile }
 */
export function file(file_path: string, format?: Format): ConfigFile {
    return new ConfigFile(path.resolve(process.cwd(), file_path), format);
}

/**
 * Creates a new ConfigDirectory relative to process.cwd().   
 * The directory's format will be passed to all of it's files
 * @example
 * import * as mtlc from "mtlc";
 * 
 * const directory: mtlc.ConfigDirectory = mtlc.directory("configs", new mtlc.formats.JSONFormat());
 * 
 * @param { string } directory_path - Directory path relative to process.cwd() 
 * @param { ?Format } format - Data and content transformation format
 * @returns { ConfigDirectory }
 */
export function directory(directory_path: string, format?: Format): ConfigDirectory {
    return new ConfigDirectory(path.resolve(process.cwd(), directory_path), format);
}