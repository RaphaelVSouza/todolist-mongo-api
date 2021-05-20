import Mongoose from 'mongoose'
import { Connection } from 'mongoose'

interface IStatus {
  0: string
  1: string
  2: string
  3: string
}
class Mongodb {
  private status: IStatus
  private connection: Connection

  constructor() {
    this.connection = this.connect()
    this.status = {
      0: 'Disconnected',
      1: 'Connected',
      2: 'Connecting',
      3: 'Disconnecting'
    }
  }

  connect() {
    const { MONGO_URL } = process.env

    const mongooseOptions = {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }

    if (!MONGO_URL) {
      throw Error('Mongo url must be passed')
    }

    try {
      Mongoose.connect(MONGO_URL, mongooseOptions)
    } catch (e) {
      throw Error(e)
    }

    const { connection } = Mongoose

    return connection
  }

  async isConnected() {
    const { readyState } = this.connection

    const state = this.status[readyState]

    if (state === 'Connected') return state

    if (state !== 'Connecting') return state

    await new Promise((resolve) => setTimeout(resolve, 1000 * 15))

    return state
  }

  async close() {
    await this.connection.close(true)
  }
}

export default new Mongodb()
