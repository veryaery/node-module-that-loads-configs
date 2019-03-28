import {
    readFile,
    writeFile,
    access,
    mkdir
} from "fs";
import * as path from "path";

import * as formats from "../formats";

import {
    Format,
    FormatReturnObject
} from "../interfaces/Format";

/**
 * Represents a configuration file
 * 
 * @class ConfigFile
 * @param { string } file_path - Absolute path to file
 * @param { ?Format } format - Format responsible for data and content transformation for ConfigDirectory's ConfigFiles to use
 */
export class ConfigFile {

    content: any;
    defaulted: boolean;
    file_path: string;
    format: Format;
    default_content: any;
    default_options: any;

    constructor(file_path: string, format?: Format) {
        this.file_path = file_path;   
        this.format = format || this._get_format();
    }

    /**
     * Specify what and how format should default content when reading
     * 
     * @memberof ConfigFile
     * @instance
     * @function defaults
     * @param {} default_content - What content format should default to when reading
     * @param {} default_options - Options telling format how to default content when reading
     * @returns { ConfigFile } - This ConfigFile for chainability
     */
    defaults(default_content: object, default_options?: any): ConfigFile {
        this.default_content = default_content;
        this.default_options = default_options;
        return this;
    }

    /**
     * Reads file and sets content and defaulted after being transformed by format
     * 
     * @memberof ConfigFile
     * @instance
     * @async
     * @function read
     * @param { ?object } options
     * @param { ?boolean } options.write_if_defaulted - Call write method if content was defaulted in any way after reading
     * @returns { Promise<ConfigFile> } - This ConfigFile for chainability
     */
    async read(options?: { write_if_defaulted?: boolean }): Promise<ConfigFile> {
        return new Promise<ConfigFile>(async resolve => {
            readFile(this.file_path, async (error, data = null) => {
                let result: FormatReturnObject | Promise<FormatReturnObject> = this.format.read(data, this.default_content, this.default_options);

                if (result instanceof Promise) {
                    result = await result;
                }

                this.content = result.content;
                this.defaulted = false;

                if (result.defaulted == true) {
                    this.defaulted = true;
                    if (options && options.write_if_defaulted) {
                        await this.write();
                    }
                }

                resolve(this);
            });
        });
    }

    /**
     * Writes content after being transformed by format
     * 
     * @memberof ConfigFile
     * @instance
     * @async
     * @function write
     * @returns { Promise<ConfigFile> } - This ConfigFile for chainability
     */
    async write(): Promise<ConfigFile> {
        return new Promise<ConfigFile>(async (resolve, reject) => {
            let result: string | Promise<string> = this.format.write(this.content);

            if (result instanceof Promise) {
                result = await result;
            }

            // Ensure that the parent directory exists before writing this file
            await this._ensure(path.dirname(this.file_path));

            writeFile(this.file_path, result, error => {
                if (error) {
                    reject(error);
                } else {
                    resolve(this);
                }
            });
        });
    }

    private async _ensure(directory_path: string): Promise<void> {
        if (!await this._exists(directory_path)) {
            // Ensure that the parent directory exists before trying to create this directory
            await this._ensure(path.dirname(directory_path));

            try {
                await this._mkdir(directory_path);
            } catch (error) {
                throw error;
            }
        }
    }

    private _get_format(): Format {
        let file_extention_name = path.extname(this.file_path);
    
        if (file_extention_name && file_extention_name.startsWith(".")) {
            file_extention_name = file_extention_name.substring(1, file_extention_name.length);
        }
    
        const file_extention_name_format: new () => Format = formats.file_extention_name_formats[file_extention_name];
    
        if (file_extention_name_format) {
            return new file_extention_name_format();
        } else {
            return new formats.default_format();
        }
    }

    private _exists(file: string): Promise<boolean> {
        return new Promise(resolve => {
            access(file, error => {
                if (error) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }

    private _mkdir(directory: string): Promise<void> {
        return new Promise((resolve, reject) => {
            mkdir(directory, error => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

}

/**
 * Transformed data
 * 
 * @memberof ConfigFile
 * @instance
 * @member {} content
 */

/**
 * If content was defaulted in any way after reading
 * 
 * @memberof ConfigFile
 * @instance
 * @member { boolean } defaulted
 */

/**
 * Absolute path to file
 * 
 * @memberof ConfigFile
 * @instance
 * @member { string } file_path
 */

/**
 * Format responsible for data and content transformation
 * 
 * @memberof ConfigFile
 * @instance
 * @member { Format } format
 */

/**
 * What content format should default to when reading
 * 
 * @memberof ConfigFile
 * @instance
 * @member {} default_content
 */

/**
 * Options telling format how to default content when reading
 * 
 * @memberof ConfigFile
 * @instance
 * @member {} default_options
 */