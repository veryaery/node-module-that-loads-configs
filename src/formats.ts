import { Format } from "./Format";

export { BufferFormat } from "./formats/BufferFormat.format";
export { RawFormat } from "./formats/RawFormat.format";
export { JSONFormat } from "./formats/JSONFormat.format";

/**
 * @namespace formats
 */

export const file_extention_name_formats: {} = {};
export let default_format: new () => Format;

/**
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
 * @memberof formats
 * @function set_default_format
 * @param format
 * @returns { void }
 */
export function set_default_format(format: new () => Format): void {
    default_format = format;
}