![](https://i.imgur.com/LBPzwco.png)
(Character: *Tohru* from *Miss Kobayashi's Dragon Maid*)

[![](https://img.shields.io/npm/v/mtlc.svg?colorB=%23C5383B&style=flat-square)](https://www.npmjs.com/package/mtlc)

Reading a raw text file example:
```ts
const file: mltc.ConfigFile = await mtlc.file("raw.txt") // Defaults to "raw" format by default
    .read();

console.log(file.content);
```
<pre><code><i>File content</i></code></pre>

# Compiling

`npm install --only=dev`   
`npm run-script compile`

# Testing

`npm install --only=dev`   
`npm run-script test`