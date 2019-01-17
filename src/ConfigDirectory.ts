import {
    readdir,
    stat
} from "fs";
import * as path from "path";

import { ConfigFile } from "./ConfigFile";

export class ConfigDirectory {

    files: {};
    defaulted: boolean;
    path: string;
    format: string;
    default_files: any;
    default_options: any;

    constructor(path: string, format: string) {
        this.path = path;
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

    async read(
        options?: {
            only_read_defaults?: boolean,
            read_directories?: boolean,
            recursive?: boolean,
            write_if_defaulted?: boolean
        },
        read_options?: any,
        write_options?: any
    ): Promise<ConfigDirectory> {
        return new Promise(async resolve => {
            readdir(this.path, async (error, files = []) => {
                // Map default_files and files to absolute file paths
                const default_files: {} = {};

                if (this.default_files) {
                    for (const file in this.default_files) {
                        default_files[path.resolve(this.path, file)] = default_files[file];
                    }
                }

                files = files.map(file => path.resolve(this.path, file));

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

                this.defaulted = false;
                if (!this.files) {
                    this.files = {};
                }

                // Read files
                for (const file of files) {
                    let config: ConfigFile | ConfigDirectory;

                    if (await this.is_directory(file) && options && options.read_directories) {
                        config = new ConfigDirectory(file, this.format);

                        if (options.recursive) {
                            await config.read(options, read_options, write_options);
                        }
                    } else {
                        config = new ConfigFile(file, this.format);

                        await config
                            .def(default_files[file], this.default_options)
                            .read(options ? { write_if_defaulted: options.write_if_defaulted } : null, read_options, write_options);
                    }
                        
                    if (config.defaulted == true) {
                        this.defaulted = true;
                    }

                    this.files[path.relative(this.path, file)] = config;
                }

                resolve(this);
            });
        });
    }

    async write(write_options?: any): Promise<ConfigDirectory> {
        return new Promise(async (resolve, reject) => {
            for (const file in this.files) {
                const config_file = this.files[file];

                try {
                    await config_file.write(write_options);
                } catch (error) {
                    reject(error);
                }
            }
        });
    }

    private is_directory(file: string): Promise<boolean> {
        return new Promise(resolve => {
            stat(file, (error, stats) => {
                if (error) {
                    resolve(false);
                } else {
                    resolve(stats.isDirectory());
                }
            });
        });
    }

}