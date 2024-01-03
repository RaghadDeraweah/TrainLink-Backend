const express = require("express");
const Grouppost =require("../models/grouppost.model");
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
    console.log("inside add group post");

    const newPost = new Grouppost({
        groupid: req.body.groupid,
        cid: req.body.cid,
        cname: req.body.cname,
        cimg: req.body.cimg,
        content: req.body.content,
        postDate: new Date(), 

    });
    
    // Save the new post to the database
    newPost.save()
        .then(savedPost => {
            console.log('Group Post created:');
            res.status(200).json(newPost._id);
        })
        .catch(error => {
            console.error('Error creating group post:', error);
        });
  
});
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
      cb(null, "Gp"+req.body._id + ".jpg");
    },
  });
  
  const fileFilter = (req, file, cb) => {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 6,
    },
    // fileFilter: fileFilter,
  });
  
router.route("/add/image").patch(upload.single("img"), async (req, res) => {
    try {
      const post = await Grouppost.findOneAndUpdate(
        { _id: req.body._id },
        {
          $set: {
            postImg: req.file.path,
          },
        },
        { new: true }
      );
  
      if (!post) {
        return res.status(404).json({ message: "Group post not found" });
      }
  
      const response = {
        message: "Image added and group post updated successfully",
        data: post,
      };
  
      res.status(200).json(response);
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: error.message });
      
    }
  });
router.get('/posts/:groupid', async (req, res) => {
    try {
      console.log("inside get group posts");
      // Use the Mongoose .find() method to retrieve posts
      // const posts = await Post.find();
      const post = await Grouppost.find({ groupid: req.params.groupid });
  
      if (!post) {
        return res.status(404).json({ error: 'No group posts found for the specified groupid.' });
      }
  
      const postsList = Array.isArray(post) ? post : [post];
      const currentTime = dayjs(); // Current time
//const publicationTime = dayjs(postData.publicationDate); // Post publication time
//const age = publicationTime.from(currentTime);
      const formattedPosts = postsList.map((post) => ({
        _id:post._id,
        groupid :post.groupid,
        cid: post.cid,
        cname: post.cname,
        cimg: post.cimg,
        content: post.content,
        postDate: dayjs(post.postDate).from(currentTime),
        postImg: post.postImg,
  

      }));
  
      // Send the list of maps as the response
      res.json(formattedPosts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while retrieving group posts.' });
    }
  });
  router.get('/postsid/:cid', async (req, res) => {
    try {
      console.log("inside get group posts");
      // Use the Mongoose .find() method to retrieve posts
      // const posts = await Post.find();
      const post = await Grouppost.find({ cid: req.params.cid });
  
      if (!post) {
        return res.status(404).json({ error: 'No group posts found for the specified groupid.' });
      }
  
      const postsList = Array.isArray(post) ? post : [post];
      const currentTime = dayjs(); // Current time
//const publicationTime = dayjs(postData.publicationDate); // Post publication time
//const age = publicationTime.from(currentTime);
      const formattedPosts = postsList.map((post) => ({
        _id:post._id,
        groupid :post.groupid,
        cid: post.cid,
        cname: post.cname,
        cimg: post.cimg,
        content: post.content,
        postDate: dayjs(post.postDate).from(currentTime),
        postImg: post.postImg,


      }));
  
      // Send the list of maps as the response
      res.json(formattedPosts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while retrieving group posts.' });
    }
  });
  module.exports = router;
 
