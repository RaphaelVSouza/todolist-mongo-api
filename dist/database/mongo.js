"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
class Mongodb {
    constructor() {
        this.connection = this.connect();
        this.status = {
            0: 'Disconnected',
            1: 'Connected',
            2: 'Connecting',
            3: 'Disconnecting'
        };
    }
    connect() {
        const { MONGO_URL } = process.env;
        const mongooseOptions = {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        };
        if (!MONGO_URL) {
            throw Error('Mongo url must be passed');
        }
        try {
            mongoose_1.default.connect(MONGO_URL, mongooseOptions);
        }
        catch (e) {
            throw Error(e);
        }
        const { connection } = mongoose_1.default;
        return connection;
    }
    async isConnected() {
        const { readyState } = this.connection;
        const state = this.status[readyState];
        if (state === 'Connected')
            return state;
        if (state !== 'Connecting')
            return state;
        await new Promise((resolve) => setTimeout(resolve, 1000 * 15));
        return state;
    }
    async close() {
        await this.connection.close(true);
    }
}
exports.default = new Mongodb();
