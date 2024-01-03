const express = require("express");
const Partnership =require("../models/partnerships.model");
const router = express.Router();
router.route("/add").post(async (req,res) => {
    console.log("inside add Partnership");
    const existingID = await Partnership.findOne({ ID : req.body.ID  });
    //const existingCEmail = await Company.findOne({ CEmail : req.body.CEmail});
    if (existingID) {
      // The RegNum already exists, so respond with a conflict status
      console.log("ID already registered");
      return res.status(409).json({ message: "ID already registered" });
    }
   const company = new Partnership(
    {
      ID :req.body.ID,
      Name : req.body.Name,
   });
   company.save().then(() => {
      console.log("Registerd!");
      res.status(200).json("ok");
   })
   .catch((err) => {
      res.status(403).json({ msg : err});
   })
  
  });
router.route("/checkID").post(async (req, res) => {
   try {
     console.log("Inside checking ID");
     const result = await Partnership.findOne({ ID: req.body.ID });
 
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
  module.exports = router;