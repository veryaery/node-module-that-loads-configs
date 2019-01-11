import FormatReturnObject from "./FormatReturnObject";

export const formats: {} = {};
export const file_extention_name_formats: {} = {};
export let default_format;

export function registerFormat(
    name: string,
    format: (content: string, default_content?: any, default_options?: any) => FormatReturnObject | Promise<FormatReturnObject>,
    file_extention_names?: string[]
): void {
    formats[name] = format;
    if (file_extention_names) {
        for (const file_extention_name of file_extention_names) {
            file_extention_name_formats[file_extention_name] = format;
        }
    }
}

export function setDefaultFormat(name: string): void {
    default_format = formats[name];
}