import { Format } from "../Format";
import { FormatReturnObject } from "../interfaces/FormatReturnObject";

/**
 * @memberof formats.formats
 * @class BufferFormat
 * @extends Format
 */
export class BufferFormat extends Format {
    
    /**
     * @memberof formats.formats.BufferFormat
     * @instance
     * @function read
     * @ignore
     */
    read(data: Buffer, default_content?: Buffer, default_options?: null): FormatReturnObject {
        if (!data && default_content) {
            return <FormatReturnObject>{
                content: default_content,
                defaulted: true
            };
        } else {
            return <FormatReturnObject>{ content: data };
        }
    }

    /**
     * @memberof formats.formats.BufferFormat
     * @instance
     * @function write
     * @ignore
     */
    write(content: Buffer): string {
        return content.toString();
    }

}