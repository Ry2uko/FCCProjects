require('dotenv').config();

var express = require('express');
var app = express();

// enable CORS 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));

app.use(express.static('public'));

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/api/whoami", function (req, res) {
  res.json({
    "ipaddress": req.socket.remoteAddress,
    "language": req.headers["accept-language"],
    "software": req.headers["user-agent"]
    });
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
