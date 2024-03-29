import 'dotenv/config'
import express from 'express'

import passport from 'passport'

import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import morgan from 'morgan'
import cors from 'cors'
import Youch from 'youch'

import { resolve } from 'path'
import applyJWTStrategy from './app/middlewares/passport/jwt-strategy/jwtAuth'
import routes from './routes'

import limiterConfig from './app/config/limiter'

import { Errback, Request, Response, NextFunction } from 'express'

import './database/mongo'

const limiter = rateLimit(limiterConfig)

class App {
  public server: express.Application

  public constructor() {
    this.server = express()
    this.middlewares()
    this.errorHandling()
    this.routes()
  }

  private routes() {
    this.server.use(routes)
  }

  private middlewares() {
    this.server.use(express.json())
    this.server.use(express.urlencoded({ extended: false }))
    this.server.use(
      cors({
        allowedHeaders: ['Content-type', 'Authorization']
      })
    )
    this.server.use(
      '/files',
      express.static(resolve(__dirname, '..', 'tmp', 'uploads'))
    )
    applyJWTStrategy(passport)

    this.server.use(helmet())

    this.server.use(morgan('dev')) // Console.log API Routes access

    if (process.env.NODE_ENV === 'production') {
      this.server.use(limiter) // Configure rate limit to prevent DDOS
    }
  }

  private errorHandling() {
    this.server.use(
      async (
        error: Errback,
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        const errors = await new Youch(error, req).toJSON()

        if (process.env.NODE_ENV === 'production') {
          return res
            .status(500)
            .json({ error: 'Internal Server Error, please try again later.' })
        }
        return res.status(500).json(errors)
      }
    )
  }
}

export default new App().server
