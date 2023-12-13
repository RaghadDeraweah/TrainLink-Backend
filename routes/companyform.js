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
        q1 : req.body.q1,
        q2 : req.body.q2,
        q3 : req.body.q3,
        q4 : req.body.q4,
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
        q1: form.q1,
        q2: form.q2,
        q3: form.q3,
        q4: form.q4,
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
module.exports = router;