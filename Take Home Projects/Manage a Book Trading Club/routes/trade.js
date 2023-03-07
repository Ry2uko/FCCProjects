'use strict';

import TradeModel from '../models/trade.js';
import UserModel from '../models/user.js';
import { validateData } from './request.js';
import express from 'express';

const router = express.Router();

router.route('/')
  .get(async (req, res) => {
    let trades; 
    let tradeId = req.query.id;

    const queryObject = {};
    if (tradeId) queryObject._id = tradeId;

    try {
      trades = await TradeModel.find(queryObject, { '__v': 0 }).lean();
    } catch (err) { res.status(500).json({ error: err.message }); }

    trades.reverse();
    if (tradeId) {
      if (trades.length < 1) return res.status(400).json({ error: 'Trade not found.' });
      res.status(200).json({ trade: trades[0] });
    } else {
      res.status(200).json({ trades });
    }
  })
  .post(validateData, async (req, res) => {
    // Assuming that the former request has not yet been removed and books still have the same owners and still available so that validation won't fail

    let userA = res.locals.userA,
    userB = res.locals.userB,
    userABooks = res.locals.userABooks,
    userBBooks = res.locals.userBBooks;

    let trade, userADoc, userBDoc;

    try {
      trade = new TradeModel({ userA, userB, userABooks, userBBooks });
      userADoc = await UserModel.findOne({ id: req.user.id }).lean();
      userBDoc = await UserModel.findOne({ username: userB }).lean();

      // update user trades
      userADoc.trades.unshift(trade._id.toString());
      userBDoc.trades.unshift(trade._id.toString());

      await trade.save();
      await UserModel.findOneAndUpdate({ id: userADoc.id }, userADoc);
      await UserModel.findOneAndUpdate({ id: userBDoc.id }, userBDoc);
    } catch (err) { return res.status(400).json({ error: err.message }); }

    res.status(201).json(trade);
  });
export default router;