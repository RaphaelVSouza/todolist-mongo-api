const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/loginjwt', {
     useNewUrlParser: true,
      useUnifiedTopology: true
    }
    );

module.exports = mongoose;