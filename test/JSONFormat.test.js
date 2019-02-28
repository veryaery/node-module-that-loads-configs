const assert = require("assert");

const { JSONFormat } = require("../compiled/formats/JSONFormat.format");

describe("JSONFormat", () => {

    it("Parses string", () => {
        const s = "parse";

        assert.deepEqual((new JSONFormat).read(Buffer.from(JSON.stringify(s))).content, s);
    });

    it("Parses object", () => {
        const o = { parse: "parse" };

        assert.deepEqual((new JSONFormat).read(Buffer.from(JSON.stringify(o))).content, o);
    });

    it("Stringifies string", () => {
        const s = "stringify";

        assert.equal((new JSONFormat).write(s), JSON.stringify(s));
    });

    it("Stringifies object", () => {
        const o = { stringify: "stringify" };

        assert.equal((new JSONFormat).write(o), JSON.stringify(o));
    });

    it("Stringifies object with an indentation of 4", () => {
        const o = { indent: "indent" };

        assert.equal((new JSONFormat(4)).write(o), JSON.stringify(o, null, 4));
    });

    it("Defaults content", () => {
        assert.equal((new JSONFormat()).read(null, "default", null).content, "default");
    });

    it("Defaults property", () => {
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

    it("Ignores recursively defaulting property", () => {
        const o = { x: { foo: "bar" } };
        const def = {
            x: {
                foo: "bar",
                y: "z"
            }
        };

        assert.deepEqual((new JSONFormat).read(Buffer.from(JSON.stringify(o)), def, { default_properties: true }).content, o);
    });

    it("Recursively defaults property", () => {
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

    it("Returns defaulted correctly set to false", () => {
        assert.equal((new JSONFormat).read(Buffer.from(JSON.stringify("false")), "false", null).defaulted, false);
    });

    it("Defaults content and returns defaulted correctly set to true", () => {
        assert.equal((new JSONFormat).read(null, "true", null).defaulted, true);
    });

    it("Doesn't default properties and returns defaulted correctly set to false", () => {
        const o = {
            apa: "bapa",
            foo: "bar"
        };

        assert.equal((new JSONFormat).read(Buffer.from(JSON.stringify(o)), o, { default_properties: true }).defaulted, false);
    });

    it("Defaults one property and returns defaulted correctly set to true", () => {
        const o = {
            apa: "bapa"
        };
        const def = {
            apa: "bapa",
            foo: "bar"
        };

        assert.equal((new JSONFormat).read(Buffer.from(JSON.stringify(o)), def, { default_properties: true }).defaulted, true);
    });

    it("Doesn't recursively default property and returns defaulted correctly set to false", () => {
        const o = {
            x: {
                foo: "bar",
                y: "z"
            }
        };

        assert.equal((new JSONFormat).read(
            Buffer.from(JSON.stringify(o)),
            o,
            {
                default_properties: true,
                recursive: true
            }
        ).defaulted, false);
    });

    it("Recursively defaults one property and returns defaulted correctly set to true", () => {
        const o = { a: { foo: "bar" } };
        const def = {
            a: {
                foo: "bar",
                b: "c"
            }
        };

        assert.equal((new JSONFormat).read(
            Buffer.from(JSON.stringify(o)),
            def,
            {
                default_properties: true,
                recursive: true
            }
        ).defaulted, true);
    });

});