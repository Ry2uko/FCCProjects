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
    let requestId = req.query.id,
    userA = req.query.userA,
    userB = req.query.userB; 

    if (userA && userB) return res.status(400).json({ error: 'userA and userB cannot be both a query at the same time.' });

    const queryObject = {};
    if (requestId) queryObject._id = requestId;
    if (userA) queryObject.userA = userA;
    if (userB) queryObject.userB = userB;

    try {
      requests = await RequestModel.find(queryObject, { '__v': 0 }).lean();
    } catch (err) { return res.status(400).json({ error: err.message }); }

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
  })
  .delete(async (req, res) => {
    let requestId = req.body.id;

    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (!requestId) return res.status(400).json({ error: 'Invalid or missing request id.' });

    let request;
    try {
      request = await RequestModel.findById(requestId).lean();

      if (request == null) return res.status(400).json({ error: 'Request not found.' });
      if (request.userA !== req.user.username) return res.status(400).json({ error: 'Request not by user.' });

      // delete request
      await RequestModel.findByIdAndDelete(requestId);

      // remove request in request array in book
      await BookModel.updateMany({
        _id: { $in: request.userBBooks }
      }, {
        $pull: { requests: request._id.toString() },
        $inc: { requests_count: -1 }
      });
    } catch (err) { return res.status(400).json({ error: err.message }); }

    return res.status(200).json(request);
  });

async function validateData(req, res, next) {
  req.user = await getUserData(83095832);
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  let userAObj, userBObj, books, requests;
  let errMsg = '';

  if (!req.body.userB) {
    errMsg = 'Invalid or missing userB.';
  }

  if (!req.body.userABooks) {
    errMsg = 'Invalid or missing userA books.';
  } else if (req.body.userABooks.length < 1) {
    errMsg = 'No books to trade.';
  } else if (req.body.userABooks.length > 3) {
    errMsg = 'Books to trade can not be more than 3.';
  } else if ([...new Set(req.body.userABooks)].length !== req.body.userABooks.length) {
    errMsg = 'userABooks contains duplicate books.';
  }


  if (!req.body.userBBooks) {
    errMsg = 'Invalid or missing userB books.';
  } else if (req.body.userBBooks.length < 1) {
    errMsg = 'No books to trade.';
  } else if (req.body.userBBooks.length > 3) {
    errMsg = 'Books to trade can not be more than 3.';
  } else if ([...new Set(req.body.userBBooks)].length !== req.body.userBBooks.length) {
    errMsg = 'userBBooks contains duplicate books.';
  }

  if (errMsg) return res.status(400).json({ error: errMsg });

  try {
    books = await BookModel.find({}).lean();
    requests = await RequestModel.find({}).lean();
    userAObj = await UserModel.findOne({ id: req.user.id }).lean();
    userBObj = await UserModel.findOne({ username: req.body.userB }).lean();

    if (userBObj == null) return res.status(400).json({ error: 'UserB not found.' });
    if (userAObj.username === userBObj.username) return res.status(400).json({ error: 'Cannot send request to self >:<' });

    if (requests.length > 0) {
      /* check for duplicates */

      const getSymmDiff = (arr1, arr2) => {
        // get symmetrical difference
        return arr1.filter(x => !arr2.includes(x))
        .concat(arr2.filter(x => !arr1.includes(x)));
      }

      // if other user already has this request
      let otherUserRequests = requests.filter(request => {
        // filter other user's requests to user
        return (request.userA === userBObj.username) && (request.userB === userAObj.username);
      });

      let otherUserDuplicate = otherUserRequests.find(request => {
        // if books are all the same
        return (getSymmDiff(request.userABooks, req.body.userBBooks).length + 
          getSymmDiff(request.userBBooks, req.body.userABooks).length) < 1;
      });

      if (otherUserDuplicate) return res.status(400).json({ error: 'Other user has already requested this to you.'});

      // if you already have this request
      let userRequests = requests.filter(request => {
        return (request.userA === userAObj.username) && (request.userB === userBObj.username);
      });
      
      let userDuplicate = userRequests.find(request => {
        return (getSymmDiff(request.userABooks, req.body.userABooks).length +
        getSymmDiff(request.userBBooks, req.body.userBBooks).length) < 1;
      });

      if (userDuplicate) return res.status(400).json({ error: 'You already have this request.' });
    }
    
    let booksIdArr = books.reduce((a, b) => {
      a.push(b._id.toString());
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
      return targetBook.user === userAObj.username;
    })) {
      return res.status(400).json({ error: 'Book in userABooks does not belong to userA.' });
    }

    if (!req.body.userBBooks.every(bookId => {
      let targetBook = books.find(book => book._id.toString() === bookId);
      return targetBook.user === req.body.userB;
    })) {
      return res.status(400).json({ error: 'Book in userBBooks does not belong to userB.' });
    }

  } catch (err) { return res.status(400).json({ error: err.message }); }

  res.locals.userA = userAObj.username;
  res.locals.userB = userBObj.username;
  res.locals.userABooks = req.body.userABooks; // remove duplicates
  res.locals.userBBooks = req.body.userBBooks;

  next();
}
  
export default router;