'use strict';

import PicModel from '../models/pic.js';
import UserModel from '../models/user.js'; // For avoiding github api rate limit
import express from 'express';

const router = express.Router();

router.route('/')
  .get(getUserData, async (req, res) => {2

    let starredFilter = req.query.starred, // must be authenticated
    idFilter = req.query.id,
    userData = res.locals.userData 
    ? res.locals.userData[0] : null,
    pics;

    if (idFilter !== undefined) {
      try {
        pics = await PicModel.findById({ _id: idFilter }, { '__v': 0});

        if (pics == null) return res.status(404).json({ error: 'not found' });

        pics = [ pics ];
      } catch (err) {
        return res.status(400).json({ error: 'invalid id' });
      }
    } else {
      try {
        pics = await PicModel.find({}, { '__v': 0 }).lean();
      } catch(err) {
        return res.status(500).json({ error: err.message });
      }
    }
    
    if (starredFilter !== undefined) {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

      if (starredFilter === 'true' || starredFilter === true) {
        const userData = await UserModel.find({ 'id': req.user }).lean();
        let picStarred = userData[0].picStarred;

        pics = pics.filter(pic => {
          return picStarred.includes(pic._id.toString());
        });

      } else {
        return res.status(400).json({ error: 'invalid (starred) filter'});
      }
      
    }

    const total_pics = pics.length;
    return userData ? res.status(200).json({
      user: {
        username: userData.username, 
        id: userData.id, 
        avatar: userData.avatar,
        html_url: userData.html_url,
        uploaded_count: userData.uploaded_count,
        joined_date: userData.joined_date,
      },
      total_pics,
      pics
    }) : res.status(200).json({ total_pics, pics });
  })
  .post(validateInput, getUserData, async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    let userData = res.locals.userData[0];

    userData.uploaded_count += 1;

    try { await UserModel.findOneAndUpdate({ 'id': req.user }, {$inc: { uploaded_count: 1 }}); }
    catch (err) { return res.status(500).json({ error: err.message }); }

    const picUrl = req.body.picUrl,
    picDesc = req.body.picDesc,
    user = userData.username,
    avatar = userData.avatar;

    const new_pic = new PicModel({ picUrl, picDesc, user, avatar });
    try { await new_pic.save(); }
    catch (err) { return res.status(400).json({ error: err.message }); }

    res.status(201).json({ success: 'successfully created' });
  })
  .put(async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    let id = req.body.id,
    starred = req.body.starred,
    picDesc = req.body.picDesc;

    const MAXDESCLEN = 120;

    if (starred === 'true') starred = true;
    else if (starred === 'false') starred = false;

    if (id === undefined) {
      return res.status(400).json({ error: 'missing id' });
    } else if (!id) {
      return res.status(400).json({ error: 'invalid id' });
    }

    if (starred === undefined && picDesc === undefined) {
      return res.status(400).json({ error: 'missing starred or picDesc' });
    } else if (starred !== undefined && (starred !== true && starred !== false)) {
      return res.status(400).json({ error: 'invalid starred' });
    } else if (picDesc !== undefined && typeof picDesc !== 'string') {
      return res.status(400).json({ error: 'invalid picDesc' });
    } else if (picDesc !== undefined && picDesc.length > MAXDESCLEN) {
      return res.status(400).json({ error: `picDesc must not be greater than ${MAXDESCLEN} characters`});
    }

    try {
      const picData = await PicModel.findById(id),
      userData = await UserModel.find({ id: req.user } );

      if (starred === true) {
        if (userData[0].picStarred.includes(id)) return res.status(400).json({ error: 'pic already starred' });
        picData.starred += 1;
        userData[0].picStarred.push(id);
      } else if (starred === false) {
        if (!userData[0].picStarred.includes(id)) return res.status(400).json({ error: 'pic is not starred' });
        if (picData.starred > 0) { 
          let index = userData[0].picStarred.indexOf(id);
          userData[0].picStarred.splice(index, 1);
          picData.starred -= 1;
        }
      }

      if (picDesc !== undefined) {
        picData.picDesc = picDesc;
      }

      await PicModel.findByIdAndUpdate(id, picData);
      await UserModel.findOneAndUpdate({ 'id': req.user }, userData[0]);

      res.status(200).json({ success: 'successfully updated' });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
    
  })
  .delete(async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    let id = req.body.id;
    
    if (id === undefined) {
      return res.status(400).json({ error: 'missing id' });
    } else if (!id) {
      return res.status(400).json({ error: 'invalid id' });
    }

    try {

      const picData = await PicModel.findById(id, { '__v': 0 }).lean();
      const reqUserData = await UserModel.find({ id: req.user }).lean();
      if (picData == null) return res.status(404).json({ error: 'not found' });
      if (reqUserData[0].username.toLowerCase() !== picData.user.toLowerCase()) {
        return res.status(403).json({ error: 'cannot delete pic (forbidden)' });
      }

      const userData = await UserModel.find({});
      
      for (let i = 0; i < userData.length; i++) {
        if (userData[i].id === req.user) {
          userData[i].uploaded_count -= 1;
        }
        if (userData[i].picStarred.includes(id)) {
          let index = userData[i].picStarred.indexOf(id);
          userData[i].picStarred.splice(index, 1);
        }
      }

      userData.forEach(async (doc) => {
        await UserModel.findByIdAndUpdate(doc._id, doc);
      });
      await PicModel.findByIdAndDelete(id);

      return res.status(200).json({ success: 'successfully deleted' });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    return res.send();
  });

async function getUserData(req, res, next) {
  if (!req.user) return next();

  let userData;

  try { userData = await UserModel.find({ 'id': req.user }, { '_id': 0, '__v': 0 }).lean(); }
  catch (err) { return res.status(500).json({ error: err.message }) };

  res.locals.userData = userData;
  next();
}

function validateInput(req, res, next) {
  const picUrl = req.body.picUrl,
  picDesc = req.body.picDesc;

  let errMsg = picUrl === '' || picUrl === undefined ? 'Pic url is missing'
  : picDesc === '' || picDesc === undefined ? 'Pic description is missing'
  : !picUrl ? 'Pic url is invalid'
  : !picDesc ? 'Pic description is invalid'
  : '';

  return errMsg ? res.status(400).json({ error: errMsg }) : next();
}

export default router;