'use strict';

import UserModel from '../models/user.js';
import express from 'express';

const router = express.Router();

// get all users
router.get('/', async (req, res) => {
  let userId = req.query.id;

  if (userId) {
    let user;

    try {
      user = await UserModel.findOne({ 'id': userId }, { '__v': 0, '_id': 0}).lean();
    } catch (err) { res.status(500).json({ error: err.message }); } 

    if (user == null) return res.status(400).json({ error: 'User not found.' });

    if (user.hide_location) delete user.location;
    delete user.hide_location;

    return res.status(200).json({ user });
  } else {
    let users;

    try {
      users = await UserModel.find({}, { '__v': 0, '_id': 0 }).lean();
    } catch (err) { res.status(500).json({ error: err.message }); }
  
    users.forEach(user => {
      if (user.hide_location) delete user.location;
      delete user.hide_location;
    });
  
  
    return res.status(200).json({ users });
  }
});


export default router;