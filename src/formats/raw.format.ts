import Format from "../interfaces/Format";
import FormatReturnObject from "../interfaces/FormatReturnObject";

export default <Format>{
    read: (content: string, default_content?: any): FormatReturnObject => {
        if (content == "" && default_content) {
            return {
                content: default_content,
                defaulted: true
            };
        } else {
            return { content };
        }
    },
    write: (content: any): string => content
}