import {
    register_format,
    set_default_format
} from "./formats";

import raw from "./formats/raw.format";
import json from "./formats/json.format";

export { ConfigFile } from "./ConfigFile";

register_format("raw", raw);
register_format("json", json, [ "json" ]);

set_default_format("raw");