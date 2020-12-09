import mongoose from 'mongoose';

class MongoDB {
  constructor() {
    this.mongoConnect();


  }

  async mongoConnect() {
    const dbName = process.env.MONGODB_NAME;
    const connectionUrl = `mongodb://localhost/${dbName}`;

    await mongoose.connect(connectionUrl, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
    }).then(() => console.log('Connected in mongodb'));

  }
}

export default new MongoDB();
