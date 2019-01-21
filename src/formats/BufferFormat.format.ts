import { Format } from "../Format";
import { FormatReturnObject } from "../interfaces/FormatReturnObject";

export class BufferFormat extends Format {
    
    read(data: Buffer, default_content?: Buffer, default_options?: null): FormatReturnObject {
        if (!data && default_content) {
            return <FormatReturnObject>{
                content: default_content,
                defaulted: true
            };
        } else {
            return <FormatReturnObject>{ content: data };
        }
    }

    write(content: any): string {
        return content.toString();
    }

}