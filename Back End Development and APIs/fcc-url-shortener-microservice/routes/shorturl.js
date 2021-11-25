const express = require('express');
const router = express.Router();
const URL = require('../models/url');

// Get All Url
router.get('/', async (req, res) => {
  try {
    const url = await URL.find();
    res.json(url);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

router.post('/', createId, async (req, res) => {
  let urlRegex = /^(http|https)(:\/\/)/;

  if(!urlRegex.test(req.body.url)) {
    return res.json({
      error: 'Invalid URL'
    });
  }

  const url = new URL({
    short_url: res.id,
    original_url: req.body.url
  });

  try {
    const newUrl = await url.save();
    res.status(201).json({
      short_url: res.id,
      original_url: req.body.url
    });
  } catch (err) {
    res.status(400).json({message: err.message });
  }

});

router.get('/test', createId, (req, res) => {
  res.send(res.id)
})

router.get('/:urlId', async (req, res) => {
  try {
    const url = await URL.find({short_url: req.params.urlId});
    
    if(url.length === 0) {
      res.status(404).send("Not Found");
    }

    res.redirect(url[0]["original_url"]);

  } catch (err) {
    res.status(400).json({message: err.message})
  }
});

async function createId(req, res, next) {
  let id;

  try {
    let url = await URL.find().sort({short_url: -1}).limit(1);

    if(url.length === 0) {
      id = "0";
    } else {
      id = parseInt(url[0]["short_url"]) + 1;
    }

  } catch (err) {
    res.status(500).json({message: err.message});
  }
  res.id = id
  next();
}

module.exports = router;