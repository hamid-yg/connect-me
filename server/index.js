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
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.get('/', (req, res) => {
  res.send('Server is running successfully');
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id);
  
  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("callUser", {
      signal: signalData,
      from,
      name,
    });
  });

  socket.on("updateMyMedia", ({ type, currentMediaStatus }) => {
    socket.broadcast.emit("updateUserMedia", { type, currentMediaStatus });
  });

  socket.on("msgUser", ({ name, to, msg, sender }) => {
    io.to(to).emit("msgRcv", { name, msg, sender });
  });

  socket.on('sendTypingSignal', ({ to, sender }) => {
    socket.broadcast.emit('rcvTypingSignal', { to, sender });
  });

  socket.on('sendStopTypingSignal', ({ to, sender }) => {
    socket.broadcast.emit('rcvStopTypingSignal', { to, sender });
  });

  socket.on("answerCall", (data) => {
    socket.broadcast.emit("updateUserMedia", {
      type: data.type,
      currentMediaStatus: data.myMediaStatus,
    });
    io.to(data.to).emit("callAccepted", data);
  });

  socket.on("endCall", ({ id }) => {
    io.to(id).emit("endCall");
  });
});

server.listen(config.port, () => console.log(`Server is running on port ${config.port}`));
