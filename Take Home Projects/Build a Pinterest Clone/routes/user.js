'use strict';

import UserModel from '../models/user.js';
import PicModel from '../models/pic.js';
import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  let users;

  try {
    users = await UserModel.find({}, { '__v': 0, '_id': 0 }).lean();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

  return res.status(200).json({ users });
});

router.get('/:user', async (req, res) => {
  let userData, pics;

  try {
    userData = await UserModel.find({ 'username': { $regex: new RegExp(`^${req.params.user}$`, 'i')} }, { '_id': 0, '__v': 0 }).lean();
    userData = userData[0];
    pics = await PicModel.find({ 'user': { $regex: new RegExp(`^${req.params.user}$`, 'i') } }, { '__v': 0 }).lean();
  } catch(err) {
    return res.status(500).json({ error: err.message });
  }

  // user will be created in database as soon as they authed
  if (pics.length < 1) return res.status(404).json({ error: 'User not found' });

  // filter out user key
  let filtered_pics = [];
  for (let i = 0; i < pics.length; i++) {
    filtered_pics.push(Object.keys(pics[i])
      .filter(key => !['user'].includes(key))
      .reduce((obj, key) => {
        obj[key] = pics[i][key]
        return obj;
      }, {})
    );
  }

  res.status(200).json({
    username: userData.username, 
    id: userData.id, 
    avatar: userData.avatar,
    html_url: userData.html_url, 
    uploaded_count: userData.uploaded_count,
    joined_date: userData.joined_date,
    picStarred: userData.picStarred,
    pics: filtered_pics
  });

});

export default router;