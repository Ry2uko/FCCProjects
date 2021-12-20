const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Log = require('../models/log');

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const user = new User({
    username: req.body.username
  });
  const log = new Log({
    "_id": user["_id"],
    "username": user["username"]
  });

  try {
    const newUser = await user.save();
    await log.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:_id', async (req, res) => {
  try {
    const user = await User.findById(req.params["_id"]);
    if (user == null) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:_id/logs/:from?/:to?/:limit?', getUserLog, async (req, res) => {
  // Multiple Filters
  if(req.query.from !== undefined) {
    const newLog = res.userlog.log.filter(obj => {
      const objDate = new Date(obj.date),
      filterDate =  new Date(req.query.from);

      return objDate >= filterDate;
    });
    res.userlog.log = newLog;
  }
  if(req.query.to !== undefined) {
    const newLog = res.userlog.log.filter(obj => {
      const objDate = new Date(obj.date),
      filterDate = new Date(req.query.to);

      return objDate <= filterDate;
    });
    res.userlog.log = newLog;
  }
  if(req.query.limit !== undefined) {
    res.userlog.log = res.userlog.log.slice(0, parseInt(req.query.limit));
  }

  res.json(res.userlog);
});

router.post('/:_id/exercises', getUserLog, async (req, res) => {

  // Check if date input is blank
  if(req.body.date === '') {
    req.body.date = new Date().toDateString();
  } else {
    const userDate = new Date(req.body.date).toDateString();
    if (userDate === "Invalid Date") {
      req.body.date = new Date().toDateString();
    } else {
      req.body.date = userDate;
    }
  }

  const exercise = {
    "description": req.body.description,
    "duration": parseInt(req.body.duration),
    "date": req.body.date
  };

  const exerciseLog = {
    "username": res.userlog.username,
    "description": exercise.description,
    "duration": exercise.duration,
    "date": exercise.date,
    "_id": res.userlog["_id"]
  }

  try {
    res.userlog.count += 1;
    res.userlog["log"].push(exercise);
    await res["userlog"].save();

    res.status(201).json(exerciseLog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getUserLog(req, res, next) {
  let userlog;
  try {
    userlog = await Log.findById(req.params["_id"]);
    if (userlog == null) {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.userlog = userlog;
  next();
}

module.exports = router;