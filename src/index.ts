import {
    register_format,
    set_default_format
} from "./formats";

import raw from "./formats/raw.format";
import json from "./formats/json.format";
import buffer from "./formats/buffer.format";

export { ConfigFile } from "./ConfigFile";
export {ConfigDirectory} from "./ConfigDirectory";

register_format("raw", raw);
register_format("json", json, [ "json" ]);
register_format("buffer", buffer);

set_default_format("raw");