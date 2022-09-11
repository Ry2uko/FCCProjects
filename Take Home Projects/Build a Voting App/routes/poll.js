'use strict';

import PollModel from '../models/poll.js';
import UserModel from '../models/user.js';
import express from 'express';

const router = express.Router();

router.route('/')
  .get(async (req, res) => {
    let polls;

    let toFind = {};
    if (req.query.id) toFind._id = req.query.id;
    if (req.query.name) toFind.name = { $regex: new RegExp(req.query.name, `i`) };
    if (req.query.created_by) toFind.created_by = req.query.created_by;

    try { polls = await PollModel.find(toFind, { '__v': 0 }).lean(); } 
    catch (err) { return res.status(500).json({ error: err.message }); }

    return res.status(200).render('index.ejs', { 
      user: req.user, 
      polls, 
      cacheSearch: req.query.name 
    });
  })

router.route('/api')
  .get(async (req, res) => {
    let polls;

    let toFind = {};
    if (req.query.id) toFind._id = req.query.id;
    if (req.query.name) toFind.name = { $regex: new RegExp(req.query.name, `i`) };
    if (req.query.created_by) toFind.created_by = req.query.created_by;
    
    try { polls = await PollModel.find(toFind, { '__v': 0 }).lean(); } 
    catch (err) { return res.status(500).json({ error: err.message }); }

    return res.status(200).json({ polls });
  })
  .post(validateData, async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const userData = req.user;

    const name = res.locals.name,
    created_by = userData.username,
    id = userData._id,
    options = res.locals.options;
    
    let poll, user;
    try { 
      poll = new PollModel({ name, options, created_by });
      user = await UserModel.findById(id);

      user.polls_created += 1;

      await poll.save();
      await UserModel.findByIdAndUpdate(id, user);
    } catch (err) { return res.status(400).json({ error: err.message }); }

    res.status(201).json(poll);
  })
  .put(async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const userData = req.user;

    let id = req.body.id,
    option = req.body.option,
    userId = userData._id;

    if (!id) return res.status(400).json({ error: 'Invalid/Missing id.' });
    else if (option === undefined) return res.status(400).json({ error: 'Missing option.' });

    let poll, user;
    try {
      poll = await PollModel.findById(id);
      user = await UserModel.findById(userId);

      let pollsVotedArr = Object.keys(user.polls_voted);
      if (pollsVotedArr.includes(id)) return res.status(403).json({ error: 'Same user cannot vote twice.' });

      if (!Object.keys(poll.options).includes(option)) return res.status(400).json({ error: 'Option does not exist.' });
      poll.options[option] += 1;
      poll.total_votes += 1;
      user.polls_voted[id] = option;
      user.total_votes += 1;

      await PollModel.findByIdAndUpdate(id, poll);
      await UserModel.findByIdAndUpdate(userId, user);
    } catch (err) { return res.status(400).json({ error: err.message }); }

    res.status(200).json(poll);
  })
  .delete(async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const userData = req.user;

    let id = req.body.id,
    userId = userData._id;

    if (id === undefined) {
      return res.status(400).json({ error: 'Missing id.'});
    } else if (!id) {
      return res.status(400).json({ error: 'Invalid id.' });
    }
    
    let poll, user, users;
    try {
      poll = await PollModel.findById(id).lean();
      user = await UserModel.findById(userId).lean();
      users = await UserModel.find({}).lean();

      let queryId = [];
      user.polls_created -= 1;
      users.forEach(usr => queryId.push(usr._id.toString()));

      if (poll.created_by.toLowerCase() !== userData.username.toLowerCase()) {
        return res.status(403).json({ error: 'Cannot delete poll (forbidden).' });
      }

      await UserModel.findByIdAndUpdate(userId, user);
      await PollModel.findByIdAndDelete(poll._id);
      await UserModel.updateMany({ _id: { $in: queryId } }, { 
        $unset: { [`polls_voted.${id}`]: 1 },
        $inc: { total_votes: -1 }
      });
    } catch (err) { return res.status(400).json({ error: err.message }); }

    return res.status(200).json(poll);
  });

router.route('/:user/api')
  .get(async (req, res) => {
    let polls, paramUser = req.params.user;

    try { 
      let toFind = {
        created_by: { $regex: new RegExp(`^${paramUser}$`, 'i') }
      }
      if (req.query.id) toFind._id = req.query.id;
      if (req.query.name) toFind.name = { $regex: new RegExp(req.query.name, `i`) };

      polls = await PollModel.find(toFind, { '__v': 0 }).lean(); 
    } catch (err) { return res.status(400).json({ error: err.message }); }
    
    if (!polls.length) return res.status(404).json({ polls: [] })

    return res.status(200).json({ polls });
  });

function validateData(req, res, next) {
  let errMsg = '';

  if (!req.body.name) {
    errMsg = 'Invalid or missing poll name.';
  } else if (req.body.name.length <= 3) {
    errMsg = 'Poll name must be 4 characters or above.';
  }

  if (req.body.options === undefined) {
    errMsg = 'Missing poll options.';
  } else if (!Array.isArray(req.body.options)) {
    errMsg = 'Poll options must be an array of options.';
  } else if (req.body.options.length < 2 || req.body.options.length > 20) {
    errMsg = 'Poll options must have 2-20 options.';
  }

  if (errMsg) return res.status(400).json({ error: errMsg });

  res.locals.name = req.body.name,
  res.locals.options = req.body.options.reduce((a,b) => {
    a[b] = 0;
    return a;
  }, {});

  next();
}

export default router;
