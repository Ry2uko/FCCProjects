'use strict';

import express from 'express';
import request from 'request';

const router = express.Router();

router.get('/', (req, res) => {
  let url = 'https://www.alphavantage.co/query';
  let queryFunction = 'TIME_SERIES_MONTHLY',
  querySymbol = 'TSLA';

  // 5 API requests per minute and 500 requests per day
  let apiUrl = `${url}?function=${queryFunction}&symbol=${querySymbol}&apikey=${process.env.STOCK_API_KEY}`;
  
  request.get({
    url: apiUrl,
    json: true,
    headers: { 'User-Agent': 'request'  }
  }, (err, apiRes, data) => {
    if (err || apiRes.statusCode !==  200) {
      res.status(400).json({ error: err });
    } else {
      res.status(200).json(data);
    }
  });

});

export default router;