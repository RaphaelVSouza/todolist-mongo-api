import fs from 'fs';
import path from 'path';

function accessLog() {
  // const __dirname = path.dirname(fileURLToPath(import.meta.url));
  // create a write stream (in append mode)
  const accessLogStream = fs.createWriteStream(
    path.join(__dirname, '..', '..', 'logs', 'access.log'),
    { flags: 'a' },
  );
  return accessLogStream;
}

export default accessLog;
