'use strict';

import TradeModel from '../models/trade.js';
import UserModel from '../models/user.js';
import RequestModel from'../models/request.js';
import BookModel from '../models/book.js';
import express from 'express';

const router = express.Router();

// Dummy User Data
async function getUserData(id) {
  let user = await UserModel.findOne({ id }).lean();
  return user;
}

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
  .post(async (req, res) => {
    req.user = await getUserData(69445101);  // Ry2ukoAlt
    // if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    // when user accepted the trade
    let request;
    let requestId = req.body.id;

    if (!requestId) return res.status(400).json({ error: 'Missing or invalid request id.' });

    try {
      request = await RequestModel.findById(requestId).lean();

      if (request == null) return res.status(400).json({ error: 'Request does not exist.' });
      if (request.userB !== req.user.username) return res.status(400).json({ error: 'Request not for user.' });
    } catch (err) { return res.status(400).json({ error: err.message }); }

    let trade, userADoc, userBDoc;

    try {
      trade = new TradeModel({ 
        userA: request.userA, 
        userB: request.userB, 
        userABooks: request.userABooks, 
        userBBooks: request.userBBooks
      });

      // update both user's (add trades to array)
      userADoc = await UserModel.findOne({ username: request.userA }).lean();
      userBDoc = await UserModel.findOne({ username: request.userB }).lean();

      // add trades to trades arary 
      userADoc.trades.unshift(trade._id.toString());
      userBDoc.trades.unshift(trade._id.toString());

      // swap books
      request.userABooks.forEach(bookId => {
        userADoc.books.splice(userADoc.books.indexOf(bookId), 1);
        userBDoc.books.unshift(bookId);
      });
      request.userBBooks.forEach(bookId => {
        userBDoc.books.splice(userBDoc.books.indexOf(bookId), 1);
        userADoc.books.unshift(bookId);
      });

      // save trade 
      await trade.save();

      // update users
      await UserModel.findOneAndUpdate({ username: request.userA }, userADoc);
      await UserModel.findOneAndUpdate({ username: request.userB }, userBDoc);

      // update books
      await BookModel.updateMany({ _id: { $in: request.userBBooks }}, {
        $set: { user: request.userA, requests_count: 0, requests: [] }
      });
      await BookModel.updateMany({ _id: { $in: request.userABooks }}, {
        $set: { user: request.userB, requests_count: 0, requests: [] }
      });

      // delete requests that have books in this trade
      await RequestModel.deleteMany({
        userABooks: { $in: request.userABooks.concat(request.userBBooks) }
      });
      await RequestModel.deleteMany({
        userBBooks: { $in: request.userBBooks.concat(request.userABooks) }
      }); 
    } catch (err) { return res.status(400).json({ error: err.message }); }

    res.status(201).json(trade);
  });

export default router;