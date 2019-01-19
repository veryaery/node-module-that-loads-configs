import * as path from "path";

import Format from "./interfaces/Format";

export const formats: {} = {};
export const file_extention_name_formats: {} = {};
export let default_format: string;

export function register_format(name: string, format: Format, file_extention_names?: string[]): void {
    formats[name] = format;
    if (file_extention_names) {
        for (const file_extention_name of file_extention_names) {
            file_extention_name_formats[file_extention_name] = name;
        }
    }
}

export function set_default_format(name: string): void {
    default_format = formats[name];
}

export function file_extention_name_format(file_path: string): string {
    let file_extention_name = path.extname(file_path);

    if (file_extention_name && file_extention_name.startsWith(".")) {
        file_extention_name = file_extention_name.substring(1, file_extention_name.length);
    }

    const file_extention_name_format = file_extention_name_formats[file_extention_name];

    if (file_extention_name_format) {
        return file_extention_name_format;
    } else {
        return default_format;
    }
}