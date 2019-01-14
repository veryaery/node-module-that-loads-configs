const fs = require("fs");
const path = require("path");
const assert = require("assert");

const { ConfigFile } = require("../compiled/index.js");

const test_file_path = path.resolve(__dirname, "test");

describe("json.format", () => {
    it("should read json object { read: \"read\" }", async () => {
        fs.writeFileSync(test_file_path, JSON.stringify({ read: "read" }));

        const file = new ConfigFile(test_file_path, "json");

        assert.equal((await file.read()).content.read, "read");
    });

    it("should write json object { write: \"write\" }", async () => {
        const file = new ConfigFile(test_file_path, "json");

        file.content = { write: "write" };
        await file.write();

        assert.equal(JSON.parse(fs.readFileSync(test_file_path).toString()).write, "write");
    });

    it("should default property \"foo\" to \"bar\"", async () => {
        fs.writeFileSync(test_file_path, JSON.stringify({ apa: "bapa" }));

        const file = new ConfigFile(test_file_path, "json");

        await file
            .def({
                foo: "bar",
                apa: "bapa"
            }, { default_properties: true })
            .read();

        assert.equal(file.content.foo, "bar");
    });

    it("should recursively default property \"a.b\" to \"c\"", async () => {
        fs.writeFileSync(test_file_path, JSON.stringify({ x: { y: "z" } }));

        const file = new ConfigFile(test_file_path, "json");

        await file
            .def({
                a: { b: "c" },
                x: { y: "z" }
            }, {
                default_properties: true,
                recursive: true
            })
            .read();

        assert.equal(file.content.a.b, "c");
    });

    it("should read json array [ \"foo\", \"bar\" ]", async () => {
        fs.writeFileSync(test_file_path, JSON.stringify([ "foo", "bar" ]));

        const file = new ConfigFile(test_file_path, "json");

        assert.deepEqual((await file.read()).content, [ "foo", "bar" ]);
    });

    it("should write json array [ \"apa\", \"bapa\" ]", async () => {
        const file = new ConfigFile(test_file_path, "json");

        file.content = [ "apa", "bapa" ];
        await file.write();

        assert.deepEqual(JSON.parse(fs.readFileSync(test_file_path).toString()), [ "apa", "bapa" ]);
    });

    after(() => {
        fs.unlinkSync(test_file_path);
    });
});