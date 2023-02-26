'use strict';

import UserModel from '../models/user.js';
import express from 'express';

const router = express.Router();

// get all users
router.get('/', async (req, res) => {
  let users;

  try {
    users = await UserModel.find({}, { '__v': 0, '_id': 0 }).lean();
  } catch (err) { res.status(500).json({ error: err.message }); }

  users.forEach(user => {
    if (user.hide_location) delete user.location;
    delete user.hide_location;
  });


  return res.status(200).json({ users });
});

export default router;