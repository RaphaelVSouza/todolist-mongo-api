import "dotenv/config";
import express from "express";

import passport from "passport";

import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import cors from "cors";

import { resolve } from "path";
import applyJWTStrategy from "./app/middlewares/passport/jwt-strategy/jwtAuth";
import { writeAccessLog } from './utils/accessLog';

import limiterConfig from "./app/config/limiter";

import { Errback, Request, Response, NextFunction } from 'express';

import "./database/mongo";

const limiter = rateLimit(limiterConfig);

class App {
  public server: express.Application;

  public constructor() {
    this.server = express();
    this.middlewares();
    this.errorHandling();

  }

  private middlewares() {
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: false }));
    this.server.use(
      cors()
    );
    this.server.use(
      "/files",
      express.static(resolve(__dirname, "..", "tmp", "uploads"))
    );
    applyJWTStrategy(passport);

    this.server.use(helmet());


    if(process.env.NODE_ENV === 'production') {
      //this.server.use(morgan('combined', { stream: writeAccessLog() }))
      this.server.use(limiter); // Configure rate limit to prevent DDOS
    } else {
      this.server.use(morgan("dev")); // Console.log API Routes access
    }

  }

  private errorHandling() {
    this.server.use((error: Errback, req: Request, res: Response, next: NextFunction) => {
      console.error(error)
      if(process.env.NODE_ENV === 'production') return res.status(500).send('Internal Server Error, please try again later.')
    })
  }
}

export default new App().server;
