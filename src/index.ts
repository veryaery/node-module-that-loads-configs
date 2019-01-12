import {
    registerFormat,
    setDefaultFormat
} from "./formats";

import raw from "./formats/raw.format";

export { ConfigFile } from "./ConfigFile";

registerFormat("raw", raw);

setDefaultFormat("raw");