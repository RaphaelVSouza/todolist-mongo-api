import 'dotenv/config.js';

import Queue from './services/queue.js';

Queue.processQueue();

console.log('Queue running');
