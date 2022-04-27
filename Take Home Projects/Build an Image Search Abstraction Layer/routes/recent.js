'use strict';

import Recents from '../models/recents.js';
import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
      const history = await Recents.find();
      const resObj = { history: [] };

      for (let i = 0; i < history.length; i++) {
        resObj.history.push({
          _id: history[i]._id,
          searchQuery: history[i].searchQuery,
          timeSearched: history[i].timeSearched
        });
      }

      res.status(200).json(resObj);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

export default router;