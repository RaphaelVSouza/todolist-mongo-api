import 'dotenv/config.js';

import Queue from './lib/queue.js';

Queue.processQueue();

console.log('Queue running')