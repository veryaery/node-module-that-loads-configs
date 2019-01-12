import FormatReturnObject from "./FormatReturnObject";

export default interface Format {
    read: (content: string, default_content?: any, default_options?: any) => FormatReturnObject | Promise<FormatReturnObject>,
    write: (content: any) => string | Promise<string>
}