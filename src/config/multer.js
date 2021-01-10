import multer from 'multer';
import { resolve } from 'path';
import crypto from 'crypto';
import multers3 from 'multer-s3-v2';
import aws from 'aws-sdk';

const path = resolve(__dirname, '..', '..', 'tmp', 'uploads');

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path);
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);

        file.key = `${hash.toString('hex')}-${file.originalname}`;
        cb(null, file.key);
      });
    },
  }),

  s3: multers3({
    s3: new aws.S3(),
    bucket: BUCKET_NAME,
    contentType: multers3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);

        const filename = `${hash.toString('hex')}-${file.originalname}`;
        cb(null, filename);
      });
    },
  }),
};

const config = {
  dest: path,
  storage: storageTypes[process.env.STORAGE_TYPE],
  limits: {
    file: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif'];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type.'));
    }
  },
};

export default config;
