'use strict';

import '../config.js';
import Recents from '../models/recents.js';
import express from 'express';
import { createApi } from 'unsplash-js';
import * as nodeFetch from 'node-fetch';

const router = express.Router();

// Unsplash Api
const unsplash = createApi({
  accessKey: process.env.ACCESS_KEY,
  fetch: nodeFetch.default
});

router.get('/:query', validateRequest, async (req, res) => {
  const query = req.params.query,
  page = req.query.page || '1',
  imgCount = req.query.imgCount || '12',
  imgSize = req.query.imgSize || 'all';

  let noResult = false;

  const resObj = {
    images: []
  };

  await unsplash.search.getPhotos({
    query: query,
    page: parseInt(page),
    perPage: parseInt(imgCount)
  }).then(data => {

    if (data.errors) res.status(500).json({ error: data.errors[0] });  

    const pics = data.response;

    if (pics.total < 1) noResult = true;

    for (let i = 0; i < pics.results.length; i++) {
      const picObj = pics.results[i];
      let imageSizes = {
        small: picObj.urls.small,
        regular: picObj.urls.regular,
        full: picObj.urls.full
      }, imageBySize;

      switch(imgSize) {
        case 'all':
          imageBySize = imageSizes;
          break;
        case 'small':
          imageBySize = imageSizes.small;
          break;
        case 'regular':
          imageBySize = imageSizes.regular;
          break;
        case 'full':
          imageBySize = imageSizes.full;
      }

      resObj.images.push({
        width: picObj.width,
        height: picObj.height,
        size: picObj.width*picObj.height,
        description: picObj.description || picObj.alt_description,
        url: imageBySize,
        thumbnail: picObj.urls.thumb,
        download: picObj.links.download,
        uploadedBy: picObj.user.username,
      });
    }

  });

  if (noResult) return res.status(404).json({ error: 'No result' });

  const recent_model = new Recents({ searchQuery: query });
  try { await recent_model.save(); } 
  catch (err) { return res.status(400).json({ error: err.message }); }
  
  res.status(200).json(resObj);
});

function validateRequest(req, res, next) {
  const sizes = ['all', 'small', 'regular', 'full'];
  const page = req.query.page || '1',
  imgCount = req.query.imgCount || '12',
  imgSize = req.query.imgSize || 'all',
  numberRegex = new RegExp('^[0-9]+$');

  let errMsg;

  if (!numberRegex.test(page)) errMsg = 'Page is not a number';
  else if (parseInt(page) < 1 || parseInt(page) > 100) errMsg = 'Page is not equal or between 1 to 100';

  if (!numberRegex.test(imgCount)) errMsg = 'Image count is not a number';
  else if (parseInt(imgCount) < 1 || parseInt(imgCount) > 100) errMsg = 'Image count is not equal or between 1 to 100';

  if (!sizes.includes(imgSize.toLowerCase())) errMsg = 'Image size is invalid';

  if (errMsg) return res.status(400).json({ error: errMsg });
  next();
}


export default router;