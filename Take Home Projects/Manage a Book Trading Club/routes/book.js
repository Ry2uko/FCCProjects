'use strict';

import BookModel from '../models/book.js';
import UserModel from '../models/user.js';
import express from 'express';

const router = express.Router();

// Dummy User Data
async function getUserData(id) {
  let user = await UserModel.findOne({ id }).lean();
  return user;
}

router.route('/')
  .get(async (req, res) => {
    let books;
    let bookId = req.query.id, 
    isAvailable = req.query.available,
    title = req.query.title,
    author = req.query.author,
    user = req.query.user,
    condition = req.query.condition;
    
    const queryObject = {};
    if (bookId) queryObject._id = bookId;
    if (isAvailable) queryObject.available = isAvailable;
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
    req.user = await getUserData(69445101);
    // if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    let book, user;

    let title = res.locals.title,
    author = res.locals.author,
    condition = res.locals.condition;

    try {
      book = new BookModel({ user: req.user.username, title, author, condition });
      user = await UserModel.findOne({ id: req.user.id }).lean();

      // update user's books
      user.books.unshift(book._id);

      await book.save();
      await UserModel.findOneAndUpdate({ id: user.id }, user);
    } catch (err) { return res.status(400).json({ error: err.message }); }

    res.status(201).json(book);
  });

function validateData(req, res, next) {
  let errMsg = '';

  if (!req.body.title) {
    errMsg = 'Invalid or missing book title.';
  }

  if (errMsg) return res.status(400).json({ error: errMsg });

  res.locals.title = req.body.title;
  res.locals.author = req.body.author || '';
  res.locals.condition = req.body.condition || '';

  next();
}

export default router;