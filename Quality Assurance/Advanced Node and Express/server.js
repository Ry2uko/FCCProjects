"use strict";
require("dotenv").config();

const express = require("express");
const passport = require("passport");
const session = require("express-session");
const passportSocketIO = require('passport.socketio');
const cookieParser = require('cookie-parser');

const routes = require("./routes");
const auth = require("./auth");
const myDB = require("./connection");
const fccTesting = require("./freeCodeCamp/fcctesting.js");

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const MongoStore = require('connect-mongo')(session);
const URI = process.env.MONGO_URI;
const store = new MongoStore({ url: URI });

app.set("view engine", "pug");

fccTesting(app); //For FCC testing purposes
app.use("/public", express.static(process.cwd() + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false },
  key: 'express.sid',
  store: store
}));
app.use(passport.session());
app.use(passport.initialize());

myDB(async (client) => {
  const myDataBase = await client.db("database").collection("users");

  io.use(passportSocketIO.authorize({
    cookieParser: cookieParser,
    key: 'express.sid',
    secret: process.env.SESSION_SECRET,
    store: store, 
    success: onAuthorizeSuccess,
    fail: onAuthorizeFail
  }));

  let currentUsers = 0;
  io.on('connection', socket => {
    ++currentUsers;
    io.emit('user', {
      name: socket.request.user.username,
      currentUsers,
      connected: true
    });

    console.log(socket.request.user)
    console.log(`user ${socket.request.user.username} connected`);

    socket.on('chat message', message => {
      io.emit('chat message', {
        name: socket.request.user.username,
        message
      });
    });

    socket.on('disconnect', () => {
      --currentUsers;
      io.emit('user', {
        name: socket.request.user.username,
        currentUsers,
        connected: false
      });
      console.log('A user has disconnected');
    });
  });

  routes(app, myDataBase);
  auth(app, myDataBase);

}).catch((err) => {
  app.route("/").get((req, res) => {
    res.render("pug", {
      title: err,
      message: "Unable to login",
    });
  });
});

function onAuthorizeSuccess(data, accept) {
  console.log('successful connection to socket.io');
  
  accept(null, true);
}

function onAuthorizeFail(data, message, error, accept) {
  if (error) throw new Error(message);
  console.log('failed connection to socket.io', message);

  accept(null, false);
}

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
