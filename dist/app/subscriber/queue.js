"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bee_queue_1 = __importDefault(require("bee-queue"));
const redis_1 = __importDefault(require("../config/redis"));
const VerifyMail_1 = __importDefault(require("./jobs/VerifyMail"));
const ChangePassMail_1 = __importDefault(require("./jobs/ChangePassMail"));
const jobs = [VerifyMail_1.default, ChangePassMail_1.default];
class Queue {
    constructor() {
        this.queues = {};
        this.init();
    }
    init() {
        jobs.forEach(({ key, handle }) => {
            if (!redis_1.default.host || !redis_1.default.port) {
                new Error('Redis host and port must be passed');
                return;
            }
            this.queues[key] = {
                bee: new bee_queue_1.default(key, {
                    redis: { host: redis_1.default.host, port: +redis_1.default.port },
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
            bee.on('failed', this.handleFailure).process(handle);
        });
    }
    handleFailure(job, err) {
        console.log(`Queue ${job.queue.name}: FAILED`, err);
    }
}
exports.default = new Queue();
