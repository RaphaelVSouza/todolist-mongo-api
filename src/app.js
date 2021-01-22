import 'dotenv/config.js';
import express from 'express';

import passport from 'passport';

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import boom from 'express-boom';
import cors from 'cors';

import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

import { resolve } from 'path';
import applyPassportStrategy from './app/middlewares/auth.js';

import routes from './routes.js';

import limiterConfig from './config/limiter.js';

import './database/mongo.js';

const limiter = rateLimit(limiterConfig);

class App {
  constructor() {
    this.server = express();
    this.sentry(); // Comment this if you don't want to use sentry
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: false }));
    this.server.use(boom());
    this.server.use(
      cors({
        origin: process.env.FRONT_URL,
      }),
    );
    this.server.use('/files', express.static(resolve(__dirname, '..', 'tmp', 'uploads')));
    applyPassportStrategy(passport);

    this.server.use(helmet());
    this.server.use(morgan('dev'));
    if (process.env.NODE_ENV === 'production') {
      this.server.use(limiter);
    }
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
        new Tracing.Integrations.Express(this.server),
      ],
      // We recommend adjusting this value in production, or using tracesSampler
      // for finer control
      tracesSampleRate: 1.0,
    });

    // RequestHandler creates a separate execution context using domains, so that every
    // transaction/span/breadcrumb is attached to its own Hub instance
    this.server.use(Sentry.Handlers.requestHandler());
    // TracingHandler creates a trace for every incoming request
    this.server.use(Sentry.Handlers.tracingHandler());

    // The error handler must be before any other error middleware and after all controllers
    this.server.use(Sentry.Handlers.errorHandler());

    this.server.use((err, req, res, next) => {
      // The error id is attached to `res.sentry` to be returned
      // and optionally displayed to the user for support.
      console.error(err);
      res.status(500).end(`${res.sentry} \n`);
    });
  }
}

export default new App().server;
