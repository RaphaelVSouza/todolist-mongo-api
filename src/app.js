const express = require('express');
const routes = require('./routes');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });

require('dotenv').config();

require('./database/mongo')

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
        this.server.use((err, req, res, next) => {
            console.error(err);
            res.status(500).send('Something broke!');
          });
    }
    routes() {
        this.server.use(routes);
    }
    
}

module.exports = new App().server;