import {
    Format,
    FormatReturnObject
} from "../Format";

/**
 * Transforms data to raw content string
 * 
 * @memberof formats
 * @class RawFormat
 * @extends Format
 */
export class RawFormat extends Format {

    /**
     * @memberof formats.RawFormat
     * @instance
     * @function read
     * @ignore
     */
    read(data: Buffer, default_content?: string, default_options?: null): FormatReturnObject {
        if (data) {
            return {
                content: data.toString(),
                defaulted: false
            };
        } else {
            if (default_content) {
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
    }

    /**
     * @memberof formats.RawFormat
     * @instance
     * @function write
     * @ignore
     */
    write(content: string): string {
        return content;
    }

}