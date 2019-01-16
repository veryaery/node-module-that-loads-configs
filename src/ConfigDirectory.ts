import { readdir } from "fs";
import * as path from "path";

import { ConfigFile } from "./ConfigFile";

export class ConfigDirectory {

    files: {} = {};
    defaulted: boolean;

    private path: string;
    private format: string;
    private default_files: any;
    private default_options: any;

    constructor(path: string, format: string) {
        this.path = path;
        this.format = format;
    }

    def(default_files: any, default_options: any): ConfigDirectory {
        this.default_files = default_files;
        this.default_options = default_options;
        return this;
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

                if (default_files) {
                    for (const file in default_files) {
                        if (!files.includes(file)) {
                            files.push(file);
                        }
                    }
                }

                for (const file of files) {
                    const config_file: ConfigFile = new ConfigFile(file, this.format);

                    await config_file
                        .def(default_files[file], this.default_options)
                        .read(options ? { write_if_defaulted: options.write_if_defaulted } : null, read_options, write_options);

                    this.files[path.relative(this.path, file)] = config_file;
                }

                resolve(this);
            });
        });
    }

}