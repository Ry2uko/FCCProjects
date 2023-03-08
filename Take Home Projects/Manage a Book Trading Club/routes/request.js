'use strict';

import RequestModel from '../models/request.js';
import UserModel from '../models/user.js';
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
    let requests;
    let requestId = req.query.id;

    const queryObject = {};
    if (requestId) queryObject._id = requestId;

    try {
      requests = await RequestModel.find(queryObject, { '__v': 0 }).lean();
    } catch (err) { res.status(500).json({ error: err.message }); }

    requests.reverse();
    if (requestId) {
      if (requests.length < 1) return res.status(400).json({ error: 'Request not found.' });
      res.status(200).json({ request: requests[0] });
    } else {
      res.status(200).json({ requests });
    }
  })
  .post(validateData, async (req, res) => {
    let userA = res.locals.userA,
    userB = res.locals.userB,
    userABooks = res.locals.userABooks,
    userBBooks = res.locals.userBBooks;

    let request, books;
    try { 
      request = new RequestModel({ userA, userB, userABooks, userBBooks });
      books = await BookModel.find({ user: userB }).lean();

      await request.save();
      await BookModel.updateMany({ _id: { $in: userBBooks } }, {
        $push: { 
          requests: {
            $each: [ request._id.toString() ],
            $position: 0
          },
        },
        $inc: {
          requests_count: 1
        }
      });
    } catch (err) { return res.status(400).json({ error: err.message }); }

    res.status(201).json(request);
  });

async function validateData(req, res, next) {
  req.user = await getUserData(69445101); // Ry2ukoAlt
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  let userBObj, books;
  let errMsg = '';

  if (!req.body.userB) {
    errMsg = 'Invalid or missing userB.';
  } else if (req.user.username === req.body.userB) {
    errMsg = "Cannot send request to self >:<";
  }

  if (!req.body.userABooks) {
    errMsg = 'Invalid or missing userA books.';
  } else if (req.body.userABooks.length < 1) {
    errMsg = 'No books to trade.';
  }

  if (!req.body.userBBooks) {
    errMsg = 'Invalid or missing userB books.';
  } else if (req.body.userBBooks.length < 1) {
    errMsg = 'No books to trade.';
  }

  if (errMsg) return res.status(400).json({ error: errMsg });

  try {
    books = await BookModel.find({}).lean();
    userBObj = await UserModel.findOne({ username: req.body.userB }).lean();

    if (userBObj == null) return res.status(400).json({ error: 'UserB not found.' });

    let booksIdArr = books.reduce((a, b) => {
      if (b.available) a.push(b._id.toString());

      return a;
    }, []);

    // if bookId does not exist or is not available
    if (!req.body.userABooks.every(bookId => booksIdArr.includes(bookId))) {
      return res.status(400).json({ error: 'Book in userABooks does not exist or is not available.' });
    }

    if (!req.body.userBBooks.every(bookId => booksIdArr.includes(bookId))) {
      return res.status(400).json({ error: 'Book in userBBooks does not exist or is not available.' });
    }

    // if books to trade does not belong to user
    if (!req.body.userABooks.every(bookId => {
      let targetBook = books.find(book => book._id.toString() === bookId);
      return targetBook.user === req.user.username;
    })) {
      return res.status(400).json({ error: 'Book in userABooks does not belong to userA.' });
    }

    if (!req.body.userBBooks.every(bookId => {
      let targetBook = books.find(book => book._id.toString() === bookId);
      return targetBook.user === req.body.userB;
    })) {
      return res.status(400).json({ error: 'Book in userBBooks does not belong to userB.' });
    }

  } catch (err) { return res.status(400).json({ error: 'err.message' }); }

  res.locals.userA = req.user.username;
  res.locals.userB = userBObj.username;
  res.locals.userABooks = req.body.userABooks;
  res.locals.userBBooks = req.body.userBBooks;

  next();
}
  
export default router;