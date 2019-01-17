import {
    readFile,
    writeFile,
    access,
    mkdir
} from "fs";
import * as path from "path";

import { formats } from "./formats";

import FormatReturnObject from "./interfaces/FormatReturnObject";

export class ConfigFile {

    content: any;
    defaulted: boolean;
    path: string;
    format: string;
    default_content: {};
    default_options: any;
    
    constructor(path: string, format: string) {
        this.path = path;   
        this.format = format;
    }

    def(default_content: any, default_options?: any): ConfigFile {
        this.default_content = default_content;
        this.default_options = default_options;
        return this;
    }

    async read(
        options?: {
            write_if_defaulted?: boolean
        },
        read_options?: any,
        write_options?: any
    ): Promise<ConfigFile> {
        return new Promise<ConfigFile>(async resolve => {
            readFile(this.path, async (error, data = null) => {
                let result: FormatReturnObject | Promise<FormatReturnObject> = formats[this.format].read(data, this.default_content, read_options, this.default_options);

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
                        await this.write(write_options);
                    }
                }

                resolve(this);
            });
        });
    }

    async write(write_options?: any): Promise<ConfigFile> {
        return new Promise<ConfigFile>(async (resolve, reject) => {
            const directory: string = path.dirname(this.path);

            let result: string | Promise<string> = formats[this.format].write(this.content, write_options);

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

            writeFile(this.path, result, error => {
                if (error) {
                    reject(error);
                } else {
                    resolve(this);
                }
            });
        });
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