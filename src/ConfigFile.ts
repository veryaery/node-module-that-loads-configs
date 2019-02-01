import {
    readFile,
    writeFile,
    access,
    mkdir
} from "fs";
import * as path from "path";

import * as formats from "./formats";

import {
    Format,
    FormatReturnObject
} from "./Format";

/**
 * A configuration file
 * 
 * @class ConfigFile
 * @param { string } file_path - Absolute path to file
 * @param { ?Format } format - Format that will transform data and content
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
        this.format = format || this.get_format();
    }

    /**
     * Specify what and how the file's format should default content when reading
     * 
     * @memberof ConfigFile
     * @instance
     * @function def
     * @param {} default_content - What content should default to when reading
     * @param {} default_options - Options passed to format when reading telling it how to default content
     * @returns { ConfigFile } - This config for chainability
     */
    def(default_content: any, default_options?: any): ConfigFile {
        this.default_content = default_content;
        this.default_options = default_options;
        return this;
    }

    /**
     * Reads configuarion file data and updates content and defaulted after being transformed by file's format
     * 
     * @memberof ConfigFile
     * @instance
     * @async
     * @function read
     * @param { ?object } options
     * @param { ?boolean } options.write_if_defaulted - Write if content is defaulted in any way after reading
     * @returns { Promise<ConfigFile> } - This config for chainability
     */
    async read(options?: { write_if_defaulted?: boolean }): Promise<ConfigFile> {
        return new Promise<ConfigFile>(async resolve => {
            readFile(this.file_path, async (error, data = null) => {
                let result: FormatReturnObject | Promise<FormatReturnObject> = this.format.read(data, this.default_content, this.default_options);

                if (result instanceof Promise) {
                    result = <FormatReturnObject>await result;
                } else {
                    result = <FormatReturnObject>result;
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
     * Writes configuarion file content after being transformed by file's format
     * 
     * @memberof ConfigFile
     * @instance
     * @async
     * @function write
     * @returns { Promise<ConfigFile> } - This config for chainability
     */
    async write(): Promise<ConfigFile> {
        return new Promise<ConfigFile>(async (resolve, reject) => {
            const directory: string = path.dirname(this.file_path);

            let result: string | Promise<string> = this.format.write(this.content);

            if (result instanceof Promise) {
                result = <string>await result;
            } else {
                result = <string>result;
            }
            
            if (!await this.exists(directory)) {
                try {
                    await this.mkdir(directory);
                } catch (error) {
                    return reject(error);
                }
            }

            writeFile(this.file_path, result, error => {
                if (error) {
                    reject(error);
                } else {
                    resolve(this);
                }
            });
        });
    }

    private get_format(): Format {
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

    private exists(file: string): Promise<boolean> {
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

    private mkdir(directory: string): Promise<void> {
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
 * File content
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
 * Format that will transform data and content
 * 
 * @memberof ConfigFile
 * @instance
 * @member { Format } format
 */

/**
 * What content should default to when reading
 * 
 * @memberof ConfigFile
 * @instance
 * @member {} default_content
 */

/**
 * Options passed to format when reading telling it how to default content
 * 
 * @memberof ConfigFile
 * @instance
 * @member {} default_options
 */