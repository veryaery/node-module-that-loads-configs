![](https://i.imgur.com/2tDOn1l.png)
(Character: Tohru from Miss Kobayashi's Dragon Maid)

[![](https://img.shields.io/npm/v/@aery/mlc.svg?colorB=%23C5383B&style=flat-square)](https://www.npmjs.com/package/@aery/mlc)

A simple, functional, and flexible way to load your configuration files

### Features

* Simple, configs loaded with 2 lines of code
* Functional, read with or without defaults and write both files and directories
* Flexible, create support for formats of your needs
* TypeScript, built in type definitions
* JSDocs, together with TypeScript's type definitions for helpful IntelliSense 
* Promises

### [Documentation](https://aery-chan.github.io/node-module-that-loads-configs/)

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
    .read({ write_if_defaulted: true }); // Write if content is defaulted in any way after reading

console.log(file.content);
```
```
{ ip: "127.0.0.1", port: 1337 }
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

console.log(contents["water.json"]);
console.log(contents["cereal.json"]);
```
```
{ steps: [ "Pour water" ] }
{ steps: [ "Pour cereal FIRST", "THEN pour milk" ] }
```

# Compiling

`npm install --only=dev`   
`npm run-script compile`

# Testing

`npm install --only=dev`   
`npm run-script test`