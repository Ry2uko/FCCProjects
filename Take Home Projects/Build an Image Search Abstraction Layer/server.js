'use strict';

import './config.js';
import queryRouter from './routes/query.js';
import recentRouter from './routes/recent.js';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', err => console.error(err));
db.once('open', () => console.log('Connected to Database'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.status(200).render('index');
});

// Routes
app.use('/api/query', queryRouter);
app.use('/api/recent', recentRouter);

app.use((req, res) => {
  return res.status(404).json({ error: "Not found" });
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

export default app; // For testing