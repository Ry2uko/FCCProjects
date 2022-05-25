'use strict';

import './config.js';
import picRouter from './routes/pic.js';
import userRouter from './routes/user.js';
import UserModel from './models/user.js';

import express from 'express';
import mongoose from 'mongoose';
import { Strategy as GithubStrategy } from 'passport-github';
import passport from 'passport';
import session from 'express-session';
import cors from 'cors';
import bodyParser from 'body-parser';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { use } from 'chai';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const conn = mongoose.connection;
conn.on('error', err => console.error(err));
conn.once('open', () => console.log('Connected to Database'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 30*24*60*60*1000
  }
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});
passport.deserializeUser((id, cb) => {
  cb(null, id);
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

app.route('/')
  .get((req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
  })
  .delete((req, res) => {
    if (req.user) {
      req.logOut();
      return res.status(200).json({ success: 'successfuly logged out'});
    }
    
    res.status(401).json({ error: 'Unauthorized' });
  });

app.get('/auth/github', authGuard, passport.authenticate('github'));
app.get(
  '/auth/github/cb', 
  authGuard,
  passport.authenticate('github', { failureRedirect: '/' }),
  async (req, res) => {

    let userData;
    try { userData = await UserModel.find({ 'id': req.user.id }, { '_id': 0, '__v': 0 }).lean(); }
    catch (err) { return res.status(500).json({ error: err.message }); };

    if (userData.length < 1) {
      try {

        const new_user = new UserModel({
          username: req.user._json.login,
          id: req.user.id,
          avatar: req.user._json.avatar_url,
          html_url: req.user._json.html_url,
        });
        
        await new_user.save();
      } catch(err) { return res.status(500).json({ error: err.message }); }
    }

    res.redirect('/');
  }
);

app.use(['/api/pic', '/api/pics'], picRouter);
app.use(['/api/user', '/api/users'], userRouter);

app.use((req, res) => {
  return res.status(404).json({ error: 'Not found' });
});

function authGuard(req, res, next) {
  if (req.user) return res.redirect('/');
  next();
}

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

export default app // For testing