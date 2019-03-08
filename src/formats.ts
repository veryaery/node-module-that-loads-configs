import { Format } from "./interfaces/Format";

export { BufferFormat } from "./formats/BufferFormat.format";
export { RawFormat } from "./formats/RawFormat.format";
export { JSONFormat } from "./formats/JSONFormat.format";

/**
 * @namespace formats
 */

export const file_extention_name_formats: {} = {};
export let default_format: new () => Format;

/**
 * Associates format with provided file extention.
 * Used by the file and directory methods
 *
```ts
import {
     Format,
     formats
} from "@aery/mlc";

class MyFormat extends Format {
     // ...
}

formats.register_format(MyFormat, [ "ext" ]);
```
 *
 * @memberof formats
 * @function register_format
 * @param format
 * @param { string[] } file_extention_names
 * @returns { void }
 */
export function register_format(format: new () => Format, file_extention_names: string[]): void {
    for (const file_extention_name of file_extention_names) {
        file_extention_name_formats[file_extention_name] = format;
    }
}

/**
 * Sets the default format used by the file and directory methods if no other format was specified and no format is associated with it's file extention name
 * 
```ts
import {
    Format,
    formats
} from "@aery/mlc";

class MyFormat extends Format {
    // ...
}

formats.set_default_format(MyFormat);
```
 * 
 * @memberof formats
 * @function set_default_format
 * @param format
 * @returns { void }
 */
export function set_default_format(format: new () => Format): void {
    default_format = format;
}