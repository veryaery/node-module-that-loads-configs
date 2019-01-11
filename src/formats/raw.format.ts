export default function (content: string, default_content?: any, default_options?: any): any {
    if (content == "" && default_content) {
        return {
            content: default_content,
            defaulted: true
        };
    } else {
        return { content };
    }
}