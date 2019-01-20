const path = require("path");
const fs = require("fs");

const temp_path = path.resolve(__dirname, "temp");

function unlink(file_path) {
    return new Promise((resolve, reject) => {
        fs.unlink(file_path, error => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

async function setup() {
    return new Promise(async (resolve, reject) => {
        fs.access(temp_path, async error => {
            if (!error) {
                await cleanup();
            }

            fs.mkdir(temp_path, error => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    });
}

async function cleanup() {
    return new Promise(async (resolve, reject) => {
        fs.readdir(temp_path, async (error, files) => {
            if (error) {
                reject(error);
            } else {
                for (const file of files) {
                    await unlink(path.resolve(temp_path, file));
                }

                fs.rmdir(temp_path, error => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            }
        });
    });
}

exports.temp_path = temp_path;
exports.setup = setup;
exports.cleanup = cleanup;