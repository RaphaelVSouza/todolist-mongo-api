import Bee from 'bee-queue'
import redisConfig from '../config/redis'

import VerifyMail from './jobs/VerifyMail'
import ChangePassMail from './jobs/ChangePassMail'

const jobs = [VerifyMail, ChangePassMail]
class Queue {
  private queues: any

  constructor() {
    this.queues = {}

    this.init()
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      if (!redisConfig.host || !redisConfig.port) {
        new Error('Redis host and port must be passed')
        return
      }

      this.queues[key] = {
        bee: new Bee(key, {
          redis: {
            host: redisConfig.host,
            port: +redisConfig.port,
            password: redisConfig.password
          }
        }),
        handle
      }
    })
  }

  add(queue: any, job: any) {
    return this.queues[queue].bee.createJob(job).save()
  }

  processQueue() {
    jobs.forEach((job) => {
      const { bee, handle } = this.queues[job.key]
      bee.on('failed', this.handleFailure).process(handle)
    })
  }

  handleFailure(job: any, err: any) {
    console.log(`Queue ${job.queue.name}: FAILED`, err)
  }
}

export default new Queue()
