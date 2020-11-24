import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

       // create a write stream (in append mode)
let accessLogStream = fs.createWriteStream(path.join(__dirname,'..', '..', 'logs', 'access.log'), { flags: 'a' })
 

export default accessLogStream;