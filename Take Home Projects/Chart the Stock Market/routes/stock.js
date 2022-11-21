'use strict';

import StockModel from '../models/stock.js';
import express from 'express';

const router = express.Router();

router.route('/')
  .get(async (req, res) => {
    let stocks;

    try { stocks = await StockModel.find({}, { '__v': 0, '_id': 0 }).lean(); 
    } catch(err) { return res.status(500).json({ error: res.message }); }

    return res.status(200).json({ stocks });
  })
  .post(async (req, res) => {
    let stockObj = req.body.stockObj;

    if (!stockObj) return res.status(400).json({ error: 'Stock object missing.' });
    else if (stockObj.label.length < 1 || stockObj.label.length > 5) {
      return res.status(400).json({ error: 'Invalid stock symbol.' });
    } else if (typeof stockObj !== 'object') {
      return res.status(400).json({ error: 'Invalid stock data.' });
    }

    let dbStocks;

    try {
      dbStocks = await StockModel.find({}, { '__v': 0, '_id': 0 }).lean();
    } catch (err) { return res.status(400).json({ error: err.message }); }
    
    if (Object.keys(dbStocks).length >= 4) return res.status(400).json({ error: 'Maximum stock limit reached.' }); 
    for (let i = 0; i < dbStocks.length; i++) {
      if (dbStocks[i].symbol.toUpperCase() === stockObj.label.toUpperCase()) {
        return res.status(400).json({ error: 'Stock already exists.' });
      }
    }
    
    try {
      const stock = new StockModel({
        symbol: stockObj.label.toUpperCase(),
        monthlyTimeSeries: stockObj.data,
      });

      await stock.save();
      res.status(201).json(stock);
    } catch (err) { return res.status(500).json({ error: err.message }); }
    
  });

export default router; 