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

export class ConfigFile {

    content: any;
    defaulted: boolean;
    file_path: string;
    format: Format;
    default_content: {};
    default_options: any;

    constructor(file_path: string, format?: Format) {
        this.file_path = file_path;   
        this.format = format || this.get_format();
    }

    def(default_content: any, default_options?: any): ConfigFile {
        this.default_content = default_content;
        this.default_options = default_options;
        return this;
    }

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