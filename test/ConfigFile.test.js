const fs = require("fs");
const path = require("path");
const assert = require("assert");

const { ConfigFile } = require("../compiled/index.js");

const test_file_path = path.resolve(__dirname, "test");
const default_file_path = path.resolve(__dirname, "default");

const test_directory_path = path.resolve(__dirname, "directory");
const test_directory_file_path = path.resolve(test_directory_path, "test");

describe("ConfigFile", async () => {
    it("should read with content \"read\"", async () => {
        fs.writeFileSync(test_file_path, "read");

        const file = new ConfigFile(test_file_path, "raw");

        assert.equal((await file.read()).content, "read");
    });
    
    it("should write with content \"write\"", async () => {
        const file = new ConfigFile(test_file_path, "raw");

        file.content = "write";
        await file.write();

        assert.equal(fs.readFileSync(test_file_path).toString(), "write");
    });

    it("should read and default content \"default\"", async () => {
        const file = new ConfigFile(path.resolve(__dirname, "default"), "raw");

        await file
            .def("default")
            .read();

        assert.equal(file.content, "default");
    });

    it("should read and write default content \"default\"", async () => {
        const file = new ConfigFile(default_file_path, "raw");

        await file
            .def("default")
            .read({ write_if_defaulted: true });

        assert.equal(file.content, "default");
        assert.equal(fs.readFileSync(default_file_path).toString(), "default");
    });

    it("should create parent directory \"directory\" if it doesn't exist", async () => {
        const file = new ConfigFile(test_directory_file_path, "raw");

        await file.write();

        assert.equal(fs.statSync(test_directory_path).isDirectory(), true);
    });

    after(() => {
        fs.unlinkSync(test_file_path);
        fs.unlinkSync(default_file_path);
        fs.unlinkSync(test_directory_file_path);
        fs.rmdirSync(test_directory_path);
    });
});