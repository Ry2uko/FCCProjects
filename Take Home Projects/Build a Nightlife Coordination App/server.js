'use strict';

import './config.js';
import initializePassport from './passport-config.js';
import apiRouter from './routes/api.js';
import UserModel from './models/user.js';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import session from 'express-session';
import bodyParser from 'body-parser';
import passport from 'passport';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = process.env.PORT || 1010;

initializePassport(passport);

mongoose.connect(process.env.DATABASE_URL, { useNewURLParser: true });
const conn = mongoose.connection;
conn.on('error', err => console.error(err));
conn.once('open', () => console.log('Connected to Database'));

app.use(helmet({
  contentSecurityPolicy: false
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

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/auth', notAuthGuard, (req, res) => {
  return res.status(200).send({ user: req.user });
});

app.route(['/login', '/signin'])
  .post(authGuard, (req, res, next) => {
    if (req.body.confirmPassword) return res.status(400).json({ error: 'Invalid Request Body' });
    validateForm(req, res, next, 'login');
  }, (req, res, next) => {
    passport.authenticate('local', (err, user, errMsg) => {
      if (err) return res.status(500).json({ err });
      if (!user) return res.status(400).json({ error: errMsg.message });

      req.logIn(user, () => {
        res.status(200).json({ success: true });
      });
    })(req, res, next);
  });

app.route(['/register', '/signup'])
  .post(authGuard, (req, res, next) => {
    validateForm(req, res, next, 'register');
  }, async (req, res) => {
    let username = req.body.username,
    password = req.body.password;
    let existingUser;

    try { existingUser = await UserModel.findOne({ username }).lean(); }
    catch (err) { return res.status(400).json({ error: err.message }); }

    if (existingUser !== null) {
      return res.status(400).json({ error: 'User with that name already exists.' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    let new_user = new UserModel({
      username, password: hashedPassword
    });

    try {
      new_user = await new_user.save();

      let user = {
        username: new_user.username,
        _id: new_user._id.toString()
      }

      req.login(user, err => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ success: true });
      });

    } catch (err) { return res.status(500).json({ error: err.message }); }
  });

app.route('/logout')
  .post(notAuthGuard, (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ error: 'Interval Server Error'});
      res.status(200).json({ success: true });
    });
  });

app.use('/api', apiRouter);

app.get('*', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, 'client/public') })
});

function validateForm(req, res, next, loginType) {
  const body = req.body;

  let username = body.username || '',
  password = body.password || '',
  confirmPassword = body.confirmPassword || '',
  errMsg = '';

  const checkErr = msg => {
    if (msg.length < 1) return false;
    res.status(400).json({ error: msg });
    return true;
  }

  const usernameRegex = /^[a-zA-Z0-9]+$/;

  if (username === '' || password === '') errMsg = 'Missing input field(s).';

  if (loginType === 'register') {
    if (confirmPassword === '') errMsg = 'Missing input field(s).';
    else if (confirmPassword !== password) errMsg = "Passwords do not match.";
  }
  if (checkErr(errMsg)) return;

  if (username.length < 6 || username.length > 20) errMsg = 'Username must be 6-20 characters long.';
  else if (!usernameRegex.test(username)) errMsg = 'Invalid username.';
  if (checkErr(errMsg)) return;

  if (password.length < 8) errMsg = 'Password is too short.';
  if (checkErr(errMsg)) return;

  next();
}

function authGuard(req, res, next) {
  if (req.isAuthenticated()) return res.status(400).json({ error: 'Already Authenticated' });
  next();
}

function notAuthGuard(req, res, next) {
  if (!req.isAuthenticated()) return res.status(401).json({ error: 'Not Authenticated' });
  next();
}

app.listen(port, () => {
  console.log(`Listening to port ${port}`); 
});

export default app; // for testing