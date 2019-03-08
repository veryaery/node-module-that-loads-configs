export type FormatReturnObject = {
    content: any,
    defaulted: boolean
};

export interface Format {

    read(data: Buffer, default_content?: any, default_options?: any): FormatReturnObject | Promise<FormatReturnObject>

    write(content: any): string | Promise<string>

}

/**
 * Responsible for transforming data before being set as content aswell as content before being written
 * 
```ts
import {
    Format,
    FormatReturnObject
} from "@aery/mlc";

class MyFormat implements Format {

    read(data: Buffer, default_content?: string, default_options?: null): FormatReturnObject {
        // Do something with data
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

    write(content: string): string {
        // Do something with content
        return content;
    }

}
```
 * 
 * @interface Format
 */

/**
 * @typedef FormatReturnObject
 * @property {} content - Transformed data
 * @property { boolean } defaulted - If content was defaulted in any way
 */

/**
 * Transforms data before being set as content
 * 
 * @memberOf Format
 * @function read
 * @param { Buffer } data
 * @param default_content 
 * @param default_options
 * @returns { FormatReturnObject | Promise<FormatReturnObject> }
 */

/**
 * Transforms content before being written
 * 
 * @memberOf Format
 * @function write
 * @param content
 * @returns { string | Promise<string> } - Transformed content
 */