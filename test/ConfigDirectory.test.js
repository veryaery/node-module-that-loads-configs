const path = require("path");
const fs = require("fs");
const assert = require("assert");

const {
    ConfigFile,
    ConfigDirectory,
    formats
} = require("../compiled/index.js");

const methods = require("./methods.js");

describe("ConfigDirectory", () => {
    
    before(async () => await methods.setup());

    it("Reads with files #1 & #2 with contents \"foo\" & \"bar\"", async () => {
        const path_directory_1 = path.resolve(methods.temp_path, "1");
        const path_1 = path.resolve(path_directory_1, "1");
        const path_2 = path.resolve(path_directory_1, "2");

        fs.mkdirSync(path_directory_1);
        fs.writeFileSync(path_1, "foo");
        fs.writeFileSync(path_2, "bar");

        const directory = new ConfigDirectory(path_directory_1, new formats.RawFormat());

        await directory.read();

        assert.equal(directory.files["1"].content, "foo");
        assert.equal(directory.files["2"].content, "bar");
    });

    it("Writes with files #1 & #2 with contents \"foo\" & \"bar\"", async () => {
        const path_directory_2 = path.resolve(methods.temp_path, "2");
        const path_1 = path.resolve(path_directory_2, "1");
        const path_2 = path.resolve(path_directory_2, "2");

        const directory = new ConfigDirectory(path_directory_2, new formats.RawFormat());

        directory.files = {
            "1": (() => {
                const file = new ConfigFile(path_1, new formats.RawFormat());
                file.content = "foo";
                return file;
             })(),
            "2": (() => {
                const file = new ConfigFile(path_2, new formats.RawFormat());
                file.content = "bar";
                return file;
            })()
        };

        await directory.write();

        assert.equal(fs.readFileSync(path_1).toString(), "foo");
        assert.equal(fs.readFileSync(path_2).toString(), "bar");
    });

    it("Defaults files #1 & #2 contents to \"foo\" & \"bar\"", async () => {
        const path_directory_3 = path.resolve(methods.temp_path, "3");

        const directory = new ConfigDirectory(path_directory_3, new formats.RawFormat());

        await directory
            .def({
                "1": "foo",
                "2": "bar"
            })
            .read();

        assert.equal(directory.files["1"].content, "foo");
        assert.equal(directory.files["2"].content, "bar");
    });

    it("Defaults then writes files #1 & #2 with contents \"foo\" & \"bar\"", async () => {
        const path_directory_4 = path.resolve(methods.temp_path, "4");

        const directory = new ConfigDirectory(path_directory_4, new formats.RawFormat());

        await directory
            .def({
                "1": "foo",
                "2": "bar"
            })
            .read({ write_if_defaulted: true });

        assert.equal(fs.readFileSync(path.resolve(path_directory_4, "1")).toString(), "foo");
        assert.equal(fs.readFileSync(path.resolve(path_directory_4, "2")).toString(), "bar");
    });

    it("Exclusively reads default file \"include\" and ignores file \"exclude\"", async () => {
        const path_directory_5 = path.resolve(methods.temp_path, "5");
        const path_include = path.resolve(path_directory_5, "include");
        const path_exclude = path.resolve(path_directory_5, "exclude");

        fs.mkdirSync(path_directory_5);
        fs.writeFileSync(path_include, "include");
        fs.writeFileSync(path_exclude, "exclude");

        const directory = new ConfigDirectory(path_directory_5, new formats.RawFormat());

        await directory
            .def({ "include": "include" })
            .read({ only_read_defaults: true });

        assert.equal(directory.files["include"].content, "include");
        assert.equal(directory.files["exclude"], undefined);
    });

    it("Ignores directory \"directory\"", async () => {
        const path_directory_6 = path.resolve(methods.temp_path, "6");
        const path_directory = path.resolve(path_directory_6, "directory");

        fs.mkdirSync(path_directory_6);
        fs.mkdirSync(path_directory);

        const directory = new ConfigDirectory(path_directory_6, new formats.RawFormat());

        await directory.read();

        assert.equal(directory.files["directory"], undefined);
    });

    it("Creates ConfigDirectory \"directory\"", async () => {
        const path_directory_7 = path.resolve(methods.temp_path, "7");
        const path_directory = path.resolve(path_directory_7, "directory");

        fs.mkdirSync(path_directory_7);
        fs.mkdirSync(path_directory);

        const directory = new ConfigDirectory(path_directory_7, new formats.RawFormat());

        await directory.read({ read_directories: true });

        assert.equal(directory.files["directory"] instanceof ConfigDirectory, true);
    });

    it("Recursively reads directory \"first\" and it's directory \"second\" and it's file \"recursive\" with content \"recursive\"", async () => {
        const path_directory_8 = path.resolve(methods.temp_path, "8");
        const path_first = path.resolve(path_directory_8, "first");
        const path_second = path.resolve(path_first, "second");
        const path_recursive = path.resolve(path_second, "recursive");

        fs.mkdirSync(path_directory_8);
        fs.mkdirSync(path_first);
        fs.mkdirSync(path_second);
        fs.writeFileSync(path_recursive, "recursive");

        const directory = new ConfigDirectory(path_directory_8, new formats.RawFormat());

        await directory.read({
            read_directories: true,
            recursive: true
        });

        assert.equal(directory.files["first"].files["second"].files["recursive"].content, "recursive");
    });

    after(async () => await methods.cleanup());
    
});