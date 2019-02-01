import {
    Format,
    FormatReturnObject
} from "../Format";

/**
 * Transforms json data 
 * 
 * @memberof formats
 * @class JSONFormat
 * @extends Format
 * @param { ?number } indent - Number of spaces to be used as indentation when writing
 */
export class JSONFormat extends Format {

    indent: number;

    constructor(indent?: number) {
        super();
        
        this.indent = indent;
    }

    /**
     * @memberof formats.JSONFormat
     * @instance
     * @function read
     * @ignore
     */
    read(data: Buffer, default_content?: any, default_options?: {
        default_properties?: boolean,
        recursive?: boolean
    }): FormatReturnObject {
        if (!data && default_content) {
            return {
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

                return {
                    content: content,
                    defaulted
                };
            } catch (error) {
                throw error;
            }
        }
    }

    /**
     * @memberof formats.JSONFormat
     * @instance
     * @function write
     * @ignore
     */
    write(content: any): string {
        try {
            return this.indent ? JSON.stringify(content, null, this.indent) : JSON.stringify(content);
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
    
        return {
            content: content,
            defaulted
        };
    }

}

/**
 * Number of spaces to be used as indentation when writing
 * 
 * @memberof formats.JSONFormat
 * @instance
 * @member { number } indent
 */