import Format from "./interfaces/Format";

export const formats: {} = {};
export const file_extention_name_formats: {} = {};
export let default_format: string;

export function register_format(name: string, format: Format, file_extention_names?: string[]): void {
    formats[name] = format;
    if (file_extention_names) {
        for (const file_extention_name of file_extention_names) {
            file_extention_name_formats[file_extention_name] = format;
        }
    }
}

export function set_default_format(name: string): void {
    default_format = formats[name];
}