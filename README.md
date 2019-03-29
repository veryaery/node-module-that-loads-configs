![](https://i.imgur.com/2tDOn1l.png)
(Character: Tohru from Miss Kobayashi's Dragon Maid)

[![](https://img.shields.io/npm/v/@aery/mlc.svg?colorB=%23C5383B&style=flat-square)](https://www.npmjs.com/package/@aery/mlc)

A better way to load your configuration files

### Motivation

I needed a module to save me from having to write the same snippets of code in every project that required a config.
There already existed many modules that drastically reduced the amount of code I would have had to write.
But I often still found myself in very simmilar situations: Like writing snippets to generate default configs.
Not to mention anyting to do with directories.
So that's why I made this neat little module. I hope you are able to get a simmilar amount of value from it as I

### Features

* Simple, load your configs with a single line of code
* Powerful, read and write both files and directories with defaults
* Flexible, create support for formats of your needs
* TypeScript, pre-packaged type definitions
* JSDocs, together with TS type definitions enables helpful code completion in modern IDEs

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

# Compiling

`npm install --only=dev`   
`npm run-script compile`

# Testing

`npm install --only=dev`   
`npm run-script test`