const assert = require("assert");

const { JSONFormat } = require("../compiled/formats/JSONFormat.format");

describe("JSONFormat", () => {

    it("Parses string \"parse\"", async () => {
        const s = "parse";

        assert.deepEqual((new JSONFormat).read(Buffer.from(JSON.stringify(s))).content, s);
    });

    it("Parses object { parse: \"parse\" }", async () => {
        const o = { parse: "parse" };

        assert.deepEqual((new JSONFormat).read(Buffer.from(JSON.stringify(o))).content, o);
    });

    it("Stringifies string \"stringify\"", async () => {
        const s = "stringify";

        assert.equal((new JSONFormat).write(s), JSON.stringify(s));
    });

    it("Stringifies object { stringify: \"stringify\" }", async () => {
        const o = { stringify: "stringify" };

        assert.equal((new JSONFormat).write(o), JSON.stringify(o));
    });

    it("Stringifies object { indent: \"indent\" } with an indentation of 4", async () => {
        const o = { indent: "indent" };

        assert.equal((new JSONFormat(4)).write(o), JSON.stringify(o, null, 4));
    });

    it("Defaults content to \"default\"", async () => {
        assert.equal((new JSONFormat()).read(null, "default", null).content, "default");
    });

    it("Defaults object { apa: \"bapa\" } property \"foo\" to \"bar\"", async () => {
        const o = { apa: "bapa" };
        const def = {
            apa: "bapa",
            foo: "bar"
        };

        assert.deepEqual((new JSONFormat).read(
            Buffer.from(JSON.stringify(o)),
            def,
            { default_properties: true }
        ).content, def);
    });

    it("Ignores defaulting object { x: { foo: \"bar\" } } property x.y", async () => {
        const o = { x: { foo: "bar" } };
        const def = {
            x: {
                foo: "bar",
                y: "z"
            }
        };

        assert.deepEqual((new JSONFormat).read(Buffer.from(JSON.stringify(o)), def, { default_properties: true }).content, o);
    });

    it("Recursively defaults object { a: { foo: \"bar\" } } property a.b to \"c\"", async () => {
        const o = { a: { foo: "bar" } };
        const def = {
            a: {
                foo: "bar",
                b: "c"
            }
        };

        assert.deepEqual((new JSONFormat).read(
            Buffer.from(JSON.stringify(o)),
            def,
            {
                default_properties: true,
                recursive: true
            }
        ).content, def);
    });

});