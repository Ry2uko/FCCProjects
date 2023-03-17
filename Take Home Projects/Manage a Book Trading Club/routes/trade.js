'use strict';

import TradeModel from '../models/trade.js';
import UserModel from '../models/user.js';
import RequestModel from'../models/request.js';
import BookModel from '../models/book.js';
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
  .post(async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    // when user accepted the trade
    let request, user;
    let requestId = req.body.id;

    if (!requestId) return res.status(400).json({ error: 'Missing or invalid request id.' });

    try {
      request = await RequestModel.findById(requestId).lean();
      user = await UserModel.findOne({ id: req.user.id }).lean();

      if (request == null) return res.status(400).json({ error: 'Request does not exist.' });
      if (request.userB !== user.username) return res.status(400).json({ error: 'Request not for user.' });
    } catch (err) { return res.status(400).json({ error: err.message }); }

    let trade, userADoc, userBDoc;

    try {
      trade = new TradeModel({ 
        userA: request.userA, 
        userB: request.userB, 
        userABooks: request.userABooks, 
        userBBooks: request.userBBooks
      });

      // update both user (add trades to array)
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

      // get all books in request
      let userABBooks = request.userABooks.concat(request.userBBooks);
      let reqBulkOps = [], bookBulkOps = [];

      // get all requests that have these books
      let requestsToDelete = (await RequestModel.find({
        $or: [
          { userABooks: { $in: userABBooks } },
          { userBBooks: { $in: userABBooks } }
        ]
      }).lean()).reduce((a, b) => {
        a.push(b._id.toString());
        return a;
      }, []);

      let affBooks = await BookModel.find({
        requests: { $in: requestsToDelete }
      }).lean();

      affBooks.forEach(affBook => {
        affBook.requests = affBook.requests.filter(affBookReqId => {
          return !requestsToDelete.includes(affBookReqId);
        });
        affBook.requests_count = affBook.requests.length;

        bookBulkOps.push({
          updateOne: {
            filter: { _id: affBook._id.toString() },
            update: {
              $set: affBook
            }
          }
        });
      });

      userABBooks.forEach(abBookId => {
        let newUser = '';

        // change owner
        if (request.userABooks.includes(abBookId)) {
          newUser = request.userB;
        } else if (request.userBBooks.includes(abBookId)) {
          newUser = request.userA;
        }

        bookBulkOps.push({
          updateOne: {
            filter: { _id: abBookId },
            update: {
              $set: {
                user: newUser
              }
            }
          }
        });
      });

      requestsToDelete.forEach(reqId => {
        // delete request
        reqBulkOps.push({ deleteOne: {
          filter: { _id: reqId }
        }});

      });

      // save trade 
      await trade.save();

      // update users
      await UserModel.findOneAndUpdate({ username: userADoc.username}, userADoc);
      await UserModel.findOneAndUpdate({ username: userBDoc.username }, userBDoc);
      
      // update books (requests arary, requests_count) that are affected by the deleted trades
      await BookModel.bulkWrite(bookBulkOps);
      await RequestModel.bulkWrite(reqBulkOps);
      
    } catch (err) { return res.status(400).json({ error: err.message }); }

    res.status(201).json(trade);
  });

export default router;