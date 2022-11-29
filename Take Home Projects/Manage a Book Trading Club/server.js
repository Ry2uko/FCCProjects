'use strict';

import './config.js';
import initializePassport from './passport-config.js';
import UserModel from './models/user.js';
import bookRouter from './routes/book.js';
import requestRouter from './routes/request.js';
import tradeRouter from './routes/trade.js';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import session from 'express-session';
import bodyParser from 'body-parser';
import cors from 'cors';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import passport from 'passport';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

initializePassport(passport);

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
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 30*24*60*60*1000
  }
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth', notAuthGuard, (req, res) => {
  return res.status(200).send({ user: req.user });
});

app.route(['/login', '/signin'])
  .post(authGuard, (req, res, next) => {
    validateForm(req, res, next, 'register');
  }, async (req, res) => {
    return;
  });

app.route(['/register', '/signup'])
  .post(authGuard, (req, res, next) => {
    validateForm(req, res, next, 'register');
  }, async (req, res) => {
    return;
  });

app.route('/logout')
  .post(notAuthGuard, (req, res) => {
    return;
  });

app.use(['/book', '/books'], bookRouter);
app.use(['/request', '/requests'], requestRouter);
app.use(['/trade', '/trades'], tradeRouter);

app.get('*', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, 'client/public') });
});

function authGuard(req, res, next) {
  if (req.isAuthenticated()) return res.status(400).json({ error: 'Already authenticated.'});
  next();
}

function notAuthGuard(req, res, next) {
  if (!req.isAuthenticated()) return res.status(401).json({ error: 'Not authenticated.' }) ;
  next();
}

const port = process.env.PORT || 1010;
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

export default app; // for testing