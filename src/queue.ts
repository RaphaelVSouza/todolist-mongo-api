import 'dotenv/config'

import Queue from './app/subscriber/queue'

Queue.processQueue() // Start Queue process

console.log('Queue running')
