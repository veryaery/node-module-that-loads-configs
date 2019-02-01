![](https://i.imgur.com/LBPzwco.png)
(Character: Tohru from Miss Kobayashi's Dragon Maid)

# Examples

### Reading a raw text file
```ts
import * as mtlc from "mtlc";

const file: mtlc.ConfigFile = await mtlc.file("raw.txt") // Defaults to RawFormat format by default
    .read();

console.log(file.content);
```
```
Contents of raw.txt
```

### Reading a JSON file
```ts
import * as mtlc from "mtlc";

const file: mtlc.ConfigFile = await mtlcfile("config.json") // Associates json files with JSONFormat format by default
    .def({
        ip: "127.0.0.1",
        port: 1337
    }) // What content should default to when reading
    .read({ write_if_defaulted: true }); // Write if content is defaulted in any way after reading

console.log(file.content);
```
```
{ ip: "127.0.0.1", port: 1337 } | Contents of config.json
```

### Writing a raw text file
```ts
import * as mtlc from "mtlc";

const file: mtlc.ConfigFile = mtlc.file("foo.txt"); // Defaults to RawFormat format by default

file.content = "bar";

file.write();
```

### Reading a directory
```ts
import * as mtlc from "mtlc";

const directory: mtlc.ConfigDirectory = await mtlc.directory("recipies", new mtlc.formats.JSONFormat())
    .def({
        "water.json": {
            steps: [ "Pour water" ]
        },
        "cereal.json": {
            steps: [
                "Pour cereal FIRST",
                "THEN pour milk"
            ]
        }
    }) // What the directory's files' content should default to when reading
    .read();

const contents: any = directory.contents();

console.log(contents["water.json"]);
console.log(contents["cereal.json"]);
```
```
{ steps: [ "Pour water" ] } | Contents of water.json
{ steps: [ "Pour cereal FIRST", "THEN pour milk" ] } | Contents of cereal.json
(Remaining files' contents from recipies)
```