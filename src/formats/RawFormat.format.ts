import {
    Format,
    FormatReturnObject
} from "../Format";

export class RawFormat extends Format {

    read(data: Buffer, default_content?: string, default_options?: null): FormatReturnObject {
        if (data) {
            return {
                content: data.toString(),
                defaulted: false
            };
        } else {
            if (default_content) {
                return {
                    content: default_content,
                    defaulted: true
                };
            } else {
                return {
                    content: data,
                    defaulted: false
                };
            }
        }
    }

    write(content: string): string {
        return content;
    }

}