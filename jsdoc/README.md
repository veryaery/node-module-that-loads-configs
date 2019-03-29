![](https://i.imgur.com/2tDOn1l.png)
(Character: Tohru from Miss Kobayashi's Dragon Maid)

# Examples

### Reading a raw text file
```ts
import * as mlc from "@aery/mlc";

const file: mlc.ConfigFile = await mlc.file("raw.txt") // Defaults to RawFormat format by default
    .read();

file.content;
```

### Reading a JSON file
```ts
import * as mlc from "@aery/mlc";

const file: mlc.ConfigFile = await mlc.file("config.json") /* Associates json files with
                                                              JSONFormat format by default */
    .defaults({
        ip: "127.0.0.1",
        port: 1337
    }) // What content should default to when reading
    .read({ write_if_defaulted: true }); // Write if content was defaulted in any way after reading

file.content;
```

### Writing a raw text file
```ts
import * as mlc from "@aery/mlc";

const file: mlc.ConfigFile = mlc.file("foo.txt"); // Defaults to RawFormat format by default

file.content = "bar";

file.write();
```

### Reading a directory
```ts
import * as mlc from "@aery/mlc";

const directory: mlc.ConfigDirectory = await mlc.directory("recipies", new mlc.formats.JSONFormat())
    .defaults({
        "water.json": {
            steps: [ "Pour water" ]
        },
        "cereal.json": {
            steps: [
                "Pour cereal FIRST",
                "THEN pour milk"
            ]
        }
    }) // What the ConfigDirectory's ConfigFiles' content should default to when reading
    .read();

const contents: object = directory.contents();

contents["water.json"];
contents["cereal.json"];
```