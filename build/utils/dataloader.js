"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const aws_sdk_1 = tslib_1.__importDefault(require("aws-sdk"));
const config_1 = tslib_1.__importDefault(require("../config"));
const S3 = new aws_sdk_1.default.S3();
class DataLoader {
    /**
     * Retrieves the tracks from S3
     */
    static listTracks() {
        if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
            throw 'AWS Keys aren\'t set!';
        }
        return new Promise((resolve, reject) => {
            S3.listObjectsV2({
                Prefix: config_1.default.S3_PREFIX,
                Bucket: config_1.default.S3_BUCKET,
                MaxKeys: 1000,
            }, (err, data) => {
                if (err || !data.Contents) {
                    return reject(err);
                }
                const tracks = data.Contents.filter((item) => {
                    if (!item.Key) {
                        return false;
                    }
                    return item.Key.endsWith('.mp3');
                }).map((item) => {
                    return {
                        url: config_1.default.S3_URL_PREFIX + item.Key,
                        id: item.Key.replace(config_1.default.S3_PREFIX, '').replace('.mp3', ''),
                    };
                });
                resolve(tracks);
            });
        });
    }
}
exports.DataLoader = DataLoader;
