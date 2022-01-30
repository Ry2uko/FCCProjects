'use strict';

const mongoose = require('mongoose');

// Database
mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true 
});

const conn = mongoose.connection;
conn.on('error', err => console.error(err));
conn.once('open', () => {
  console.log('Connected to Database');
})

const hiddenKeys = ['delete_password', 'reported', '__v'];

class Reply {
  constructor(
    text,
    delete_password,
    _id,
    created_on = "", 
    reported = false
    ) {
    this._id = _id;
    this.text = text;
    this.created_on = created_on;
    this.delete_password = delete_password;
    this.reported = reported;
  }
}

const boardSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true 
  },
  created_on: {
    type: Date,
    default: new Date().toISOString()
  },
  bumped_on: {
    type: Date,
    default: new Date().toISOString()
  },
  reported: {
    type: Boolean,
    default: false
  },
  delete_password: {
    type: String,
    required: true 
  },
  replies: {
    type: Array,
    default: []
  },
  replycount: {
    type: Number,
    default: 0
  }
});

module.exports = function (app) {
  app.route('/api/threads/:board')
  .get(getBoard, filterThread, async (req, res) => {
    const BoardModel = res.locals.BoardModel,
    filteredThread = res.locals.filteredThread;
    let sortedThread;

    // Sort threads by bumped_on & limit to 10
    filteredThread.sort((a, b) => {
      return new Date(b.bumped_on) - new Date(a.bumped_on);
    });
    sortedThread = filteredThread.slice(0, 10);

    // Sort replies by created_on & limit to  3
    for (let i = 0; i < sortedThread.length; i++) {
      let replies = sortedThread[i].replies;
      replies.sort((a, b) => {
        return new Date(b.created_on) - new Date(a.created_on);
      });
      sortedThread[i].replies = replies.slice(0, 3);
    }
    

    return res.json(sortedThread);

  })
  .post(getBoard, async (req, res) => {
    const BoardModel = res.locals.BoardModel,
    text = req.body.text,
    delete_password = req.body.delete_password;

    if (
      !(text && delete_password)
    ) {
      return res.json({ error: "required field(s) missing" });
    }

    const thread = new BoardModel({
      text,
      delete_password
    });

    try {
      await thread.save();
      res.status(204).send();
    } catch (err) {
      return res.json({ error: err.message });
    }
  })
  .put(getBoard, async (req, res) => {
    const BoardModel = res.locals.BoardModel,
    thread_id = req.body.thread_id || req.body.report_id;

    try {
      const thread = await BoardModel.findById(thread_id);
      thread.reported = true;
      await thread.save();

      return res.send('reported');
    } catch (err) {
      return res.json({ error: err.message });
    }

  })
  .delete(getBoard, async (req, res) => {
    const BoardModel = res.locals.BoardModel,
    thread_id = req.body.thread_id,
    delete_password = req.body.delete_password;

    try {
      const thread = await BoardModel.findById(thread_id);

      if (thread.delete_password === delete_password) {
        BoardModel.findByIdAndDelete(thread_id, (err, deletedThread) => {
          if (deletedThread && !err) {
            res.send('success');
          } else {
            return res.json({ error: "could not delete" });
          }
        })
      } else {
        return res.send('incorrect password');
      }

    } catch (err) {
      return res.json({ error: err.message });
    }

  });

  app.route('/api/replies/:board')
  .get(getBoard, filterThread, async (req, res) => {
    const filteredThread = res.locals.filteredThread[0];
    return res.json(filteredThread);
  })
  .post(getBoard, createId, async (req, res) => {
    const BoardModel = res.locals.BoardModel,
    text = req.body.text,
    delete_password = req.body.delete_password,
    thread_id = req.body.thread_id,
    new_id = res.locals.newId;

    if (
      !(text && delete_password && thread_id)
    ) {
      return res.json({ error: "required field(s) missing" });
    }

    const reply = new Reply(
      text, 
      delete_password,
      new_id
    );

    try {
      const thread = await BoardModel.findById(thread_id);

      
      thread.bumped_on = new Date().toISOString();
      reply.created_on = new Date().toISOString();
      thread.replies.push(reply);
      thread.replycount += 1;

      res.status(204).send();

      res.redirect('back');

    } catch (err) {
      return res.json({ error: err.message });
    }

  })
  .put(getBoard, async (req, res) => {
    const BoardModel = res.locals.BoardModel,
    thread_id = req.body.thread_id,
    reply_id = req.body.reply_id;

    try {
      const thread = await BoardModel.findById(thread_id);
      let replies = thread.replies,
      replyArr = [];

      for (let i = 0; i < replies.length; i++) {
        let reply = replies[i];
        if ((reply._id).toString() === reply_id) {
          reply.reported = true;
          replyArr.push(reply);
        } else {
          replyArr.push(reply);
        }
      }

      BoardModel.findByIdAndUpdate(
        thread_id,
        {
          replies: replyArr
        },
        err => {
          if (!err) {
            return res.send('reported');
          } else {
            return res.json({ error: err });
          }
        }
      );
    } catch (err) {
      return res.json({ error: err.message });
    }

  })
  .delete(getBoard, async (req, res) => {
    const BoardModel = res.locals.BoardModel,
    thread_id = req.body.thread_id,
    reply_id = req.body.reply_id,
    delete_password = req.body.delete_password;

    try {
      const thread = await BoardModel.findById(thread_id);
      let replies = thread.replies,
      replyArr = [];

      for (let i = 0; i < replies.length; i++) {
        let reply = replies[i];
        if ((reply._id).toString() === reply_id) {
          if (reply.delete_password === delete_password) {
            reply.text = '[deleted]';
            replyArr.push(reply);
          } else {
            return res.send('incorrect password');
          }
        } else {
          replyArr.push(reply);
        } 
      }

      BoardModel.findByIdAndUpdate(
        thread_id,
        { 
          replies: replyArr
        },
        err => {
          if (!err) {
            return res.send('success');
          } else {
            return res.json({ error: err });
          }
        }
      );

    } catch (err) {
      return res.json({ error: err.message });
    }

  });
  
  function getBoard(req, res, next) {
    const board = req.params.board;
    res.locals.BoardModel = mongoose.model(board, boardSchema);
    next(); 
  }

  async function createId(req, res, next) {
    const BoardModel = res.locals.BoardModel;
    let idArr = [],
    newId;

    try {
      const threads = await BoardModel.find();

      for (let i in threads) {
        if (threads[i].replies.length > 0) {
          for (let j in threads[i].replies) {
            idArr.push(threads[i].replies[j]._id);
          }
        }
      }

      while (true) {
        newId = new mongoose.Types.ObjectId();
        if (!idArr.includes(newId)) break;
      }

    } catch (err) {
      return res.json({ error: err.message });
    }

    res.locals.newId = newId;
    next();
  }

  async function filterThread(req, res, next) {
    const BoardModel = res.locals.BoardModel;
    let thread_id = req.query.thread_id,
    filteredThread = [],
    threadObject = {},
    threads,
    threadKeys;

    try {
      if (req.originalUrl.split('/')[2].toLowerCase() === 'replies') {
        if (thread_id) {
          threads = await BoardModel.findById(thread_id)
          threads = [ threads ];
        }
      } else {
        threads = await BoardModel.find();
      } 

      for (let i = 0; i < threads.length; i++) {
        threadKeys = Object.keys(threads[i]._doc);
        threadObject = {};
        for (let j = 0; j < threadKeys.length; j++) {
          let key = threadKeys[j];
          
          if (key === 'replies') {
            let replies = threads[i]['replies'];
            let filteredReply = [], 
            replyObject = {};

            for (let k = 0; k < replies.length; k++) { // Replies
              replyObject = {};
              for (let l in replies[k]) { // Keys
                if (!hiddenKeys.includes(l)) {
                  replyObject[l] = replies[k][l]
                }
              }
              filteredReply.push(replyObject);
            }
            
            threadObject['replies'] = filteredReply;
          } else {
            if (!hiddenKeys.includes(key)) {
              threadObject[key] = threads[i][key];
            }
          }
        }
        filteredThread.push(threadObject)
      }

    } catch (err) {
      return res.json({ error: err.message });
    }

    res.locals.filteredThread = filteredThread;
    next();
  }

};
