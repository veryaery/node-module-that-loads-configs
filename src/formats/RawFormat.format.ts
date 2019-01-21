import { Format } from "../Format";
import { FormatReturnObject } from "../interfaces/FormatReturnObject";

export class RawFormat extends Format {

    read(data: Buffer, default_content?: string, default_options?: null): FormatReturnObject {
        if (data) {
            return <FormatReturnObject>{ content: data.toString() };
        } else {
            if (default_content) {
                return <FormatReturnObject>{
                    content: default_content,
                    defaulted: true
                };
            } else {
                return <FormatReturnObject>{ content: data };
            }
        }
    }

    write(content: string): string {
        return content;
    }

}