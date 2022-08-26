'use strict';

import UserModel from '../models/user.js';
import express from 'express';

const router = express.Router();

router.route('/api')
  .get(async (req, res) => {
    let users, user;

    try { 
      if (req.query.name) user = await UserModel.findOne({ 
        username: { $regex: new RegExp(`^${req.query.name}$`, `i`) } 
      }, { '__v': 0, 'password': 0, 'email': 0, 'polls_voted': 0 })
      else users = await UserModel.find({}, { '__v': 0, 'password': 0, 'email': 0, 'polls_voted': 0 }).lean() 
    } catch (err) { return res.status(500).json({ error: err.message });  }

    if (user === null) return res.status(404).json({ error: 'user not found.' });

    return user
    ? res.status(200).json({ user })
    : res.status(200).json({ users });
  });

router.route('/:id/api')
  .get(async (req, res) => {
    let user, paramId = req.params.id;

    try { user = await UserModel.findById(paramId, { '__v': 0, 'password': 0, 'email': 0, 'polls_voted': 0 }).lean(); } 
    catch (err) { return res.status(400).json({ error: 'invalid id.' }); }
    
    if (user === null) return res.status(404).json({ error: 'user not found.' });

    return res.status(200).json({ user });
  });

export default router;