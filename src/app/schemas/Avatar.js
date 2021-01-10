import mongoose from 'mongoose';
import aws from 'aws-sdk';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const s3 = new aws.S3();

const AvatarSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  key: {
    type: String,
    required: true,
  },
  url: {
    type: String,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

AvatarSchema.pre('save', function () {
  const LOCAL_API_URL = `${process.env.SERVER_HOST}${process.env.PORT}`;
  console.log(this.url);
  console.log(this.key);
  if (!this.url) {
    this.url = `${LOCAL_API_URL}/files/${this.key}`;
  }
});

AvatarSchema.pre('remove', async function (next) {
  if (this.key) {
    if (process.env.STORAGE_TYPE === 's3') {
      await s3
        .deleteObject({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: this.key,
        })
        .promise();
    } else {
      await promisify(fs.unlink)(
        path.resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', this.key),
      );
    }
  }
  next();
});

const Avatar = mongoose.model('Avatar', AvatarSchema);

export default Avatar;
