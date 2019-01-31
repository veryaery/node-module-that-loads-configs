import {
    readdir,
    stat
} from "fs";
import * as path from "path";

import { Format } from "./Format";

import { ConfigFile } from "./ConfigFile";

type ConfigDirectoryReadOptions = {
    only_read_defaults?: boolean,
    read_directories?: boolean,
    recursive?: boolean,
    write_if_defaulted?: boolean
};

type ConfigDirectoryReadDirectoryReturnObject = {
    files: {},
    defaulted: boolean
};

export class ConfigDirectory {

    files: {};
    defaulted: boolean;
    directory_path: string;
    format: Format;
    default_files: any;
    default_options: any;

    constructor(directory_path: string, format?: Format) {
        this.directory_path = directory_path;
        this.format = format;
    }

    def(default_files: any, default_options: any): ConfigDirectory {
        this.default_files = default_files;
        this.default_options = default_options;
        return this;
    }

    contents(): any {
        const contents: {} = {};

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

    async read(options?: ConfigDirectoryReadOptions): Promise<ConfigDirectory> {
        // Map default_files to absolute file paths
        const default_files: {} = {};

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
                const directory_files: {} = {};
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