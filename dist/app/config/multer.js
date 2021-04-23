"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = require("path");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const multer_s3_v2_1 = __importDefault(require("multer-s3-v2"));
const crypto_1 = __importDefault(require("crypto"));
const { STORAGE_TYPE, AWS_BUCKET_NAME } = process.env;
const path = path_1.resolve(__dirname, '..', '..', '..', 'tmp', 'uploads');
const allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif'];
const allowedStorageTypes = ['local', 's3'];
if (typeof STORAGE_TYPE !== 'string')
    throw Error('Storage Type must be passed');
if (!allowedStorageTypes.includes(STORAGE_TYPE))
    throw Error(`Storage Type [${STORAGE_TYPE}] not suported`);
const storageTypes = {
    local: multer_1.default.diskStorage({
        destination: (request, file, callback) => {
            callback(null, path);
        },
        filename: (request, file, callback) => {
            crypto_1.default.randomBytes(16, (error, hash) => {
                if (error)
                    callback(error);
                const filename = `${hash.toString('hex')}-${file.originalname}`;
                callback(null, filename);
            });
        },
    }),
    s3: multer_s3_v2_1.default({
        s3: new aws_sdk_1.default.S3(),
        bucket: AWS_BUCKET_NAME,
        contentType: multer_s3_v2_1.default.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (request, file, callback) => {
            crypto_1.default.randomBytes(16, (error, hash) => {
                if (error)
                    callback(error);
                const fileName = `${hash.toString('hex')}-${file.originalname}`;
                callback(null, fileName);
            });
        },
    }),
};
const config = {
    dest: path,
    storage: storageTypes[STORAGE_TYPE],
    limits: {
        files: 2 * 1024 * 1024,
    },
    fileFilter: (request, file, callback) => {
        if (allowedMimes.includes(file.mimetype)) {
            callback(null, true);
        }
        else {
            callback(new Error('Invalid file type.'));
        }
    },
};
exports.default = config;
