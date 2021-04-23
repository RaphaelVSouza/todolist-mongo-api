"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const path_1 = require("path");
const jwtAuth_1 = __importDefault(require("./app/middlewares/passport/jwt-strategy/jwtAuth"));
const limiter_1 = __importDefault(require("./app/config/limiter"));
require("./database/mongo");
const limiter = express_rate_limit_1.default(limiter_1.default);
class App {
    constructor() {
        this.server = express_1.default();
        this.middlewares();
        this.errorHandling();
    }
    middlewares() {
        this.server.use(express_1.default.json());
        this.server.use(express_1.default.urlencoded({ extended: false }));
        this.server.use(cors_1.default({
            allowedHeaders: ['Content-type', 'Authorization'],
        }));
        this.server.use("/files", express_1.default.static(path_1.resolve(__dirname, "..", "tmp", "uploads")));
        jwtAuth_1.default(passport_1.default);
        this.server.use(helmet_1.default());
        this.server.use(morgan_1.default("dev"));
        if (process.env.NODE_ENV === 'production') {
            this.server.use(limiter);
        }
    }
    errorHandling() {
        this.server.use((error, req, res, next) => {
            console.error(error);
            if (process.env.NODE_ENV === 'production')
                return res.status(500).send('Internal Server Error, please try again later.');
        });
    }
}
exports.default = new App().server;