![](https://i.imgur.com/LBPzwco.png)
(Character: "Tohru" from "Miss Kobayashi's Dragon Maid")

[![](https://img.shields.io/npm/v/mtlc.svg?colorB=%23C5383B&style=flat-square)](https://www.npmjs.com/package/mtlc)

### [Documentation](https://aery-chan.github.io/node-module-that-loads-configs/)

# Examples

### Reading a raw text file
```ts
import {
    ConfigFile,
    file
} from "mtlc";

const file: ConfigFile = await file("raw.txt") // Defaults to "RawFormat" format by default
    .read();

console.log(file.content);
```
<pre><code><i>Contents of "raw.txt"</i></code></pre>

### Reading a JSON file
```ts
import {
    ConfigFile,
    file
} from "mtlc";

const file: ConfigFile = await file("config.json") // Associates json files with "JSONFormat" format by default
    .def({
        ip: "127.0.0.1",
        port: 1337
    }) // What the content should default to
    .read({ write_if_defaulted: true }); // Write file if the content is in any way defaulted

console.log(file.content);
```
<pre><code><i>Contents of "config.json"</i> | { ip: "127.0.0.1", port: 1337 }</code></pre>

### Writing a raw text file
```ts
import {
    ConfigFile,
    file
} from "mtlc";

const file: ConfigFile = file("foo.txt"); // Defaults to "RawFormat" format by default

file.content = "bar";

file.write();
```

### Reading a directory
```ts
import {
    ConfigDirectory,
    directory,
    formats
} from "mtlc";

const directory: ConfigDirectory = await directory("recipies", new formats.formats.JSONFormat())
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
    }) // What the directory's file's content should default to
    .read();

const contents: any = directory.contents();

console.log(contents["water.json"]);
console.log(contents["cereal.json"]);
```
<pre><code><i>Contents of "water.json"</i> | { steps: [ "Pour water" ] }<br>
<i>Contents of "cereal.json"</i> | { steps: [ "Pour cereal FIRST", "THEN pour milk" ] }</code></pre>

# Compiling

`npm install --only=dev`   
`npm run-script compile`

# Testing

`npm install --only=dev`   
`npm run-script test`