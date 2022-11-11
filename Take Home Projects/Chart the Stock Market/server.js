'use strict';

import './config.js';
import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = process.env.PORT || 1010;

app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.get('/', (req, res) => {
  res.send('Hello, User!');
})

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

export default app; // for testing