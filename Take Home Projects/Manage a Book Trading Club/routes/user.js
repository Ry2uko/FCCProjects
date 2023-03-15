'use strict';

import UserModel from '../models/user.js';
import BookModel from '../models/book.js';
import RequestModel from '../models/request.js';
import TradeModel from '../models/trade.js';
import express from 'express';

const router = express.Router();

router.route('/')
  .get(async (req, res) => {
    req.user = {
      id: 69445101
    };

    let users;
    let userId = req.query.id,
    username = req.query.username,
    location = req.query.location;

    const queryObject = {};
    
    if (userId) queryObject.id = userId;
    if (username) queryObject.username = username;
    if (location) queryObject.location = location;

    try {
      users = await UserModel.find(queryObject, { '__v': 0, '_id': 0 }).lean();
    } catch (err) { res.status(500).json({ error: err.message }); }

    users.forEach((user, index) => {
      if (user.hide_location) {
        if (location) return users.splice(index, 1);
        if (req.user) {
          if (req.user.id !== user.id) {
            delete user.location
          }
        } else {
          delete user.location
        }
      }
    });

    users.reverse();
    
    if (userId || username) {
      if (users.length < 1) return res.status(400).json({ error: 'User not found.' });
      res.status(200).json({ user: users[0] });
    } else {
      res.status(200).json({ users });
    }
  })
  .put(async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    let userId = req.body.id,
    username = req.body.username,
    avatar_url = req.body.avatar_url,
    bio = req.body.bio,
    hide_location = req.body.hide_location,
    location = req.body.location ;

    if (!userId) return res.status(400).json({ error: 'Invalid or missing user id.' });
    if (userId !== req.user.id) return res.status(400).json({ error: 'Cannot edit other user.'});
    if (![
      username,
      avatar_url,
      bio,
      hide_location,
      location
    ].some(userProp => Boolean(userProp) || userProp === '')) {
      return res.status(400).json({ error: 'Nothing to update.' });
    }

    let user;
    try {
      let validationUser;
      user = await UserModel.findOne({ id: userId }).lean();
      let oldUsername = user.username;

      if (user == null) return res.status(400).json({ error: 'User not found.' });
      
      if (username && oldUsername !== username) {
        validationUser = await UserModel.findOne({ username });
        if (validationUser != null) return res.status(400).json({ error: 'User with that name already exists.' });
      }

      let propObj = { username, avatar_url, hide_location, location, bio };
      Object.keys(propObj).forEach(prop => {
        if (propObj[prop] === undefined) return;
        if (prop === 'hide_location') user[prop] = propObj[prop] === 'true' ? true : false;
        else user[prop] = propObj[prop];
      });

      // update user
      await UserModel.findOneAndUpdate({ id: userId }, user);

      // rename all instances of user in database
      if (username && username !== oldUsername) {
        await BookModel.updateMany({ user: oldUsername }, {
          $set: { user: username }
        });
        await RequestModel.updateMany({ userA: oldUsername }, {
          $set: { userA: username }
        });
        await RequestModel.updateMany({ userB: oldUsername }, {
          $set: { userB: username }
        });
        await TradeModel.updateMany({ userA: oldUsername }, {
          $set: { userA: username }
        });
        await TradeModel.updateMany({ userB: oldUsername }, {
          $set: { userB: username }
        });
      }

      return res.status(200).json(user);

    } catch (err) { return res.status(400).json({ error: err.message }); }

  });

export default router;