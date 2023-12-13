const express = require("express");
const Grouptask =require("../models/grouptask.model");
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
    console.log("inside add group Task");
    console.log(req.body.lockDate);
    const newTask = new Grouptask({
        groupid: req.body.groupid,
        cid: req.body.cid,
        cname: req.body.cname,
        cimg: req.body.cimg,
        TaskName: req.body.TaskName,
        lockDate: req.body.lockDate,
        TaskDes: req.body.TaskDes,
        postDate: new Date(), 
        TaskStatus :"To Do",
        
    });
    
    // Save the new post to the database
    newTask.save()
        .then(savedPost => {
            console.log('Group Task created:');
            res.status(200).json(newTask._id);
        })
        .catch(error => {
            console.error('Error creating group Task:', error);
        });
  
});

router.get('/tasks/:groupid', async (req, res) => {
    try {
      console.log("inside get group tasks");
      // Use the Mongoose .find() method to retrieve posts
      // const posts = await Post.find();
      const task = await Grouptask.find({ groupid: req.params.groupid });
  
      if (!task) {
        return res.status(404).json({ error: 'No group tasks found for the specified groupid.' });
      }
  
      const tasksList = Array.isArray(task) ? task : [task];
      const currentTime = dayjs(); // Current time
//const publicationTime = dayjs(postData.publicationDate); // Post publication time
//const age = publicationTime.from(currentTime);
      const formattedTasks = tasksList.map((task) => ({
        _id : task._id,
        groupid :task.groupid,
        cid: task.cid,
        cname: task.cname,
        cimg: task.cimg,
        TaskName: task.TaskName,
        lockDate:  dayjs(task.lockDate).format('YYYY-MM-DD'),
        TaskDes: task.TaskDes,
        postDate: dayjs(task.postDate).from(currentTime),
        TaskStatus: task.TaskStatus,
        taskpdf: task.taskpdf,
        submitedStuId: task.submitedStuId,

      }));
  
      // Send the list of maps as the response
      res.json(formattedTasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while retrieving group tasks.' });
    }
  });

const storagetasks = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './tasksuploads'); // Specify the directory to save the files
    },
    filename: function (req, file, cb) {
      cb(null, req.body._id+ ".pdf");
    },
  });
  
const uploadtask = multer({ storage: storagetasks });
  
router.patch('/add/taskpdf', uploadtask.single('file'), async (req, res) => {
    try {
      const task = await Grouptask.findOneAndUpdate(
        { _id: req.body._id },
        {
          $set: {
            taskpdf: req.file.path,
          },
        },
        { new: true }
      );
  
      if (!task) {
        return res.status(404).json({ message: "task not found" });
      }
  
      const response = {
        message: "pdf added and task updated successfully",
        data: task,
      };
  
      res.status(200).json(response);
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: error.message });
      
    }
  
  });
router.get('/tasks/:groupid/:_id', async (req, res) => {
    try {
      console.log("inside get group task "+req.params._id);
      // Use the Mongoose .find() method to retrieve posts
      // const posts = await Post.find();
      const task = await Grouptask.findOne({ groupid: req.params.groupid , _id : req.params._id});
      
  
      if (!task) {
        return res.status(404).json({ error: 'No group task found for the specified groupid & taskid.' });
      }
  
      // Send the list of maps as the response
      res.json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while retrieving group task.' });
    }
  });
router.put('/updateSubstu/:_id', async (req, res) => {
    const _id = req.params._id;
    const { submitedStuId } = req.body;
  
    try {
      // Find the post by ID and update the isFreezed field
      const updatedPost = await Grouptask.findByIdAndUpdate(
        _id,
        { $set: { submitedStuId } },
        { new: true } // Return the updated document
      );
  
      if (!updatedPost) {
        return res.status(404).json({ message: 'task not found' });
      }
  
      res.json(updatedPost);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  module.exports = router;
 
