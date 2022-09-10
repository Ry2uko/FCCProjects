'use strict';

import './config.js';
import initializePassport from './passport-config.js'
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import session from 'express-session';
import bodyParser from 'body-parser';
import flash from 'express-flash';
import passport from 'passport';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import yelp from 'yelp-fusion';
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

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use((req, res) => {
  return res.status(404).json({ error: 'Not Found' });
})

app.listen(port, () => {
  console.log(`Listening to port ${port}`); 
});

export default app; // for testing