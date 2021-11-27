require('dotenv').config();

const express = require('express');
const cors = require('cors');
const formidable = require('formidable');
const bodyParser = require('body-parser')

const app = express();

app.use(express.json());
app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, field, files) => {
    const file = files.upfile;
    res.json({
      "name": file.originalFilename,
      "type": file.mimetype,
      "size": file.size
    });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
