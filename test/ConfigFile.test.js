const path = require("path");
const fs = require("fs");
const assert = require("assert");

const {
    ConfigFile,
    Format,
    formats
} = require("../compiled/index.js");

const methods = require("./methods.js");

describe("ConfigFile", () => {
    before(async () => await methods.setup());

    it("Calls custom format's read method", done => {
        const path_1 = path.resolve(methods.temp_path, "1");

        const file = new ConfigFile(path_1, new (class ReadFormat extends Format {

            read(data, default_content, default_options) {
                done();
                return { content: null };
            }

            write() { return null; }

        })());

        file.read();
    });

    it("Calls custom format's write method", done => {
        const path_2 = path.resolve(methods.temp_path, "2");

        const file = new ConfigFile(path_2, new (class WriteFormat extends Format {

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

    it("Calls custom format associated with file extention name \"ext\"", done => {
        const path_3 = path.resolve(methods.temp_path, "3.ext");

        formats.register_format(class ExtentionFormat extends Format {

            read(data, default_content, default_options) {
                done();
                return { content: null };
            }

            write() { return null; }

        }, [ "ext" ]);

        const file = new ConfigFile(path_3);

        file.read();
    });

    it("Calls custom format by default", done => {
        const path_4 = path.resolve(methods.temp_path, "4");
    
        formats.set_default_format(class DefaultFormat extends Format {

            read(data, default_content, default_options) {
                done();
                return { content: null };
            }

            write() { return null; }

        });

        const file = new ConfigFile(path_4);

        file.read();
    });

    it("Reads file #5 with content \"read\"", async () => {
        const path_5 = path.resolve(methods.temp_path, "5");

        fs.writeFileSync(path_5, "read");

        const file = new ConfigFile(path_5, new formats.formats.RawFormat());
        
        await file.read();

        assert.equal(file.content, "read");
    });

    it("Writes file #6 with content \"write\"", async () => {
        const path_6 = path.resolve(methods.temp_path, "6");

        const file = new ConfigFile(path_6, new formats.formats.RawFormat());
        
        file.content = "write";
        await file.write();

        assert.equal(fs.readFileSync(path_6).toString(), "write");
    });

    it("Defaults file #7's content to \"default\"", async () => {
        const path_7 = path.resolve(methods.temp_path, "7");

        const file = new ConfigFile(path_7, new formats.formats.RawFormat());

        await file
            .def("default")
            .read();

        assert.equal(file.content, "default");
    });

    it("Defaults then writes file #8 with content \"default\"", async () => {
        const path_8 = path.resolve(methods.temp_path, "8");

        const file = new ConfigFile(path_8, new formats.formats.RawFormat());

        await file
            .def("default")
            .read({ write_if_defaulted: true });

        assert.equal(fs.readFileSync(path_8).toString(), "default");
    });

    it("Creates directory #1 if it doesn't exist while writing file #9", async () => {
        
    });

    after(async () => await methods.cleanup());
});