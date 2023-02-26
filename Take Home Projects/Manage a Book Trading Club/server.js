'use strict';

import './config.js';
import UserModel from './models/user.js';
import bookRouter from './routes/book.js';
import requestRouter from './routes/request.js';
import tradeRouter from './routes/trade.js';
import userRouter from './routes/user.js';
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
import { Strategy as GithubStrategy } from 'passport-github';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

mongoose.connect(process.env.DATABASE_URL, { useNewURLParser: true });
const conn = mongoose.connection;
conn.on('error', err => console.error(err));
conn.once('open', () => console.log('Connected to Database'));

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
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

passport.serializeUser((user, cb) => {
  let filteredUser = {
    username: user._json.login,
    id: user.id
  }
  cb(null, filteredUser);
})
passport.deserializeUser((user, cb) => {
  cb(null, user);
});
passport.use(new GithubStrategy(
  {
    clientID: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL: process.env.CB_URL
  }, (accessToken, refreshToken, profile, cb) => {
    cb(null, profile);
  })
);

app.get('/auth', notAuthGuard, (req, res) => {
  return res.status(200).send({ user: req.user });
});
app.get('/auth/github', authGuard, passport.authenticate('github'));
app.get(
  '/auth/github/cb', 
  authGuard, 
  passport.authenticate('github', { failureRedirect: '/' }),
  async (req, res) => {
    let userData;

    try { userData = await UserModel.find({ 'id': req.user.id}, { '_id': 0, '__v': 0 }).lean(); }
    catch (err) { return res.status(500).json({ error: err.message }); }

    if (userData.length < 1) {
      // create new user
      try {
        const new_user = new UserModel({
          username: req.user._json.login,
          id: req.user.id,
        });

        ['location', 'avatar_url', 'bio'].forEach(prop => {
          if (req.user._json[prop]) new_user[prop] = req.user._json[prop];
        });
        
        await new_user.save();
      } catch (err) { return res.status(500).json({ error: err.message }); }

    }
    
    res.redirect('/');
  }
);


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
app.use('/users', userRouter);

app.get('/', (req, res) => {
  res.redirect(301, process.env.PROXY_URL);
});

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