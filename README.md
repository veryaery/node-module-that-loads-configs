![](https://i.imgur.com/LBPzwco.png)
(Character: Tohru from Miss Kobayashi's Dragon Maid)

[![](https://img.shields.io/npm/v/mtlc.svg?colorB=%23C5383B&style=flat-square)](https://www.npmjs.com/package/mtlc)

### [Documentation](https://aery-chan.github.io/node-module-that-loads-configs/)

# Examples

### Reading a raw text file
```ts
import * as mtlc from "mtlc";

const file: mtlc.ConfigFile = await mtlc.file("raw.txt") // Defaults to RawFormat format by default
    .read();

console.log(file.content);
```
<pre><code><i>Contents of raw.txt</i></code></pre>

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
<pre><code>{ ip: "127.0.0.1", port: 1337 } | <i>Contents of config.json</i></code></pre>

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
<pre><code>{ steps: [ "Pour water" ] } | <i>Contents of water.json</i><br>
{ steps: [ "Pour cereal FIRST", "THEN pour milk" ] } | <i>Contents of cereal.json</i><br>
<i>(Remaining files' contents from recipies)</i></code></pre>

# Compiling

`npm install --only=dev`   
`npm run-script compile`

# Testing

`npm install --only=dev`   
`npm run-script test`