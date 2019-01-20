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

    it("Calls custom format's read method", done => {
        const path_empty = path.resolve(methods.temp_path, "empty");

        formats.register_format("read", {
            read: (data, default_content, options, default_options) => {
                done();
                return { content: null };
            }
        });

        const file = new ConfigFile(path_empty, "read");

        file.read();
    });

    it("Calls custom format's write method", done => {
        const path_empty = path.resolve(methods.temp_path, "empty");

        formats.register_format("write", {
            write: (content, options) => {
                done();
                return null;
            }
        });

        const file = new ConfigFile(path_empty, "write");

        file.write();
    });

    it("Calls custom format associated with file extention name \"ext\"", done => {
        const path_extention = path.resolve(methods.temp_path, "extention.ext");

        formats.register_format("extention", {
            read: (data, default_content, options, default_options) => {
                done();
                return { content: null };
            }
        }, [ "ext" ]);

        const file = new ConfigFile(path_extention);

        file.read();
    });

    it("Calls custom format by default", done => {
        const path_empty = path.resolve(methods.temp_path, "empty");
    
        formats.register_format("default", {
            read: (data, default_content, options, default_options) => {
                done();
                return { content: null };
            }
        });
        formats.set_default_format("default");

        const file = new ConfigFile(path_empty);

        file.read();
    });

    it("Reads file #1 with content \"read\"", async () => {
        const path_1 = path.resolve(methods.temp_path, "1");

        fs.writeFileSync(path_1, "read");

        const file = new ConfigFile(path_1, "raw");
        
        await file.read();

        assert.equal(file.content, "read");
    });

    it("Writes file #2 with content \"write\"", async () => {
        const path_2 = path.resolve(methods.temp_path, "2");

        const file = new ConfigFile(path_2, "raw");
        
        file.content = "write";
        await file.write();

        assert.equal(fs.readFileSync(path_2).toString(), "write");
    });

    after(async () => await methods.cleanup());
});