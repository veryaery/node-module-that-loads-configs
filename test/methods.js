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

function is_directory(file_path) {
    return new Promise((resolve, reject) => {
        fs.stat(file_path, (error, stats) => {
            if (error) {
                reject(error);
            } else {
                resolve(stats.isDirectory());
            }
        });
    });
}

async function rmdir(directory_path) {
    return new Promise(async (resolve, reject) => {
        fs.readdir(directory_path, async (error, files) => {
            if (error) {
                reject(error);
            } else {
                for (const file of files) {
                    const file_path = path.resolve(directory_path, file);

                    if (await is_directory(file_path)) {
                        await rmdir(file_path);
                    } else {
                        await unlink(file_path);
                    }
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

function cleanup() {
    return rmdir(temp_path);
}

exports.temp_path = temp_path;
exports.setup = setup;
exports.cleanup = cleanup;