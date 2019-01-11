import {
    readFile,
    writeFile
} from "fs";
import * as path from "path";

export class ConfigFile {

    path: string;
    format: () => any;
    default_content: {};

    private default_options: any;

    constructor(path: string, format: () => any) {
        this.path = path;   
        this.format = format;
    }

    def(default_content: {}, default_options?: any): ConfigFile {
        this.default_content = default_content;
        this.default_options = default_options;
        return this;
    }

    read(write_if_defaulted?: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            readFile(this.path, (error, data) => {
                if (error) {
                    reject(error);
                } else {

                }
            });
        });
    }

}