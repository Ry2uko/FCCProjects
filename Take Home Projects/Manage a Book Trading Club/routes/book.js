'use strict';

import BookModel from '../models/book.js';
import UserModel from '../models/user.js';
import RequestModel from '../models/request.js';
import express from 'express';

const router = express.Router();

const bookConditions = [
  'Excellent',
  'Very Good',
  'Good',
  'Fair',
  'Poor'
];

router.route('/')
  .get(async (req, res) => {
    let books;
    let bookId = req.query.id,
    title = req.query.title,
    author = req.query.author,
    user = req.query.user,
    condition = req.query.condition;
    
    const queryObject = {};
    if (bookId) queryObject._id = bookId;
    if (title) queryObject.title = title;
    if (author) queryObject.author = author;
    if (user) queryObject.user = user;
    if (condition) queryObject.condition = condition;

    try {
      books = await BookModel.find(queryObject, { '__v': 0 }).lean();
    } catch (err) { res.status(500).json({ error: err.message }); }

    books.reverse();
    if (bookId) {
      if (books.length < 1) return res.status(400).json({ error: 'Book not found.'});
      res.status(200).json({ book: books[0] });
    } else {
      res.status(200).json({ books });
    }
  })
  .post(validateData, async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    let book, user;

    let title = res.locals.title,
    author = res.locals.author,
    condition = res.locals.condition;

    try {
      user = await UserModel.findOne({ id: req.user.id }).lean();
      book = new BookModel({ user: user.username, title, author, condition });

      // update user's books
      user.books.unshift(book._id.toString());

      await book.save();
      await UserModel.findOneAndUpdate({ id: user.id }, user);
    } catch (err) { return res.status(400).json({ error: err.message }); }

    res.status(201).json(book);
  })
  .delete(async (req, res) => {
    let bookId = req.body.id;
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (!bookId) return res.status(400).json({ error: 'Book id missing or invalid.' });

    let book;
    try {
      let bookBulkOps = [];

      book = await BookModel.findById(bookId).lean();

      if (book == null) return res.status(400).json({ error: 'Book not found.' });

      // get all requests that have the book to delete
      let requestsToDelete = (await RequestModel.find({
        $or: [
          { userABooks: book._id.toString() },
          { userBBooks: book._id.toString() }
        ]
      }).lean()).reduce((a, b) => {
        a.push(b._id.toString());
        return a;
      }, []);

      // updated affected books (affBooks)
      let affBooks = (await BookModel.find({
        $or: [ { requests: { $in: requestsToDelete } }, { _id: book._id.toString() } ]
      }).lean()).map(affBook => {
        if (affBook._id.toString() === book._id.toString()) {
          // delete book
          bookBulkOps.push({
            deleteOne: {
              filter: { _id: affBook._id.toString() }
            }
          });
          return affBook;
        }

        // filter out requests to be deleted
        affBook.requests = affBook.requests.filter(affBookReqId => {
          return !requestsToDelete.includes(affBookReqId)
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

        return affBook;
      });

      // update user and remove book
      await UserModel.findOneAndUpdate({ username: book.user }, {
        $pull: { books: bookId  }
      });

      // delete requests that has this book
      await RequestModel.deleteMany({
        _id: { $in: requestsToDelete }
      });

      await BookModel.bulkWrite(bookBulkOps);
    } catch (err) { return res.status(400).json({ error: err.message }); }

    res.status(200).json(book);
  });

function validateData(req, res, next) {
  let errMsg = '';

  if (!req.body.title) {
    errMsg = 'Invalid or missing book title.';
  }

  if (req.body.condition) {
    if (!bookConditions.includes(req.body.condition)) {
      errMsg = 'Invalid book condition.';
    }
  }

  if (errMsg) return res.status(400).json({ error: errMsg });

  res.locals.title = req.body.title;
  res.locals.author = req.body.author || '';
  res.locals.condition = req.body.condition || '';

  next();
}

export default router;