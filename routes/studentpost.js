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
        title:req.body.title,
        content: req.body.content,
        projectlink: req.body.projectlink,
        postDate: new Date(), 
        frameworks: req.body.frameworks,
        likes:[],

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
        _id:post._id,
        RegNum :post.RegNum,
        sname: post.sname,
        simg: post.simg,
        title:post.title,        
        content: post.content,
        projectlink: post.projectlink,
        postDate: dayjs(post.postDate).from(currentTime),
        frameworks:post.frameworks,
        likes:post.likes
      
      }));
  
      // Send the list of maps as the response
      res.json(formattedPosts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while retrieving posts.' });
    }
  });
  router.put('/updatelikes/:_id', async (req, res) => {
    const { likes } = req.body;
  
    try {
      const updatedPost = await Studentpost.findOneAndUpdate(
        {_id :req.params._id},
        { $set: { likes } },
        { new: true } // Return the updated document
      );
  
      if (!updatedPost) {
        return res.status(404).json({ message: 'post not found' });
      }
  
      res.json(updatedPost);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  module.exports = router;