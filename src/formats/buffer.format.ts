import Format from "../interfaces/Format";
import FormatReturnObject from "../interfaces/FormatReturnObject";

export default <Format>{
    read: (data: Buffer, default_content?: any): FormatReturnObject => {
        if (!data && default_content) {
            return {
                content: default_content,
                defaulted: true
            };
        } else {
            return {
                content: data
            };
        }
    },
    write: (content: any): string => content.toString()
}