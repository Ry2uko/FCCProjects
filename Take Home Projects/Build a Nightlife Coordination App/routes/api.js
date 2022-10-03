'use strict';

import UserModel from '../models/user.js';
import express from 'express';
import yelp from 'yelp-fusion';

const router = express.Router();
const client = yelp.client(process.env.API_KEY);

router.route('/')
  .post((req, res) => {
    const location = req.body.location;

    if (location === undefined || !location) return res.status(400).json({ error: 'invalid or undefined location.' });

    const term = 'bar restaurant';

    client.search({ 
      term,
      location,
      limit: 10
    }).then(resp => {
        const data = resp.jsonBody;
        
        if (data.businesses.length < 1) {
          return res.status(404).json({ error: 'No businesses found nearby.' });
        }

        return res.status(200).json(data);
      }).catch(err => {
        const errBody = JSON.parse(err.response.body);
        return res.status(400).json({ error: errBody.error.description });
      })

  })
  .put(async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    
    const location = req.body.location,
    locationLink = req.body.locationLink;

    if (location === undefined) return res.status(400).json({ error: 'invalid or undefined location.' });
    if (locationLink === undefined) return res.status(400).json({ error: 'invalid or undefined location link.' });

    let clearDestination = false;
    if (req.body.clear !== undefined) {
      if (req.body.clear) clearDestination = true;
    }

    let user;
    try {
      user = await UserModel.findById(req.user._id);

      if (clearDestination) {
        user.destination = '';
        user.destination_link = '';
      } else {
        user.destination = location;
        user.destination_link = locationLink;
      }

      await UserModel.findByIdAndUpdate(req.user._id, user);
    } catch (err) { return res.status(400).json({ error: err.message }); }

    res.status(200).json({ success: true });
  });

export default router;