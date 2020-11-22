import mongoose from 'mongoose';

class MongoDB {
  constructor() {
    this.mongoConnect();
    this.mongoErrors();
    this.mongoExit();
  }
  
  mongoConnect() {
    const connectionUrl = `mongodb://localhost/todolist`;

    mongoose.set('useCreateIndex', true)

    mongoose.connect(connectionUrl, {
      useNewUrlParser: true,
       useUnifiedTopology: true
     });

    mongoose.connection.on("connected", () => {
      console.log("Connected to mongoDB");
    });
  }

  mongoErrors() {
    mongoose.connection.on("error", (err) => {
      console.error('Failed to connect to mongoDB on startup', err);
    });

    mongoose.connection.on("error", (err) => {
      console.error('Failed to connect to DB on startup ', err);
    });
  }
   
  mongoExit() {
    
    const exitMongoDB = () => {
    mongoose.connection.close(() => {
      console.log('Mongoose default connection with DB is disconnected through app termination');
      process.exit(0);
    });
    };
  process.on('SIGINT', exitMongoDB).on('SIGTERM', exitMongoDB);

  }

}

export default new MongoDB();