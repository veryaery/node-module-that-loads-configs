import { Format } from "../Format";
import { FormatReturnObject } from "../interfaces/FormatReturnObject";

type WriteOptionsType = { indent?: number };

export class JSONFormat extends Format {

    write_options: WriteOptionsType;

    constructor(write_options?: WriteOptionsType) {
        super();
        
        this.write_options = write_options;
    }

    read(data: Buffer, default_content?: any, default_options?: {
        default_properties?: boolean,
        recursive?: boolean
    }): FormatReturnObject {
        if (!data && default_content) {
            return <FormatReturnObject>{
                content: default_content,
                defaulted: true
            };
        } else {
            try {
                let content = JSON.parse(data.toString());
                let defaulted: boolean = false;

                if (default_options && default_options.default_properties) {
                    const returned: FormatReturnObject = this.default_properties(content, default_content, !!default_options.recursive);

                    content = returned.content;
                    if (returned.defaulted == true) {
                        defaulted = true;
                    }
                }

                return <FormatReturnObject>{
                    content: content,
                    defaulted
                };
            } catch (error) {
                throw error;
            }
        }
    }

    write(content: any): string {
        try {
            return this.write_options && this.write_options.indent ? JSON.stringify(content, null, this.write_options.indent) : JSON.stringify(content);
        } catch (error) {
            throw error;
        }
    }

    private default_properties(content: any, default_content: any, recursive: boolean): FormatReturnObject {
        let defaulted: boolean = false;

        if (typeof default_content == "object") {
            if (typeof content != "object") {
                content = {};
                defaulted = true;
            } else {
                for (const key in default_content) {
                    if (!content.hasOwnProperty(key)) {
                        content[key] = default_content[key];
                        defaulted = true;
                    } else if (recursive) {
                        const returned: FormatReturnObject = this.default_properties(content[key], default_content[key], true);
    
                        content[key] = returned.content;
                        if (returned.defaulted == true) {
                            defaulted = true;
                        }
                    }
                }
            }
        }
    
        return <FormatReturnObject>{
            content: content,
            defaulted
        };
    }

}