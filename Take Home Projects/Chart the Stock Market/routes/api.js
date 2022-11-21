'use strict';

import express from 'express';
import request from 'request';

const router = express.Router();

router.post('/', (req, res) => {
  let url = 'https://www.alphavantage.co/query';
  let queryFunction = 'TIME_SERIES_MONTHLY',
  querySymbol = req.body.symbol || '';

  if (!querySymbol) {
    return res.status(400).json({ error: 'Stock symbol missing.' });
  } else if (querySymbol.length > 5) {
    return res.status(400).json({ error: 'Invalid symbol.' });
  }

  // 5 API requests per minute and 500 requests per day
  let apiUrl = `${url}?function=${queryFunction}&symbol=${querySymbol}&apikey=${process.env.STOCK_API_KEY}`;

  request.get({
    url: apiUrl,
    json: true,
    headers: { 'User-Agent': 'request'  }
  }, (err, apiRes, data) => {
    if (err) {
      res.status(400).json({ error: err });
    } else if (apiRes.statusCode === 200) {
      if (data['Error Message']) return res.status(400).json({ error: 'Invalid API call.' });

      const resData = {
        symbol: data['Meta Data']['2. Symbol'],
        monthlyTimeSeries: {}
      }, timeSeries = data['Monthly Time Series'];

      let filtered = Object.keys(timeSeries)
        .filter(key => ['2022', '2021', '2020', '2019'].some(year => {
          return key.includes(year);
        }))
        .reduce((obj, key) => {
          obj[key] = timeSeries[key];
          return obj;
        }, {});
        
      for (let timeKey in filtered) {
        resData.monthlyTimeSeries[timeKey] = parseFloat(filtered[timeKey]['4. close']);
      }

      res.status(200).json(resData);
    } else {
      res.status(500).json({ error: `ERROR: HTTP ${apiRes.statusCode}` });
    }
  });

});

export default router;