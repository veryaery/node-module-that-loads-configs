import * as path from "path";

import * as formats from "./formats";

import raw from "./formats/raw.format";
import json from "./formats/json.format";
import buffer from "./formats/buffer.format";

import { ConfigFile } from "./ConfigFile";
import { ConfigDirectory } from "./ConfigDirectory";

export { ConfigFile } from "./ConfigFile";
export { ConfigDirectory } from "./ConfigDirectory";
export { formats };

formats.register_format("raw", raw);
formats.register_format("json", json, [ "json" ]);
formats.register_format("buffer", buffer);

formats.set_default_format("raw");

/**
 * Creates a new ConfigFile relative to process.cwd()
 * ```ts
const file: mtlc.ConfigFile = mtlc.file("config.json");
 ```
 * @param { string } file_path - File path relative to process.cwd()
 * @param { string } [ format ]
 * @returns { ConfigFile }
 */
export function file(file_path: string, format?: string): ConfigFile {
    return new ConfigFile(path.resolve(process.cwd(), file_path), format);
}

/**
 * Creates a new ConfigDirectory relative to process.cwd()   
 *    
 * The directory's format will be applied to all of it's files
 * ```ts
const directory: mtlc.ConfigDirectory = mtlc.directory("configs");
 ```
 * @param { string } directory_path - Directory path relative to process.cwd() 
 * @param { string } [ format ] 
 * @returns { ConfigDirectory }
 */
export function directory(directory_path: string, format?: string): ConfigDirectory {
    return new ConfigDirectory(path.resolve(process.cwd(), directory_path), format || formats.default_format);
}