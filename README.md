![](https://i.imgur.com/LBPzwco.png)
(Character: "Tohru" from "Miss Kobayashi's Dragon Maid")

[![](https://img.shields.io/npm/v/mtlc.svg?colorB=%23C5383B&style=flat-square)](https://www.npmjs.com/package/mtlc)

# Examples

### Reading a raw text file
```ts
const file: mltc.ConfigFile = await mtlc.file("raw.txt") // Defaults to "raw" format by default
    .read();

console.log(file.content);
```
<pre><code><i>Contents of "raw.txt"</i></code></pre>

### Reading a JSON file
```ts
const file: mltc.ConfigFile = await mtlc.file("config.json") // Associates json files with "json" format by default
    .def({
        ip: "127.0.0.1",
        port: 1337
    }) // What the content should default to
    .read({ write_if_defaulted: true }); // Write file if the content is in any way defaulted

console.log(file.content);
```
<pre><code><i>Contents of "config.json" | </i>{ ip: "127.0.0.1", port: 1337 }</code></pre>

# Compiling

`npm install --only=dev`   
`npm run-script compile`

# Testing

`npm install --only=dev`   
`npm run-script test`