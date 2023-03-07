'use strict';

import UserModel from '../models/user.js';
import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
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
      delete user.location;
      if (location) return users.splice(index, 1);
    }
    delete user.hide_location;
  });

  users.reverse();
  if (userId || username) {
    if (users.length < 1) return res.status(400).json({ error: 'User not found.' });
    res.status(200).json({ user: users[0] });
  } else {
    res.status(200).json({ users });
  }
});


export default router;