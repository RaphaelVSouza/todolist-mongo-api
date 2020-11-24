import express from 'express';
import Sentry from '@sentry/node';
import Tracing from '@sentry/tracing';
import routes from './routes.js';
import applyPassportStrategy from './app/middlewares/auth.js';
import passport from 'passport';

import helmet  from 'helmet';
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });

import 'dotenv/config.js';

import './database/mongo.js';

class App {
    constructor() {
        this.server = express();
        this.sentry();
        this.middlewares();
        this.routes();
    }
    middlewares() {
        this.server.use(helmet());
        this.server.use(limiter);
        applyPassportStrategy(passport);
        // RequestHandler creates a separate execution context using domains, so that every
        // transaction/span/breadcrumb is attached to its own Hub instance
        this.server.use(Sentry.Handlers.requestHandler());
        // TracingHandler creates a trace for every incoming request
        this.server.use(Sentry.Handlers.tracingHandler());
        this.server.use(express.json());
        this.server.use(express.urlencoded({extended:false}));
        // The error handler must be before any other error middleware and after all controllers
        this.server.use(Sentry.Handlers.errorHandler());
        this.server.use(function onError(err, req, res, next) {
            // The error id is attached to `res.sentry` to be returned
            // and optionally displayed to the user for support.
            res.statusCode = 500;
            res.end(res.sentry + "\n");
          });
    }
    routes() {
        this.server.use(routes);
    }

    sentry() {
        Sentry.init({
            dsn: process.env.SENTRY_DNS,
            integrations: [
              // enable HTTP calls tracing
              new Sentry.Integrations.Http({ tracing: true }),
              // enable Express.js middleware tracing
              new Tracing.Integrations.Express( this.server ),
            ],
          
            // We recommend adjusting this value in production, or using tracesSampler
            // for finer control
            tracesSampleRate: 1.0,
          });
    }
    
}

export default new App().server;