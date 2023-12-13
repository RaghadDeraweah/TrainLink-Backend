const express = require("express");
const GrouptaskSubmission =require("../models/tasksubmission.model");
const config = require("../config");
const multer = require("multer");
const path = require("path");
const formidable = require('formidable');
const fs = require('fs');
const jwt = require("jsonwebtoken");
let middleware = require("../middleware");
const router = express.Router();
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);
router.route("/add").post(async (req,res) => {
    console.log("inside add Task sub");
    //console.log(req.body.lockDate);
    const newSub = new GrouptaskSubmission({
        groupid: req.body.groupid,
        TaskId: req.body.TaskId,
        StuId: req.body.StuId,
        postDate: new Date(), 
        taskLink: req.body.taskLink,
        notes: req.body.notes,
        
    });
    
    // Save the new post to the database
    newSub.save()
        .then(savedPost => {
            console.log('submission created:');
            res.status(200).json(newSub._id);
        })
        .catch(error => {
            console.error('Error creating group Task:', error);
        });
  
});
router.get('/tasks/:groupid/:TaskId', async (req, res) => {
    try {
      console.log("inside get submissions");
      console.log(req.params.groupid );
      console.log(req.params.TaskId );
      // Use the Mongoose .find() method to retrieve posts
      // const posts = await Post.find();
      const tasksub = await GrouptaskSubmission.find({ groupid: req.params.groupid , TaskId: req.params.TaskId});
  
      if (!tasksub) {
        return res.status(404).json({ error: 'No group tasksub found for the specified groupid.' });
      }
  
      const tasksList = Array.isArray(tasksub) ? tasksub : [tasksub];
      const currentTime = dayjs(); // Current time
//const publicationTime = dayjs(postData.publicationDate); // Post publication time
//const age = publicationTime.from(currentTime);
      const formattedTasks = tasksList.map((tasksub) => ({
        _id : tasksub._id,
        groupid :tasksub.groupid,
        TaskId: tasksub.TaskId,
        StuId: tasksub.StuId,
        postDate: dayjs(tasksub.postDate).from(currentTime),
        taskLink: tasksub.taskLink,
        notes: tasksub.notes,

      }));
      console.log(formattedTasks);
      // Send the list of maps as the response
      res.json(formattedTasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while retrieving group tasks subs.' });
    }
  });
router.get('/tasksforStu/:groupid/:StuId', async (req, res) => {
    try {
      console.log("inside get submissions");
      console.log(req.params.groupid );
      console.log(req.params.StuId );
      // Use the Mongoose .find() method to retrieve posts
      // const posts = await Post.find();
      const tasksub = await GrouptaskSubmission.find({ groupid: req.params.groupid , StuId: req.params.StuId});
  
      if (!tasksub) {
        return res.status(404).json({ error: 'No group tasksub found for the specified groupid & StuId.' });
      }
  
      const tasksList = Array.isArray(tasksub) ? tasksub : [tasksub];
      const currentTime = dayjs(); // Current time
//const publicationTime = dayjs(postData.publicationDate); // Post publication time
//const age = publicationTime.from(currentTime);
      const formattedTasks = tasksList.map((tasksub) => ({
        _id : tasksub._id,
        groupid :tasksub.groupid,
        TaskId: tasksub.TaskId,
        StuId: tasksub.StuId,
        postDate: dayjs(tasksub.postDate).from(currentTime),
        taskLink: tasksub.taskLink,
        notes: tasksub.notes,

      }));
      console.log(formattedTasks);
      // Send the list of maps as the response
      res.json(formattedTasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while retrieving group tasks subs.' });
    }
  });
module.exports = router;
