const express = require("express");
const Unistudents =require("../models/unistudents.model");
const config = require("../config");
const multer = require("multer");
const path = require("path");
const formidable = require('formidable');
const fs = require('fs');
const jwt = require("jsonwebtoken");
let middleware = require("../middleware");
const router = express.Router();
router.get('/all/students', async (req, res) => {
  try {
    const students = await Unistudents.find({});
    res.json(students);
  } catch (err) {
    console.error('Error retrieving students:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/students/:RegNum', async (req, res) => {
    try {
        console.log("inside get student data");
        console.log(req.params.RegNum);
      const student = await Unistudents.findOne({RegNum: req.params.RegNum});
      if (student) {
        res.json(student);
      } else {
        return null; // Return null if the student with the specified ID is not found
      }
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while retrieving student info.' });
    }
  });
router.route("/checkRegNum").post(async (req, res) => {
    try {
      console.log("Inside checking RegNum");
      const result = await Unistudents.findOne({ RegNum: req.body.RegNum });
  
      if (result === null) {
        console.log("ID not found");
        return res.status(403).json("ID not found");
        //console.log("ID is incorrect");
      }else {
        res.status(200).json("ID found");
      }

    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  });
router.route("/add").post(async (req,res) => {
    console.log("inside add stu ");  
   const student = new Unistudents(
    {
      RegNum :req.body.RegNum,
      city : req.body.city,
      SEmail : req.body.SEmail,
      Major :req.body.Major,
      GPa : req.body.GPa,
      stustatus : req.body.stustatus,
      startyear : req.body.startyear,
      graduationyear : req.body.graduationyear,
      finishedhours : req.body.finishedhours,
      universityTraining : req.body.universityTraining
      
   });
   student.save().then(() => {
      console.log("Registerd!");
      res.status(200).json("ok");
   })
   .catch((err) => {
      res.status(403).json({ msg : err});
   })
  });
  module.exports = router;