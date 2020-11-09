require('dotenv').config();

const app = require('./app');

app.listen(5000 || process.env.SERVER_PORT);