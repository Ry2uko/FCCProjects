'use strict';
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const conn = mongoose.connection;
conn.on('error', err => console.error(err));
conn.once('open', () => console.log('Connected to Database'));

const bookSchema = new mongoose.Schema({
  comments: {
    type: Array,
    default: []
  },
  title: {
    type: String,
    required: true
  },
  commentcount: {
    type: Number,
    default: 0
  }
});

const Book = mongoose.model('book', bookSchema);

module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res) => {
      try {
        let books = await Book.find();
        res.json(books);
      } catch (err) {
        res.json({ error: err.message });
      }
    })
    
    .post(async (req, res) => {
      let title = req.body.title;
      const book = new Book({ title });

      if (!title) {
        return res.send('missing required field title');
      }

      try {
        const newBook = await book.save();
        res.json({
          _id: newBook._id,
          title
        });
      } catch (err) {
        res.json({ error: err.message });
      }
    })
    
    .delete(async (req, res) => {
      try {
        await Book.deleteMany();
        res.send('complete delete successful');
      } catch (err) {
        res.send('could not delete');
      }
    });

  app.route('/api/books/:id')
    .get(getBook, (req, res) => {
      res.json(res.locals.book);
    })
    
    .post(getBook, async (req, res) => {
      let comment = req.body.comment;
      let book = res.locals.book;

      if(!comment) {
        return res.send('missing required field comment');
      }

      try {
        book.comments.push(comment);
        book.commentcount++;
        let newBook = await book.save();

        res.json(newBook);
      } catch (err) {
        res.json({ error: err.message });
      }
    })
    
    .delete((req, res) => {
      Book.findByIdAndDelete(req.params.id, (err, deletedBook) => {
        if (deletedBook) {
          res.send('delete successful');
        } else {
          res.send('no book exists');
        }
      });
    });
  
  async function getBook(req, res, next) {
    let book;

    try {
      book = await Book.findById(req.params.id);
      if (book == null) {
        return res.send('no book exists');
      }
    } catch (err) {
      res.send('no book exists');
    }

    res.locals.book = book;
    next();
  }

};
