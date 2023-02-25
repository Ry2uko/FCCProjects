'use strict';

import './config.js';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { PeerServer } from 'peer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer);
const peerServer = PeerServer({ port: process.env.PEERSERVERPORT });

app.set('view engine', 'ejs');

app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/public', express.static(path.join(__dirname, 'public')));

// Routes

app.get('/', (req, res) => {
  res.status(200).render('index.ejs');
});

app.get('/room/:roomName', (req, res) => {
  res.status(200).render('room.ejs', {
    roomName: req.params.roomName
  });
});

app.use((req, res) => {
  return res.status(404).json({ error: 'Not found ;(' });
});

io.on('connection', socket => {
  socket.on('join-room', (roomName, userId) => {
    socket.join(roomName);
    socket.to(roomName).emit('user-connected', userId);

    socket.on('disconnect', () => {
      socket.to(roomName).emit('user-disconnected', userId);
    });
  });
});

const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
