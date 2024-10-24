const express = require("express");
const companyForm =require("../models/companyform.model");
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
    console.log("inside add companyForm");
    //console.log(req.body.lockDate);
    const newForm = new companyForm({
        CID: req.body.CID,
        groupid: req.body.groupid,
        StuId: req.body.StuId,
        StuName: req.body.StuName,
        StuImg: req.body.StuImg,
        postDate: new Date(), 
        hours : req.body.hours,
        isUni : req.body.isUni,
        q1 : req.body.q1,
        q2 : req.body.q2,
        q3 : req.body.q3,
        q4 : req.body.q4,
        q5 : req.body.q5,
        q6 : req.body.q6,
        q7 : req.body.q7,
        q8 : req.body.q8,
        q9 : req.body.q9,
        q10 : req.body.q10,
        q11 : req.body.q11,
        q12 : req.body.q12,
        q13 : req.body.q13,
        q14 : req.body.q14,
        q15 : req.body.q15,
        q16 : req.body.q16,
        t1 : req.body.t1,
        t2 : req.body.t2,
        t3 : req.body.t3,
        t4 : req.body.t4,
        t5 : req.body.t5,
        t6 : req.body.t6,
        t7 : req.body.t7,
        t8 : req.body.t8,
        t9 : req.body.t9,
        t10 : req.body.t10,
        t11 : req.body.t11,
        s12 : req.body.s12,
        s13 : req.body.s13,
        s14 : req.body.s14,
        s15 : req.body.s15,
        universityApproval : false,
        mark : req.body.mark,
        submitedReports : req.body.submitedReports,

        
    });
    
    // Save the new post to the database
    newForm.save()
        .then(savedPost => {
            console.log('report created:');
            res.status(200).json(newForm._id);
        })
        .catch(error => {
            console.error('Error creating form:', error);
        });
  
});
router.get('/forms/:groupid', async (req, res) => {
    try {
      console.log("inside get companyforms");
      const form = await companyForm.find({ groupid: req.params.groupid });
  
      if (!form) {
        return res.status(404).json({ error: 'No forms found for the specified groupid.' });
      }
  
      const formsList = Array.isArray(form) ? form : [form];
      const currentTime = dayjs(); // Current time

      const formattedReports = formsList.map((form) => ({
        _id: form._id,
        CID :form.CID,
        groupid: form.groupid,
        StuId: form.StuId,
        StuName: form.StuName,
        StuImg: form.StuImg,
        postDate: dayjs(form.postDate).from(currentTime),
        hours : form.hours,
        isUni : req.body.isUni,        
        q1: form.q1,
        q2: form.q2,
        q3: form.q3,
        q4: form.q4,
        q5 : form.q5,
        q6 : form.q6,
        q7 : form.q7,
        q8 : form.q8,
        q9 : form.q9,
        q10 : form.q10,
        q11 : form.q11,
        q12 : form.q12,
        q13 : form.q13,
        q14 : form.q14,
        q15 : form.q15,
        q16 : form.q16,
        t1 : form.t1,
        t2 : form.t2,
        t3 : form.t3,
        t4 : form.t4,
        t5 : form.t5,
        t6 : form.t6,
        t7 : form.t7,
        t8 : form.t8,
        t9 : form.t9,
        t10 : form.t10,
        t11 : form.t11,
        s12 : form.s12,
        s13 : form.s13,
        s14 : form.s14,
        s15 : form.s15,        
        mark: form.mark,
        submitedReports: form.submitedReports,
        universityApproval: form.universityApproval, // Fixed typo: "field" instead of "feild"
 
      }));
  
      // Send the list of maps as the response
      res.json(formattedReports);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while retrieving forms.' });
    }
});
router.get('/all', async (req, res) => {
    try {
        console.log("inside get posts");
      // Use the Mongoose .find() method to retrieve posts
      const posts = await companyForm.find();
      const currentTime = dayjs();
      // Format the posts as a list of maps (JavaScript objects)
      const postsList = posts.map(form => {
        return {
          _id: form._id,
          CID :form.CID,
          groupid: form.groupid,
          StuId: form.StuId,
          StuName: form.StuName,
          StuImg: form.StuImg,
          postDate: dayjs(form.postDate).from(currentTime),
          hours : form.hours,
          isUni : req.body.isUni,        
          q1: form.q1,
          q2: form.q2,
          q3: form.q3,
          q4: form.q4,
          q5 : form.q5,
          q6 : form.q6,
          q7 : form.q7,
          q8 : form.q8,
          q9 : form.q9,
          q10 : form.q10,
          q11 : form.q11,
          q12 : form.q12,
          q13 : form.q13,
          q14 : form.q14,
          q15 : form.q15,
          q16 : form.q16,
          t1 : form.t1,
          t2 : form.t2,
          t3 : form.t3,
          t4 : form.t4,
          t5 : form.t5,
          t6 : form.t6,
          t7 : form.t7,
          t8 : form.t8,
          t9 : form.t9,
          t10 : form.t10,
          t11 : form.t11,
          s12 : form.s12,
          s13 : form.s13,
          s14 : form.s14,
          s15 : form.s15,        
          mark: form.mark,
          submitedReports: form.submitedReports,
          universityApproval: form.universityApproval, 
        };
      });
  
      // Send the list of maps as the response
      res.json(postsList);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while retrieving forms.' });
    }
});
router.put('/uniapproval/:_id', async (req, res) => {
  console.log("updatee form");
  const _id = req.params._id;
  const { universityApproval } = req.body;

  try {
    // Find the post by ID and update the isFreezed field
    const updatedPost = await companyForm.findByIdAndUpdate(
      _id,
      { $set: { universityApproval } },
      { new: true } // Return the updated document
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'form not found' });
    }

    res.json(updatedPost);
    console.log("ini form updated ");
    console.log(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = router;