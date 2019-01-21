import { Format } from "./Format";
import { BufferFormat } from "./formats/BufferFormat.format";
import { RawFormat } from "./formats/RawFormat.format";
import { JSONFormat } from "./formats/JSONFormat.format";

export const file_extention_name_formats: {} = {};
export let default_format: new () => Format;

export function register_format(format: new () => Format, file_extention_names: string[]): void {
    for (const file_extention_name of file_extention_names) {
        file_extention_name_formats[file_extention_name] = format;
    }
}

export function set_default_format(format: new () => Format): void {
    default_format = format;
}

export const formats: any = {
    BufferFormat,
    RawFormat,
    JSONFormat
};