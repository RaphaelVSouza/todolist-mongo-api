import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';


function accessLog() {
  //const __dirname = path.dirname(fileURLToPath(import.meta.url));
         // create a write stream (in append mode)
let accessLogStream = fs.createWriteStream(path.join(__dirname,'..', '..', 'logs', 'access.log'), { flags: 'a' })
return accessLogStream;
}

export default accessLog;
