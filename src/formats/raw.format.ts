import Format from "../interfaces/Format";
import FormatReturnObject from "../interfaces/FormatReturnObject";

export default <Format>{
    read: (data: Buffer, default_content?: any): FormatReturnObject => {
        if (data) {
            return { content: data.toString() };
        } else {
            if (default_content) {
                return {
                    content: default_content,
                    defaulted: true
                };
            } else {
                return { content: data };
            }
        }
    },
    write: (content: any): string => content
}