import FormatReturnObject from "../FormatReturnObject";

export default function (content: string, default_content?: any, default_options?: any): FormatReturnObject {
    if (content == "" && default_content) {
        return {
            content: default_content,
            defaulted: true
        };
    } else {
        return { content };
    }
}