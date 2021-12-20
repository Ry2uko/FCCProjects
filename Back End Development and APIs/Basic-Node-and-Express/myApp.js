var express = require('express');
const bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.use("/public" , express.static(__dirname + "/public"));

app.post("/name", (req, res) => {
  res.send({"name": `${req.body.first} ${req.body.last}`});
});






















 module.exports = app;
