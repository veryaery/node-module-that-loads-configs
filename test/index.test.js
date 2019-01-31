const path = require("path");
const assert = require("assert");

const mtlc = require("../compiled/index.js");

describe("index", () => {

    describe("file", () => {

        it("Creates ConfigFile relative to process.cwd()", async () => {
            const relative_path = "file";

            assert.equal(mtlc.file(relative_path).file_path, path.resolve(process.cwd(), relative_path));
        });

    });

    describe("directory", () => {

        it("Creates ConfigDirectory relative to process.cwd()", async () => {
            const relative_path = "directory";

            assert.equal(mtlc.directory(relative_path).directory_path, path.resolve(process.cwd(), relative_path));
        });

    });

});