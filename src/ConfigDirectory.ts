import {
    readdir,
    stat
} from "fs";
import * as path from "path";

import { Format } from "./Format";

import { ConfigFile } from "./ConfigFile";

export type ConfigDirectoryReadOptions = {
    only_read_defaults?: boolean,
    read_directories?: boolean,
    recursive?: boolean,
    write_if_defaulted?: boolean
};

type ConfigDirectoryReadDirectoryReturnObject = {
    files: {},
    defaulted: boolean
};

/**
 * A configuration directory
 * 
 * @class ConfigDirectory
 * @param { string } directory_path - Absolute path to directory
 * @param { ?Format } format - Format passed to directory's files
 */
export class ConfigDirectory {

    files: object;
    defaulted: boolean;
    directory_path: string;
    format: Format;
    default_files: any;
    default_options: any;

    constructor(directory_path: string, format?: Format) {
        this.directory_path = directory_path;
        this.format = format;
    }

    /**
     * Specifies default contents and options passed to directory's files
     * @example
     * import * as mlc from "@aery/mlc";
     * 
     * const directory: mlc.ConfigDirectory = mlc.directory("configs", new mlc.formats.JSONFormat());
     * 
     * directory.def({
     *      "config.json": {
     *          ip: "127.0.0.1",
     *          port: 1337
     *      }
     * });
     * 
     * @memberof ConfigDirectory
     * @instance
     * @function def
     * @param {} default_files - Contents passed to files that should be defaulted to when reading
     * @param {} default_options - Options passed to file telling it's format how to default content when reading
     * @returns { ConfigDirectory } - This ConfigDirectory for chainability
     */
    def(default_files: any, default_options: any): ConfigDirectory {
        this.default_files = default_files;
        this.default_options = default_options;
        return this;
    }

    /**
     * Returns an object with only directory's files' and directories' contents
     * 
     * @memberof ConfigDirectory
     * @instance
     * @function contents
     * @returns { object } - Directory's files' and directories' contents
     */
    contents(): object {
        const contents: object = {};

        if (this.files) {
            for (const file in this.files) {
                const config = this.files[file];
    
                if (config instanceof ConfigFile) {
                    contents[file] = config.content;
                } else if (config instanceof ConfigDirectory) {
                    contents[file] = config.contents();
                }
            }
        }

        return contents;
    }

    /**
     * Reads directory's files and updates files and defaulted after files have been transformed by their formats
     * 
     * @memberof ConfigDirectory
     * @instance
     * @async
     * @function read
     * @param { ?ConfigDirectoryReadOptions } options
     * @returns { Promise<ConfigDirectory> } - This ConfigDirectory for chainability
     */
    async read(options?: ConfigDirectoryReadOptions): Promise<ConfigDirectory> {
        // Map default_files to absolute file paths
        const default_files: object = {};

        if (this.default_files) {
            for (const file in this.default_files) {
                default_files[path.resolve(this.directory_path, file)] = this.default_files[file];
            }
        }

        const result: ConfigDirectoryReadDirectoryReturnObject = await this.read_directory(this.directory_path, options, default_files, true);

        this.files = result.files;
        this.defaulted = result.defaulted;
        return this;
    }
    
    /**
     * Writes directory's files' contents after being transformed by their format
     * 
     * @memberof ConfigDirectory
     * @instance
     * @async
     * @function write
     * @returns { Promise<ConfigDirectory> } - This ConfigDirectory for chainability
     */
    async write(): Promise<ConfigDirectory> {
        return new Promise(async (resolve, reject) => {
            for (const file in this.files) {
                const config_file = this.files[file];

                try {
                    await config_file.write();
                } catch (error) {
                    reject(error);
                }
            }

            resolve(this);
        });
    }

    private is_directory(file_path: string): Promise<boolean> {
        return new Promise(resolve => {
            stat(file_path, (error, stats) => {
                if (error) {
                    resolve(false);
                } else {
                    resolve(stats.isDirectory());
                }
            });
        });
    }

    private async read_directory(directory_path: string, options?: ConfigDirectoryReadOptions, default_files?: {}, recursive?: boolean): Promise<ConfigDirectoryReadDirectoryReturnObject> {
        return new Promise(async resolve => {
            readdir(directory_path, async (error, files = []) => {
                const directory_files: object = {};
                let defaulted: boolean = false;

                // Map files to absolute file paths
                files = files.map(file => path.resolve(directory_path, file));

                if (options && options.only_read_defaults) {
                    // Remove non-default files
                    files = files.filter(file => default_files.hasOwnProperty(file));
                }
        
                // Add default files
                for (const file in default_files) {
                    if (!files.includes(file)) {
                        files.push(file);
                    }
                }
        
                // Read files
                for (const file of files) {
                    let config: ConfigFile | ConfigDirectory;
        
                    if (await this.is_directory(file)) {
                        if (options && options.read_directories) {
                            config = new ConfigDirectory(file, this.format);
        
                            if (options.recursive || recursive) {
                                const result: ConfigDirectoryReadDirectoryReturnObject = await this.read_directory(config.directory_path, options, null, false);
                                config.files = result.files;
                                config.defaulted = result.defaulted;
                            }
                        } else {
                            continue;
                        }
                    } else {
                        config = new ConfigFile(file, this.format);
        
                        await config
                            .def(default_files ? default_files[file] : null, this.default_options)
                            .read(options ? { write_if_defaulted: options.write_if_defaulted } : null);
                    }
                        
                    if (config.defaulted == true) {
                        defaulted = true;
                    }
        
                    directory_files[path.relative(directory_path, file)] = config;
                }

                resolve({
                    files: directory_files,
                    defaulted
                });
            });
        });
    }

}

/**
 * @typedef ConfigDirectoryReadOptions
 * @property { ?boolean } only_read_defaults - Only read files with specified default content
 * @property { ?boolean } read_directories - Read directories
 * @property { ?boolean } recursive - Recursively read directories. Requires read_directories to be true
 * @property { ?boolean } write_if_defaulted - Write if any of directory's files' content was defaulted in any way
 */

 /**
 * Directory files
 * 
 * @memberof ConfigDirectory
 * @instance
 * @member { object } files
 */

/**
 * If any of directory's files' content was defaulted in any way after reading
 * 
 * @memberof ConfigDirectory
 * @instance
 * @member { boolean } defaulted
 */

/**
 * Absolute path to directory
 * 
 * @memberof ConfigDirectory
 * @instance
 * @member { string } directory_path
 */

/**
 * Format passed to directory's files
 * 
 * @memberof ConfigDirectory
 * @instance
 * @member { Format } format
 */

/**
 * Contents passed to files that should be defaulted to when reading
 * 
 * @memberof ConfigDirectory
 * @instance
 * @member {} default_content
 */

/**
 * Options passed to file telling it's format how to default content when reading
 * 
 * @memberof ConfigDirectory
 * @instance
 * @member {} default_options
 */