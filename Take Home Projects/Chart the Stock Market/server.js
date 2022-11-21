'use strict';

import './config.js';
import apiRouter from './routes/api.js';
import stockRouter from './routes/stock.js';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { Server }  from 'socket.io';
import http from 'http';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = process.env.PORT   || 1010;
const server = http.createServer(app);
const io = new Server(server);

mongoose.connect(process.env.DATABASE_URL, { useNewURLParser: true });
const conn = mongoose.connection;
conn.on('error', err => console.error(err));
conn.once('open', () => console.log('Connected to Database'));

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
})

app.use('/api', apiRouter);
app.use(['/stock', '/stocks'], stockRouter);

app.use((req, res) => {
  return res.status(404).json({ error: 'Not found' });
})

server.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

io.on('connection', socket => {
  console.log('A user connected');
});

export default app; // for testing