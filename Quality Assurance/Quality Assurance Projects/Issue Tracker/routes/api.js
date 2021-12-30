"use strict";
require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const conn = mongoose.connection;
conn.on("error", (err) => console.error(err));
conn.once("open", () => {
  console.log("Connected to Database");
});

const issueSchema = new mongoose.Schema({
  issue_title: {
    type: String,
    required: true,
  },
  issue_text: {
    type: String,
    required: true,
  },
  created_on: {
    type: String,
    default: new Date().toUTCString()
  },
  updated_on: {
    type: String,
    default: new Date().toUTCString()
  },
  created_by: {
    type: String,
    required: true,
  },
  assigned_to: {
    type: String,
    default: "",
  },
  open: {
    type: Boolean,
    default: true,
  },
  status_text: {
    type: String,
    default: "",
  },
});

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(getModel, async (req, res) => {
      const ProjectModel = res.locals.ProjectModel;
      try {
        let issues = await ProjectModel.find();

        if(req.query) {
          Object.keys(req.query).forEach(key => {
            const newIssue = issues.filter(obj => {
              if(req.query[key] === "true") {
                req.query[key] = true; // "true" == true
              } else if (req.query[key] === "false") {
                req.query[key] = false; // "false" == false
              }

              return obj[key] == req.query[key]
            });
            issues = newIssue;
          });
          res.json(issues);
        } else {
        res.json(issues);
        }
      } catch (err) {
        res.json({ error: err.message });
      }
    })

    .post(getModel, async (req, res) => {
      const ProjectModel = res.locals.ProjectModel;

      if (
        !(req.body.issue_title && req.body.issue_text && req.body.created_by)
      ) {
        return res.json({ error: "required field(s) missing" });
      }

      const issue = new ProjectModel({
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text,
      });

      try {
        const newIssue = await issue.save();
        res.json(newIssue);
      } catch (err) {
        res.json({ error: err.message });
      }
    })

    .put(getModel, (req, res) => {
      const ProjectModel = res.locals.ProjectModel;
      const newIssue = {};
      Object.keys(req.body).forEach(key => {
        if(req.body[key]) newIssue[key] = req.body[key];
      });

      if(!req.body._id) {
        return res.json({ error: "missing _id" });
      } else if(Object.keys(req.body).length < 2) {
        return res.json({
          error: "no update field(s) sent",
          _id: req.body._id
        });
      }

      newIssue['updated_on'] = new Date().toUTCString();
      
      ProjectModel.findByIdAndUpdate(
        req.body._id,
        newIssue,
        {new: true},
        (err, updatedIssue) => {
          if(!err && updatedIssue) {
            res.json({
              result: "successfully updated",
              _id: req.body._id
            });
          } else if (!updatedIssue) {
            return res.json({
              error: "could not update",
              _id: req.body._id
            });
          }
        }
      );

    })

    .delete(getModel, (req, res) => {
      const ProjectModel = res.locals.ProjectModel;

      if (!req.body._id) {
        return res.json({ error: "missing _id" });
      }

      ProjectModel.findByIdAndDelete(req.body._id, (err, deletedIssue) => {
        if (deletedIssue) {
          res.json({ result: "successfully deleted", _id: req.body._id });
        } else {
          res.json({ error: "could not delete", _id: req.body._id });
        }
      });
    });

  function getModel(req, res, next) {
    const project = req.params.project;
    res.locals.ProjectModel = mongoose.model(project, issueSchema);
    next();
  }
};
