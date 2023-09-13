// Main Entry Point for the Server

import express from 'express';
import cors from 'cors';
import config from './config/load_env.js';

const app = express();

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(config.port, () => {
  console.log('Server listening on port 3000');
});
