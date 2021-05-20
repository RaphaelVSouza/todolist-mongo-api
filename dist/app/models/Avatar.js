"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Avatar = void 0;
const mongoose_1 = require("mongoose");
const aws_sdk_1 = require("aws-sdk");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
const s3 = new aws_sdk_1.S3();
const AvatarSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: false
    },
    size: {
        type: Number,
        required: false
    },
    key: {
        type: String,
        required: false
    },
    url: {
        type: String,
        required: false
    },
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});
AvatarSchema.pre('save', function (next) {
    if (!this.url && this.key) {
        const LOCAL_API_URL = `${process.env.SERVER_HOST}${process.env.PORT}`;
        this.url = `${LOCAL_API_URL}/files/${this.key}`;
    }
    next();
});
AvatarSchema.pre('remove', async function (next) {
    if (process.env.STORAGE_TYPE === 's3') {
        return s3
            .deleteObject({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: this.key
        })
            .promise()
            .then((response) => {
            console.log(response);
        })
            .catch((response) => {
            console.log(response.status);
        });
    }
    else {
        console.log(this);
        return util_1.promisify(fs_1.default.unlink)(path_1.default.resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', this.key));
    }
});
const Avatar = mongoose_1.model('Avatar', AvatarSchema);
exports.Avatar = Avatar;
