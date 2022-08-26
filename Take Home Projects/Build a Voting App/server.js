'use strict';

import './config.js';
import UserModel from './models/user.js';
import PollModel from './models/poll.js'
import userRouter from './routes/user.js';
import pollRouter from './routes/poll.js';
import initializePassport from './passport-config.js';
import validateInput from './validate-input.js';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import flash from 'express-flash';
import passport from 'passport';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = process.env.PORT || 1010;

app.set('view engine', 'ejs');
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
app.use(flash());
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

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', async (req, res) => {
  let polls = [];

  try { polls = await PollModel.find({}, { '__v': 0 }).lean(); } 
  catch (err) { return res.status(500).json({ error: err.message }); }

  res.status(200).render('index.ejs', { 
    user: req.user, 
    polls, 
    cacheSearch: "" 
  });
});

app.route(['/login', '/signin'])
  .get(authGuard,(req, res) => {
    res.status(200).render('form.ejs', { formType: 'login', title: 'Login' });
  })
  .post(authGuard, validateForm, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }));
  
app.route(['/register', '/signup'])
  .get(authGuard, (req, res) => {
    res.status(200).render('form.ejs', { formType: 'signup', title: 'Sign Up' });
  })
  .post(authGuard, validateForm, async (req, res) => {
    let username = req.body.username,
    email = req.body.email,
    password = req.body.password;
    let userName, userEmail;

    try {
      userName = await UserModel.findOne({ username }).lean(),
      userEmail = await UserModel.findOne({ email }).lean();
    } catch (err) { return res.status(400).json({ error: err.message }); }
    
    if (userName != null) {
      req.flash('error', 'A user with that name already exists.');
      return res.redirect('/signup');
    } else if (userEmail != null) {
      req.flash('error', 'A user with that email already exists.');
      return res.redirect('/signup');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const new_user = new UserModel({
      username, email, password: hashedPassword
    });

    try {
      await new_user.save();
      res.redirect('/login');
    } catch (err) { return res.status(500).json({ error: err.message }); }
  })

app.get('/logout', notAuthGuard, (req, res) => {
  req.logOut(err => {
      if (err) return res.status(500).send(err);
      res.redirect('/');
  });
});

app.use(['/user', '/users'], userRouter);
app.use(['/poll', '/polls'], pollRouter);
app.use((req, res) => {
  return res.status(404).json({ error: 'Not found' });
});

function notAuthGuard(req, res, next) {
  if (!req.isAuthenticated()) return res.redirect('/');
  next();
}

function authGuard(req, res, next) {
  if (req.isAuthenticated()) return res.redirect('/');
  next();
}

function validateForm(req, res, next) {
  let validatedInput = validateInput(req.body);

  if (!validatedInput[0]) {
    req.flash('error', validatedInput[1]);
    return req.body.confirmPassword !== undefined
    ? res.redirect('/signup')
    : res.redirect('/login');
  }

  next();
}

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

export default app; // for testing
