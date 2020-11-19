const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/todolist', {
     useNewUrlParser: true,
      useUnifiedTopology: true
    }
    );

module.exports = mongoose;