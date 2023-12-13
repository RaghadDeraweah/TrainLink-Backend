const express = require("express");
const Report =require("../models/report.model");
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
    const newReport = new Report({
        groupid: req.body.groupid,
        StuId: req.body.StuId,
        StuName: req.body.StuName,
        StuImg: req.body.StuImg,
        week: req.body.week,
        postDate: new Date(), 
        hours : req.body.hours,
        DaysOfWeek: req.body.DaysOfWeek,
        nonattendancehours: req.body.nonattendancehours,
        excuse:req.body.excuse,
        work:req.body.work,
        
    });
    
    // Save the new post to the database
    newReport.save()
        .then(savedPost => {
            console.log('report created:');
            res.status(200).json(newReport._id);
        })
        .catch(error => {
            console.error('Error creating report:', error);
        });
  
});
const storagereports = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './reportsuploads'); // Specify the directory to save the files
    },
    filename: function (req, file, cb) {
      cb(null, req.body._id+ ".pdf");
    },
  });
  
const uploadreport = multer({ storage: storagereports });
  
router.patch('/add/reportpdf', uploadreport.single('file'), async (req, res) => {
    try {
      const report = await Report.findOneAndUpdate(
        { _id: req.body._id ,StuId: req.body.StuId, week: req.body.week},
        {
          $set: {
            reportpdf: req.file.path,
          },
        },
        { new: true }
      );
  
      if (!report) {
        return res.status(404).json({ message: "report not found" });
      }
  
      const response = {
        message: "pdf added and report updated successfully",
        data: report,
      };
  
      res.status(200).json(response);
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: error.message });
      
    }
  
  });
