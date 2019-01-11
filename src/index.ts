import {
    registerFormat,
    setDefaultFormat
} from "./formats";

import raw from "./formats/raw.format";

registerFormat("raw", raw);

setDefaultFormat("raw");