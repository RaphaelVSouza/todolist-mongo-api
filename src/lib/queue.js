import Bee from 'bee-queue';
import redisConfig from '../config/redis.js';

import VerifyMail from '../app/jobs/VerifyMail.js';
import ChangePassMail from '../app/jobs/ChangePassMail.js';

const jobs = [VerifyMail, ChangePassMail];

class Queue {
    
    constructor() {
        this.queues = {};

        this.init();
    }

    init() {
        jobs.forEach(({ key, handle }) => {
            this.queues[key] = {
              bee: new Bee(key, {
                removeOnSuccess: true,
                redis: redisConfig,
              }),
              handle,
            };
          });
    }

    add(queue, job) {
       return this.queues[queue].bee.createJob(job).save();
       
    }

    processQueue() {
        jobs.forEach(job => {
          const { bee, handle } = this.queues[job.key];
          bee.process(handle);
          bee.on('failed', (job, err) => {
            console.log(`Queue ${bee.name} FAILED \n`, err);
          })
          
        });
      }
}

export default new Queue();
