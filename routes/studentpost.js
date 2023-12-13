const express = require("express");
const Studentpost =require("../models/studentpost.model");
const router = express.Router();
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);
router.route("/add").post(async (req,res) => {
    console.log("inside add group post");

    const newPost = new Studentpost({
        RegNum: req.body.RegNum,
        sname: req.body.sname,
        simg: req.body.simg,
        content: req.body.content,
        projectlink: req.body.projectlink,
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
router.get('/posts/:RegNum', async (req, res) => {
    try {
      console.log("inside get posts");
      const post = await Studentpost.find({ RegNum: req.params.RegNum });
  
      if (!post) {
        return res.status(404).json({ error: 'No posts found for the specified RegNum.' });
      }
  
      const postsList = Array.isArray(post) ? post : [post];
      const currentTime = dayjs(); 
      const formattedPosts = postsList.map((post) => ({

        RegNum :post.RegNum,
        sname: post.sname,
        simg: post.simg,
        content: post.content,
        projectlink: post.projectlink,
        postDate: dayjs(post.postDate).from(currentTime),
      
      }));
  
      // Send the list of maps as the response
      res.json(formattedPosts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while retrieving posts.' });
    }
  });
  module.exports = router;