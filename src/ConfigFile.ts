import {
    readFile,
    writeFile
} from "fs";

import { formats } from "./formats";
import FormatReturnObject from "./interfaces/FormatReturnObject";

export class ConfigFile {

    content: any;
    defaulted: boolean;
    
    private path: string;
    private format: string;
    private default_content: {};
    private default_options: any;
    
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

    async write(options?: any): Promise<ConfigFile> {
        return new Promise<ConfigFile>(async (resolve, reject) => {
            let result: string | Promise<string> = formats[this.format].write(this.content, options);

            if (result instanceof Promise) {
                result = <string>await result;
            } else {
                result = <string>result;
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

}