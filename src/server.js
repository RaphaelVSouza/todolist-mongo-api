import 'dotenv/config.js';
import app from './routes.js';

if (process.env.NODE_ENV !== 'production') {
  console.warn(
    '\x1b[33m',
    "If you are in production, don't forget to change the node environment",
  );
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('\x1b[37m', `Server running on localhost:${PORT}`);
});
