const express = require("express");
const Post =require("../models/post.model");
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

router.route("/addpost").post(async (req,res) => {
    console.log("inside Add post");

   const post = new Post(
    {
      cid : req.body.cid,
      cname : req.body.cname,
      cimg : req.body.cimg,
      appliedStuId : req.body.appliedStuId,
      lockDate : req.body.lockDate,
      postContent : req.body.postContent,
      postDate : dayjs(),
      location : req.body.location,
      seats : req.body.seats,
      feild : req.body.feild,
      isFreezed : false, 
      isRemotly : req.body.isRemotly, 
      isUni : req.body.isUni, 
      hours: req.body.hours,
      semester : req.body.semester,
      hasgroup:false,
           
   });
   post.save().then(() => {
      console.log("posted!");
      res.status(200).json("ok");
   })
   .catch((err) => {
      res.status(403).json({ msg : err});
   })
  
   //res.json("Registerd");
  });
  
router.get('/posts', async (req, res) => {
    try {
        console.log("inside get posts");
      // Use the Mongoose .find() method to retrieve posts
      const posts = await Post.find();
      const currentTime = dayjs();
      // Format the posts as a list of maps (JavaScript objects)
      const postsList = posts.map(post => {
        return {
          _id :post._id,
          cid: post.cid,
          cname: post.cname,
          cimg: post.cimg,
          appliedStuId: post.appliedStuId,
          lockDate: dayjs(post.lockDate).format('YYYY-MM-DD'),
          //DateFormat('yyyy-MM-dd').format(post.lockDate),
          //String formattedDate = DateFormat('yyyy-MM-dd').format(postss[index]['lockDate']);
          postContent: post.postContent,
          postDate: dayjs(post.postDate).from(currentTime),
          postImg: post.postImg,
          location: post.location,
          seats: post.seats,
          field: post.field, // Fixed typo: "field" instead of "feild"
          isFreezed: post.isFreezed,
          isRemotly : post.isRemotly, 
          isUni : post.isUni,
          hasgroup: post.hasgroup, 
          hours: post.hours,
          semester : post.semester,
        };
      });
  
      // Send the list of maps as the response
      res.json(postsList);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while retrieving posts.' });
    }
  });
router.get('/posts/:cid', async (req, res) => {
    try {
      console.log("inside get posts");
      // Use the Mongoose .find() method to retrieve posts
      // const posts = await Post.find();
      const post = await Post.find({ cid: req.params.cid });
  
      if (!post) {
        return res.status(404).json({ error: 'No posts found for the specified cid.' });
      }
  
      const postsList = Array.isArray(post) ? post : [post];
      const currentTime = dayjs(); // Current time
//const publicationTime = dayjs(postData.publicationDate); // Post publication time
//const age = publicationTime.from(currentTime);
      const formattedPosts = postsList.map((post) => ({
        _id :post._id,
        cid: post.cid,
        cname: post.cname,
        cimg: post.cimg,
        appliedStuId: post.appliedStuId,
        lockDate: dayjs(post.lockDate).format('YYYY-MM-DD'),
        postContent: post.postContent,
        postDate: dayjs(post.postDate).from(currentTime),
        postImg: post.postImg,
        location: post.location,
        seats: post.seats,
        field: post.field, // Fixed typo: "field" instead of "feild"
        isFreezed: post.isFreezed,
        isRemotly : post.isRemotly, 
        isUni : post.isUni, 
        hasgroup: post.hasgroup,
        hours: post.hours,
        semester : post.semester,        
      }));
  
      // Send the list of maps as the response
      res.json(formattedPosts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while retrieving posts.' });
    }
  });
 
  router.route("/add").post(async (req,res) => {
    console.log("inside add post");
    
    // Create a new post
    const newPost = new Post({

        cid: req.body.cid,
        cname: req.body.cname,
        cimg: req.body.cimg,
        appliedStuId: [], // or specify any applied student IDs
        lockDate: req.body.lockDate, // Set your lock date
        postContent: req.body.postContent,
        postDate: new Date(), // Set current date or any specific date
        //postImg: ,
        location: req.body.location,
        seats: req.body.seats, // Number of available seats
        field: req.body.field,
        isFreezed: false, // Or a boolean value
        isRemotly : req.body.isRemotly, 
        isUni : req.body.isUni,
        hours: req.body.hours,
        semester : req.body.semester, 
        hasgroup : false,
    });
    
    // Save the new post to the database
    newPost.save()
        .then(savedPost => {
            console.log('Post created:');
            res.status(200).json(newPost._id);
        })
        .catch(error => {
            console.error('Error creating post:', error);
        });
  
});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, "post"+req.body._id + ".jpg");
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
    const post = await Post.findOneAndUpdate(
      { _id: req.body._id },
      {
        $set: {
          postImg: req.file.path,
        },
      },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }

    const response = {
      message: "Image added and post updated successfully",
      data: post,
    };

    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
    
  }
});
router.put('/lock/:_id', async (req, res) => {
  const _id = req.params._id;
  const { isFreezed } = req.body;

  try {
    // Find the post by ID and update the isFreezed field
    const updatedPost = await Post.findByIdAndUpdate(
      _id,
      { $set: { isFreezed } },
      { new: true } // Return the updated document
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.put('/updateReqstu/:_id', async (req, res) => {
  const _id = req.params._id;
  const { appliedStuId } = req.body;

  try {
    // Find the post by ID and update the isFreezed field
    const updatedPost = await Post.findByIdAndUpdate(
      _id,
      { $set: { appliedStuId } },
      { new: true } // Return the updated document
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.put('/hasgroup/:_id', async (req, res) => {
  const _id = req.params._id;
  const { hasgroup } = req.body;

  try {
    // Find the post by ID and update the isFreezed field
    const updatedPost = await Post.findByIdAndUpdate(
      _id,
      { $set: { hasgroup } },
      { new: true } // Return the updated document
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/post/:_id', async (req, res) => {
  try {
      console.log("inside get post data");
      console.log(req.params._id);
    const company = await Post.findOne({_id: req.params._id});
    if (company) {
      console.log("pass");
      console.log(company);
      res.json(company);
    } else {
      console.log("not pass");
      return null; // Return null if the company with the specified ID is not found
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while retrieving post info.' });
  }
});
  module.exports = router;



 
