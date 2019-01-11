const formats: {} = {};

export default formats;
export const file_extention_name_formats: {} = {};

export function registerFormat(
    name: string,
    format: (content: string, default_content?: any, default_options?: any) => {
        content: any,
        defaulted?: boolean
    },
    file_extention_names?: string[]
): void {
    formats[name] = format;
    if (file_extention_names) {
        for (const file_extention_name of file_extention_names) {
            file_extention_name_formats[file_extention_name] = format;
        }
    }
}