import {
    readdir,
    stat
} from "fs";
import * as path from "path";

import { Format } from "../interfaces/Format";

import { ConfigFile } from "./ConfigFile";

export type ConfigDirectoryReadOptions = {
    only_read_defaults?: boolean,
    read_directories?: boolean,
    recursive?: boolean,
    write_if_defaulted?: boolean
}

type ConfigDirectoryReadDirectoryReturnObject = {
    files: {},
    defaulted: boolean
}

/**
 * Represents a configuration directory
 * 
 * @class ConfigDirectory
 * @param { string } directory_path - Absolute path to directory
 * @param { ?Format } format - Format responsible for data and content transformation. Passed when initializing a new ConfigFile when reading 
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
     * Specify what and how each ConfigFile's format should default content when reading
     * 
```ts
import * as mlc from "@aery/mlc";
    
const directory: mlc.ConfigDirectory = mlc.directory("configs", new mlc.formats.JSONFormat());

directory.def({
    "config.json": {
        ip: "127.0.0.1",
        port: 1337
    }
});
```
     * 
     * @memberof ConfigDirectory
     * @instance
     * @function def
     * @param {} default_files - Content each ConfigFile's format should default to when reading
     * @param {} default_options - Options telling format how to default content when reading
     * @returns { ConfigDirectory } - This ConfigDirectory for chainability
     */
    def(default_files: object, default_options: any): ConfigDirectory {
        this.default_files = default_files;
        this.default_options = default_options;
        return this;
    }

    /**
     * Returns an object of ConfigDirectory's ConfigFiles' and ConfigDirectory's contents
     * 
     * @memberof ConfigDirectory
     * @instance
     * @function contents
     * @returns { object } - ConfigDirectory's ConfigFiles' and ConfigDirectory's contents
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
     * Reads directory's files and sets ConfigFile's content and defaulted being transformed by their formats
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

        const result: ConfigDirectoryReadDirectoryReturnObject = await this.read_directory(this.directory_path, this.files, options, default_files, true);

        this.files = result.files;
        this.defaulted = result.defaulted;
        return this;
    }
    
    /**
     * Writes ConfigDirectory's ConfigFiles' contents after being transformed by their formats
     * 
     * @memberof ConfigDirectory
     * @instance
     * @async
     * @function write
     * @returns { Promise<ConfigDirectory> } - This ConfigDirectory for chainability
     */
    async write(): Promise<ConfigDirectory> {
        for (const file in this.files) {
            const configfile = this.files[file];

            try {
                await configfile.write();
            } catch (error) {
                throw error;
            }
        }

        return this;
    }

    private readdir(directory_path: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            readdir(directory_path, (error, files) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(files);
                }
            });
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

    private async read_directory(directory_path: string, existing_configfiles: object, options?: ConfigDirectoryReadOptions, default_files?: {}, recursive?: boolean): Promise<ConfigDirectoryReadDirectoryReturnObject> {
        const configfiles: object = {};
        
        let files: string[];
        let defaulted: boolean = false;

        try {
            files = await this.readdir(directory_path);
        } catch (error) {
            // Directory doesn't exist
            files = [];
        }

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
                    let configdirectory: ConfigDirectory;

                    // See if there already exists a ConfigDirectory
                    if (existing_configfiles) {
                        configdirectory = existing_configfiles[file];
                    }

                    if (configdirectory) {
                        config = configdirectory;
                    } else {
                        // There isn't any. Create a new ConfigDirectory
                        config = new ConfigDirectory(file, this.format);
                    }

                    // Read directory
                    if (options.recursive || recursive) {
                        const result: ConfigDirectoryReadDirectoryReturnObject = await this.read_directory(config.directory_path, config.files, options, null, false);
                        config.files = result.files;
                        config.defaulted = result.defaulted;
                    }
                } else {
                    continue;
                }
            } else {
                let configfile: ConfigFile;

                // See if there already is a ConfigFile instance
                if (existing_configfiles) {
                    configfile = existing_configfiles[file];
                }

                if (configfile) {
                    config = configfile;
                } else {
                    // There isn't  any. Create a new ConfigFile
                    config = new ConfigFile(file, this.format);            
                }

                // Read file
                await config
                    .def(default_files ? default_files[file] : null, this.default_options)
                    .read(options ? { write_if_defaulted: options.write_if_defaulted } : null);
            }
                
            if (config.defaulted == true) {
                defaulted = true;
            }

            configfiles[path.relative(directory_path, file)] = config;
        }

        return {
            files: configfiles,
            defaulted
        };
    }

}

/**
 * @typedef ConfigDirectoryReadOptions
 * @property { ?boolean } only_read_defaults - Only read files with specified default content
 * @property { ?boolean } read_directories - Read directories
 * @property { ?boolean } recursive - Recursively read directories. Needs read_directories to work
 * @property { ?boolean } write_if_defaulted - Call write method if any of directory's files' contents were defaulted in any way after reading
 */

 /**
 * ConfigDirectory's ConfigFiles
 * 
 * @memberof ConfigDirectory
 * @instance
 * @member { object } files
 */

/**
 * If any of directory's files' contents were defaulted in any way after reading
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
 * Format responsible for data and content transformation. Passed when initializing a new ConfigFile when reading 
 * 
 * @memberof ConfigDirectory
 * @instance
 * @member { Format } format
 */

/**
 * Content each ConfigFile's format should default to when reading
 * 
 * @memberof ConfigDirectory
 * @instance
 * @member {} default_content
 */

/**
 * Options telling format how to default content when reading
 * 
 * @memberof ConfigDirectory
 * @instance
 * @member {} default_options
 */