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

    it("Reads files' content", async () => {
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

    it("Writes ConfigDirectory's ConfigFiles' content", async () => {
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

    it("Defaults files' content", async () => {
        const path_directory_3 = path.resolve(methods.temp_path, "3");

        const directory = new ConfigDirectory(path_directory_3, new formats.RawFormat());

        await directory
            .defaults({
                "1": "foo",
                "2": "bar"
            })
            .read();

        assert.equal(directory.files["1"].content, "foo");
        assert.equal(directory.files["2"].content, "bar");
    });

    it("Defaults then writes ConfigDirectory's ConfigFiles' content", async () => {
        const path_directory_4 = path.resolve(methods.temp_path, "4");

        const directory = new ConfigDirectory(path_directory_4, new formats.RawFormat());

        await directory
            .defaults({
                "1": "foo",
                "2": "bar"
            })
            .read({ write_if_defaulted: true });

        assert.equal(fs.readFileSync(path.resolve(path_directory_4, "1")).toString(), "foo");
        assert.equal(fs.readFileSync(path.resolve(path_directory_4, "2")).toString(), "bar");
    });

    it("Exclusively reads default file and ingores non-default file", async () => {
        const path_directory_5 = path.resolve(methods.temp_path, "5");
        const path_include = path.resolve(path_directory_5, "include");
        const path_exclude = path.resolve(path_directory_5, "exclude");

        fs.mkdirSync(path_directory_5);
        fs.writeFileSync(path_include, "include");
        fs.writeFileSync(path_exclude, "exclude");

        const directory = new ConfigDirectory(path_directory_5, new formats.RawFormat());

        await directory
            .defaults({ "include": "include" })
            .read({ only_read_defaults: true });

        assert.equal(directory.files["include"].content, "include");
        assert.equal(directory.files["exclude"], undefined);
    });

    it("Ignores recursively reading directory", async () => {
        const path_directory_6 = path.resolve(methods.temp_path, "6");
        const path_ignore = path.resolve(path_directory_6, "ignore");

        fs.mkdirSync(path_directory_6);
        fs.mkdirSync(path_ignore);

        const directory = new ConfigDirectory(path_directory_6, new formats.RawFormat());

        await directory.read();

        assert.equal(directory.files["ignore"], undefined);
    });

    it("Reads directory and ignores reading it's directory", async () => {
        const path_directory_8 = path.resolve(methods.temp_path, "8");
        const path_read = path.resolve(path_directory_8, "read");
        const path_ignore = path.resolve(path_read, "ignore");

        fs.mkdirSync(path_directory_8);
        fs.mkdirSync(path_read);
        fs.mkdirSync(path_ignore);

        const directory = new ConfigDirectory(path_directory_8, new formats.RawFormat());

        await directory.read({ read_directories: true });

        assert.deepEqual(directory.files["read"].files["ignore"], new ConfigDirectory(path_ignore, directory.format));
    });

    it("Recursively reads directory and it's directory and it's file", async () => {
        const path_directory_9 = path.resolve(methods.temp_path, "9");
        const path_first = path.resolve(path_directory_9, "first");
        const path_second = path.resolve(path_first, "second");
        const path_recursive = path.resolve(path_second, "recursive");

        fs.mkdirSync(path_directory_9);
        fs.mkdirSync(path_first);
        fs.mkdirSync(path_second);
        fs.writeFileSync(path_recursive, "recursive");

        const directory = new ConfigDirectory(path_directory_9, new formats.RawFormat());

        await directory.read({
            read_directories: true,
            recursive: true
        });

        assert.equal(directory.files["first"].files["second"].files["recursive"].content, "recursive");
    });

    it("Reads files' content and has defaulted correctly set to false", async () => {
        const path_directory_10 = path.resolve(methods.temp_path, "10");
        const path_1 = path.resolve(path_directory_10, "1");
        const path_2 = path.resolve(path_directory_10, "2");

        fs.mkdirSync(path_directory_10);
        fs.writeFileSync(path_1, "foo");
        fs.writeFileSync(path_2, "bar");

        const directory = new ConfigDirectory(path_directory_10, new formats.RawFormat());

        await directory
            .defaults({
                "1": "foo",
                "2": "bar"
            })
            .read();

        assert.equal(directory.defaulted, false);
    });

    it("Defaults one file's content and has defaulted correctly set to true", async () => {
        const path_directory_11 = path.resolve(methods.temp_path, "11");
        const path_false = path.resolve(path_directory_11, "false");

        fs.mkdirSync(path_directory_11);
        fs.writeFileSync(path_false, "false");

        const directory = new ConfigDirectory(path_directory_11, new formats.RawFormat());

        await directory
            .defaults({
                "false": "false",
                "true": "true"
            })
            .read();

        assert.equal(directory.defaulted, true);
    });

    after(async () => await methods.cleanup());
    
});