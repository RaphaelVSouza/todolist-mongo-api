import fs from 'fs'
import path from 'path'

function writeAccessLog () {
  const accessLogStream = fs.createWriteStream(
    path.join(__dirname, '..', '..', 'logs', 'access.log'),
    { flags: 'a' }
  )
  return accessLogStream
}

export { writeAccessLog }
