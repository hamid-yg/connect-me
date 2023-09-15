// Main Entry Point for the Server

import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import config from './config/load_env';

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.get('/', (req, res) => {
  res.send('Server is running successfully');
});

server.listen(config.port, () => console.log(`Server is running on port ${config.port}`));

export default io;
