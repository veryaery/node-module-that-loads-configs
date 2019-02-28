import {
    Format,
    FormatReturnObject
} from "../Format";

/**
 * Makes no transformations to data
 * 
 * @memberof formats
 * @class BufferFormat
 * @extends Format
 */
export class BufferFormat extends Format {
    
    /**
     * @memberof formats.BufferFormat
     * @instance
     * @function read
     * @ignore
     */
    read(data: Buffer, default_content?: Buffer, default_options?: null): FormatReturnObject {
        if (!data && default_content) {
            return {
                content: default_content,
                defaulted: true
            };
        } else {
            return {
                content: data,
                defaulted: false
            };
        }
    }

    /**
     * @memberof formats.BufferFormat
     * @instance
     * @function write
     * @ignore
     */
    write(content: Buffer): string {
        return content.toString();
    }

}