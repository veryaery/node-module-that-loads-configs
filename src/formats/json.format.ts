import Format from "../interfaces/Format";
import FormatReturnObject from "../interfaces/FormatReturnObject";

function default_properties(content: any, default_content: any, recursive: boolean): FormatReturnObject {
    let defaulted: boolean = false;

    if (typeof default_content == "object") {
        if (typeof content != "object") {
            content = {};
            defaulted = true;
        } else {
            for (const key in default_content) {
                if (!content.hasOwnProperty(key)) {
                    content[key] = default_content[key];
                    defaulted = true;
                } else if (recursive) {
                    const returned: FormatReturnObject = default_properties(content[key], default_content[key], true);

                    content[key] = returned.content;
                    if (returned.defaulted == true) {
                        defaulted = true;
                    }
                }
            }
        }
    }

    return {
        content: content,
        defaulted
    };
}

export default <Format>{
    read: (content: string, default_content?: any, options?: null, default_options?: {
        default_properties?: boolean,
        recursive?: boolean
    }): FormatReturnObject => {
        if (content == "" && default_content) {
            return {
                content: default_content,
                defaulted: true
            };
        } else {
            try {
                let defaulted: boolean = false;

                content = JSON.parse(content);

                if (default_options && default_options.default_properties) {
                    const returned: FormatReturnObject = default_properties(content, default_content, !!default_options.recursive);

                    content = returned.content;
                    if (returned.defaulted == true) {
                        defaulted = true;
                    }
                }

                return {
                    content: content,
                    defaulted
                };
            } catch (error) {
                throw error;
            }
        }
    },
    write: (content: any, options: { indent?: number }): string => {
        try {
            return options && options.indent ? JSON.stringify(content, null, options.indent) : JSON.stringify(content);
        } catch (error) {
            throw error;
        }
    }
}