router.put('/companyfeedback/:actualhours/:_id', async (req, res) => {
    const _id = req.params._id;
    const { companyFeedback } = req.body;
    const  companyApproval  = true;
    const actualhours =req.params.actualhours;
  
    try {
      // Find the post by ID and update the isFreezed field
      const updatedReport = await Report.findByIdAndUpdate(
        _id,
        { $set: { companyFeedback,actualhours ,companyApproval} },
        { new: true } // Return the updated document
      );
  
      if (!updatedReport) {
        return res.status(404).json({ message: 'Report not found' });
      }
  
      res.json(updatedReport);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
router.put('/universityfeedback/:_id', async (req, res) => {
    const _id = req.params._id;
    const { universityFeedback } = req.body;
    const { universityApproval } = true;
  
    try {
      // Find the post by ID and update the isFreezed field
      const updatedReport = await Report.findByIdAndUpdate(
        _id,
        { $set: { universityFeedback ,universityApproval} },
        { new: true } // Return the updated document
      );
  
      if (!updatedReport) {
        return res.status(404).json({ message: 'Report not found' });
      }
  
      res.json(updatedReport);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
router.get('/reports/:groupid', async (req, res) => {
    try {
      console.log("inside get reports");
      const report = await Report.find({ groupid: req.params.groupid });
  
      if (!report) {
        return res.status(404).json({ error: 'No posts found for the specified cid.' });
      }
  
      const reportsList = Array.isArray(report) ? report : [report];
      const currentTime = dayjs(); // Current time

      const formattedReports = reportsList.map((report) => ({
        _id :report._id,
        groupid: report.groupid,
        StuId: report.StuId,
        StuName: report.StuName,
        StuImg: report.StuImg,
        week: report.week,
        postDate: dayjs(report.postDate).from(currentTime),
        hours : report.hours,
        actualhours: report.actualhours,
        companyFeedback: report.companyFeedback,
        universityFeedback: report.universityFeedback,
        companyApproval: report.companyApproval,
        universityApproval: report.universityApproval, // Fixed typo: "field" instead of "feild"
        DaysOfWeek: report.DaysOfWeek,
        nonattendancehours: report.nonattendancehours,
        excuse: report.excuse,
        work: report.work,
 
      }));
  
      // Send the list of maps as the response
      res.json(formattedReports);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while retrieving reports.' });
    }
  });
router.get('/reportsweek/:groupid/:week', async (req, res) => {
    try {
      console.log("inside get reports");
      const report = await Report.find({ groupid: req.params.groupid ,week: req.params.week});
  
      if (!report) {
        return res.status(404).json({ error: 'No posts found for the specified cid.' });
      }
  
      const reportsList = Array.isArray(report) ? report : [report];
      const currentTime = dayjs(); // Current time

      const formattedReports = reportsList.map((report) => ({
        _id :report._id,
        groupid: report.groupid,
        StuId: report.StuId,
        StuName: report.StuName,
        StuImg: report.StuImg,
        week: report.week,
        postDate: dayjs(report.postDate).from(currentTime),
        hours : report.hours,
        actualhours: report.actualhours,
        companyFeedback: report.companyFeedback,
        universityFeedback: report.universityFeedback,
        companyApproval: report.companyApproval,
        universityApproval: report.universityApproval, // Fixed typo: "field" instead of "feild"
        DaysOfWeek: report.DaysOfWeek,
        nonattendancehours: report.nonattendancehours,
        excuse: report.excuse,
        work: report.work,
 
      }));
  
      // Send the list of maps as the response
      res.json(formattedReports);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while retrieving reports.' });
    }
  });
router.get('/reportstudent/:groupid/:week/:StuId', async (req, res) => {
    try {
      console.log("inside get reports");
      const report = await Report.find({ groupid: req.params.groupid ,StuId: req.params.StuId,week: req.params.week,});
  
      if (!report) {
        return res.status(404).json({ error: 'No posts found for the specified cid.' });
      }
  
      const reportsList = Array.isArray(report) ? report : [report];
      const currentTime = dayjs(); // Current time

      const formattedReports = reportsList.map((report) => ({
        _id :report._id,
        groupid: report.groupid,
        StuId: report.StuId,
        StuName: report.StuName,
        StuImg: report.StuImg,
        week: report.week,
        hours : report.hours,
        actualhours: report.actualhours,
        postDate: dayjs(report.postDate).from(currentTime),
        companyFeedback: report.companyFeedback,
        universityFeedback: report.universityFeedback,
        companyApproval: report.companyApproval,
        universityApproval: report.universityApproval, // Fixed typo: "field" instead of "feild"
        DaysOfWeek: report.DaysOfWeek,
        nonattendancehours: report.nonattendancehours,
        excuse: report.excuse,
        work: report.work,
 
      }));
  
      // Send the list of maps as the response
      res.json(formattedReports);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while retrieving reports.' });
    }
  });
/*  router.get('/reportstudent/:groupid/:week/:StuId', async (req, res) => {
    try {
        //const _id = req.params._id;
      console.log("inside get goup#"+req.params._id);
   /*   if (!ObjectId.isValid(req.params._id)) {
        return res.status(400).json({ error: "Invalid ObjectId format." });
      }
      const group = await Report.findOne({ groupid: req.params.groupid ,StuId: req.params.StuId,week: req.params.week, });
    
      if (group) {
        res.json(group);
      } else {
        return res.status(404).json({ error: 'No report found for the specified _id.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while retrieving group.' });
    }
  });*/
router.get('/reports/:groupid/:StuId', async (req, res) => {
    try {
      console.log("inside get reports");
      const report = await Report.find({ groupid: req.params.groupid ,StuId: req.params.StuId,});
  
      if (!report) {
        return res.status(404).json({ error: 'No posts found for the specified cid.' });
      }
  
      const reportsList = Array.isArray(report) ? report : [report];
      const currentTime = dayjs(); // Current time

      const formattedReports = reportsList.map((report) => ({
        _id :report._id,
        groupid: report.groupid,
        StuId: report.StuId,
        StuName: report.StuName,
        StuImg: report.StuImg,
        week: report.week,
        postDate: dayjs(report.postDate).from(currentTime),
        hours : report.hours,
        actualhours: report.actualhours,
        companyFeedback: report.companyFeedback,
        universityFeedback: report.universityFeedback,
        companyApproval: report.companyApproval,
        universityApproval: report.universityApproval, // Fixed typo: "field" instead of "feild"
        DaysOfWeek: report.DaysOfWeek,
        nonattendancehours: report.nonattendancehours,
        excuse: report.excuse,
        work: report.work,
 
      }));
  
      // Send the list of maps as the response
      res.json(formattedReports);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while retrieving reports.' });
    }
  });

module.exports = router;