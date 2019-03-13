const path = require("path");
const fs = require("fs");
const assert = require("assert");

const {
    ConfigFile,
    formats
} = require("../compiled/index.js");

const methods = require("./methods.js");

describe("ConfigFile", () => {
    before(async () => await methods.setup());

    it("Calls format's read method", done => {
        const path_1 = path.resolve(methods.temp_path, "1");

        const file = new ConfigFile(path_1, new (class ReadFormat {

            read(data, default_content, default_options) {
                done();
                return { content: null };
            }

            write() { return null; }

        })());

        file.read();
    });

    it("Calls format's write method", done => {
        const path_2 = path.resolve(methods.temp_path, "2");

        const file = new ConfigFile(path_2, new (class WriteFormat {

            read(data, default_content, default_options) {
                return { content: null };
            }

            write() {
                done();
                return null;
            }

        })());

        file.write();
    });

    it("Calls format associated with file extention name", done => {
        const path_3 = path.resolve(methods.temp_path, "3.ext");

        formats.register_format(class ExtentionFormat {

            read(data, default_content, default_options) {
                done();
                return { content: null };
            }

            write() { return null; }

        }, [ "ext" ]);

        const file = new ConfigFile(path_3);

        file.read();
    });

    it("Calls format by default", done => {
        const path_4 = path.resolve(methods.temp_path, "4");
    
        formats.set_default_format(class DefaultFormat {

            read(data, default_content, default_options) {
                done();
                return { content: null };
            }

            write() { return null; }

        });

        const file = new ConfigFile(path_4);

        file.read();
    });

    it("Reads file's content", async () => {
        const path_5 = path.resolve(methods.temp_path, "5");

        fs.writeFileSync(path_5, "read");

        const file = new ConfigFile(path_5, new formats.RawFormat());
        
        await file.read();

        assert.equal(file.content, "read");
    });

    it("Writes ConfigFile's content", async () => {
        const path_6 = path.resolve(methods.temp_path, "6");

        const file = new ConfigFile(path_6, new formats.RawFormat());
        
        file.content = "write";
        await file.write();

        assert.equal(fs.readFileSync(path_6).toString(), "write");
    });

    it("Defaults file's content", async () => {
        const path_7 = path.resolve(methods.temp_path, "7");

        const file = new ConfigFile(path_7, new formats.RawFormat());

        await file
            .defaults("default")
            .read();

        assert.equal(file.content, "default");
    });

    it("Defaults then writes ConfigFile's content", async () => {
        const path_8 = path.resolve(methods.temp_path, "8");

        const file = new ConfigFile(path_8, new formats.RawFormat());

        await file
            .defaults("default")
            .read({ write_if_defaulted: true });

        assert.equal(fs.readFileSync(path_8).toString(), "default");
    });

    it("Creates directory if it doesn't exist when writing ConfigFile's content", async () => {
        const path_directory = path.resolve(methods.temp_path, "directory");
        const path_9 = path.resolve(path_directory, "9");

        const file = new ConfigFile(path_9, new formats.RawFormat());

        file.content = "directory";

        await file.write();

        assert.equal(fs.readFileSync(path_9).toString(), "directory");
    });

    it("Reads file's content and has defaulted correctly set to false", async () => {
        const path_10 = path.resolve(methods.temp_path, "10");

        fs.writeFileSync(path_10, "false");

        const file = new ConfigFile(path_10, new formats.RawFormat());

        await file
            .defaults("false")
            .read();

        assert.equal(file.defaulted, false);
    });

    it("Defaults file's content and has defaulted correctly set to true", async () => {
        const path_11 = path.relative(methods.temp_path, "11");

        const file = new ConfigFile(path_11, new formats.RawFormat());

        await file
            .defaults("true")
            .read();

        assert.equal(file.defaulted, true);
    });

    after(async () => await methods.cleanup());
});