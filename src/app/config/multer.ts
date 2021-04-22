import multer from 'multer'
import { resolve } from 'path'
import aws from 'aws-sdk'
import multers3 from 'multer-s3-v2'
import crypto from 'crypto'
import { Request } from 'express';

const { STORAGE_TYPE, AWS_BUCKET_NAME } = process.env

const path = resolve(__dirname, '..', '..', '..', 'tmp', 'uploads')

const allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif']
const allowedStorageTypes = ['local', 's3']

if (typeof STORAGE_TYPE !== 'string') throw Error('Storage Type must be passed')
if (!allowedStorageTypes.includes(STORAGE_TYPE))
    throw Error(`Storage Type [${STORAGE_TYPE}] not suported`)

const storageTypes = {
    local: multer.diskStorage({
        destination: (request: Request, file: Express.Multer.File, callback: Function) => {
            callback(null, path)
        },
        filename: (request: Request, file: Express.Multer.File, callback: Function) => {
            crypto.randomBytes(16, (error: Error, hash) => {
                if (error) callback(error)

                const filename = `${hash.toString('hex')}-${file.originalname}`
                callback(null, filename)
            })
        },
    }),

    s3: multers3({
      s3: new aws.S3(),
      bucket: AWS_BUCKET_NAME,
      contentType: multers3.AUTO_CONTENT_TYPE,
      acl: 'public-read',
      key: (request: Request, file: Express.Multer.File, callback: Function) => {
          crypto.randomBytes(16, (error: Error, hash) => {
              if (error) callback(error)

              const fileName = `${hash.toString('hex')}-${file.originalname}`
              callback(null, fileName)
          })
      },
  }),
} as unknown;

const config = {
    dest: path,
    storage: storageTypes[STORAGE_TYPE],
    limits: {
        files: 2 * 1024 * 1024,
    },
    fileFilter: (request: Request, file: Express.Multer.File, callback: Function) => {
        if (allowedMimes.includes(file.mimetype)) {
            callback(null, true)
        } else {
            callback(new Error('Invalid file type.'))
        }
    },
}

export default config
