const express = require('express');
const routes = require('./routes');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });

require('dotenv').config();
require('./database')

class App {
    constructor() {
        this.server = express();
        this.middlewares();
        this.routes();
    }
    middlewares() {
        this.server.use(helmet());
        this.server.use(limiter);
        this.server.use(express.json());
        this.server.use(express.urlencoded({extended:false}));
    }
    routes() {
        this.server.use(routes);
    }
    
}

module.exports = new App().server;