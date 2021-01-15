import Mongoose from 'mongoose';

class Mongodb {
  constructor() {
    this.connect();
    this._status = {
      0: 'Disconnected',
      1: 'Connected',
      2: 'Connecting',
      3: 'Disconnecting',
    };
  }

  connect() {
    const connectionUrl = process.env.MONGO_URL;

    const mongooseOptions = {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    };

    Mongoose.connect(connectionUrl, mongooseOptions).catch((reject) => console.log(reject));
    const { connection } = Mongoose;

    this._connection = connection;
  }

  async isConnected() {
    const state = this._status[this._connection.readyState];

    if (state === 'Connected') return state;

    if (state !== 'Connecting') return state;

    await new Promise((resolve) => setTimeout(resolve, 1500));

    return this._status[this._connection.readyState];
  }

  async close() {
    await this._connection.close(true);
  }
}

export default new Mongodb();
