const mongoose = require('mongoose');

class Database {
  constructor() {
    this.mongoConnect();
  }
  
  mongoConnect() {
    const connectionUrl = `mongodb://localhost/todolist`;

    mongoose.connect(connectionUrl, {
      useNewUrlParser: true,
       useUnifiedTopology: true
     }
     );
  }

}

module.exports = new Database();