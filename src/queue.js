require('dotenv').config();

const Queue = require('./lib/queue');

Queue.processQueue();

console.log('Queue running')