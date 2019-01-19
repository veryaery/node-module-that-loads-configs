const fs = require("fs");
const path = require("path");
const assert = require("assert");

const {
    ConfigDirectory,
    ConfigFile
} = require("../compiled/index.js");

const test_directory_path = path.resolve(__dirname, "test");
const foo_test_file_path = path.resolve(test_directory_path, "foo");
const bar_test_file_path = path.resolve(test_directory_path, "bar");

const apa_test_file_path = path.resolve(test_directory_path, "apa");
const bapa_test_file_path = path.resolve(test_directory_path, "bapa");

const included_test_file_path = path.resolve(test_directory_path, "included");
const excluded_test_file_path = path.resolve(test_directory_path, "excluded");

describe("ConfigDirectory", () => {
    before(() => {
        fs.mkdirSync(test_directory_path);
    });

    it("should read files \"foo\" and \"bar\" with contents \"foo\" and \"bar\"", async () => {
        fs.writeFileSync(foo_test_file_path, "foo");
        fs.writeFileSync(bar_test_file_path, "bar");

        const directory = new ConfigDirectory(test_directory_path, "raw");

        await directory.read();

        assert.equal(directory.files["foo"].content, "foo");
        assert.equal(directory.files["bar"].content, "bar");
    });

    it("should write files \"foo\" and \"bar\" with contents \"apa\" and \"bapa\"", async () => {
        const directory = new ConfigDirectory(test_directory_path, "raw");

        directory.files = {
            "foo": (() => {
                const file = new ConfigFile(foo_test_file_path, "raw");
                file.content = "apa";
                return file;
            })(),
            "bar": (() => {
                const file = new ConfigFile(bar_test_file_path, "raw");
                file.content = "bapa";
                return file;
            })()
        };

        await directory.write();

        assert.equal(fs.readFileSync(foo_test_file_path).toString(), "apa");
        assert.equal(fs.readFileSync(bar_test_file_path).toString(), "bapa");
    });

    it("should read files \"apa\" and \"bapa\" and default contents \"apa\" and \"bapa\"", async () => {
        const directory = new ConfigDirectory(test_directory_path, "raw");

        await directory
            .def({
                "apa": "apa",
                "bapa": "bapa"
            })
            .read();

        assert.equal(directory.files["apa"].content, "apa");
        assert.equal(directory.files["bapa"].content, "bapa");
    });

    it("should read files \"apa\" and \"bapa\" and write default contents \"apa\" and \"bapa\"", async () => {
        const directory = new ConfigDirectory(test_directory_path, "raw");

        await directory
            .def({
                "apa": "apa",
                "bapa": "bapa"
            })
            .read({ write_if_defaulted: true });
        
        assert.equal(fs.readFileSync(apa_test_file_path).toString(), "apa");
        assert.equal(fs.readFileSync(bapa_test_file_path).toString(), "bapa");
    });

    it("should read default file \"included\" with content \"included\" and exclude non-default file \"excluded\"", async () => {
        fs.writeFileSync(included_test_file_path, "included");
        fs.writeFileSync(excluded_test_file_path, "excluded");

        const directory = new ConfigDirectory(test_directory_path, "raw");

        await directory
            .def({ "included": "included" })
            .read({ only_read_defaults: true });

        assert.equal(directory.files["included"].content, "included");
        assert.equal(directory.files["excluded"], undefined);
    });

    after(() => {
        fs.unlinkSync(foo_test_file_path);
        fs.unlinkSync(bar_test_file_path);
        fs.unlinkSync(apa_test_file_path);
        fs.unlinkSync(bapa_test_file_path);
        fs.unlinkSync(included_test_file_path);
        fs.unlinkSync(excluded_test_file_path);
        fs.rmdirSync(test_directory_path);
    });
});