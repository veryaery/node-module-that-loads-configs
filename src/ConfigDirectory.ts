import { readdir } from "fs";
import * as path from "path";

import { ConfigFile } from "./ConfigFile";

export class ConfigDirectory {

    files: {} = {};
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
        
    }

    async read(
        options?: {
            only_read_defaults?: boolean,
            write_if_defaulted?: boolean
        },
        read_options?: any,
        write_options?: any
    ): Promise<ConfigDirectory> {
        return new Promise(async resolve => {
            readdir(this.path, async (error, files = []) => {
                const default_files: {} = {};

                if (this.default_files) {
                    for (const file in this.default_files) {
                        default_files[path.resolve(this.path, file)] = default_files[file];
                    }
                }

                files = files.map(file => path.resolve(this.path, file));

                if (options && options.only_read_defaults) {
                    files = files.filter(file => default_files.hasOwnProperty(file));
                }

                for (const file in default_files) {
                    if (!files.includes(file)) {
                        files.push(file);
                    }
                }

                this.defaulted = false;

                for (const file of files) {
                    const config_file: ConfigFile = new ConfigFile(file, this.format);

                    await config_file
                        .def(default_files[file], this.default_options)
                        .read(options ? { write_if_defaulted: options.write_if_defaulted } : null, read_options, write_options);

                    if (config_file.defaulted == true) {
                        this.defaulted = true;
                    }

                    this.files[path.relative(this.path, file)] = config_file;
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

}