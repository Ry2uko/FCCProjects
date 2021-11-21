var express = require('express');
var app = express();

// enable CORS 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));

app.use(express.static('public'));

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/api", function(req, res) {
  res.json({
    "unix": Date.now(),
    "utc": new Date().toUTCString()
  });
});

app.get("/api/:date", function (req, res) {
  console.log(req.params.date);
  let parsedUnix = parseInt(req.params.date);
  let utcDate = new Date(req.params.date).toUTCString();

  if(parsedUnix == req.params.date) {
    res.json({
      "unix": parsedUnix,
      "utc": new Date(parsedUnix).toUTCString()
    });
  } else if(utcDate != "Invalid Date") {
    res.json({
      "unix": Date.parse(utcDate),
      "utc": utcDate
    })
  } else {
    res.json({
      "error": "Invalid Date"
    });
  }

});



var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
