const express = require("express");
const Student =require("../models/student.model");
const router = express.Router();
const config = require("../config");
const multer = require("multer");
const path = require("path");
const formidable = require('formidable');
const fs = require('fs');

 
 router.route("/loginRegNum").post(async (req, res) => {
  try {
    const result = await Student.findOne({ RegNum: req.body.RegNum });

    if (result === null) {
      return res.status(403).json("ID is incorrect");
    }

    if (result.Password === req.body.Password) {
      // Implement JWT token functionality here
      //let token = jwt.sign({ RegNum: req.body.RegNum }, config.key, {});
      console.log("login!");
      res.status(200).json("Sucess login");
      /*res.json({
        token: token,
        msg: "success",
      });*/
    } else {
      res.status(403).json("Password is incorrect");
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
      cb(null, req.body.RegNum + ".jpg");
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
      const student = await Student.findOneAndUpdate(
        { RegNum: req.body.RegNum },
        {
          $set: {
            img: req.file.path,
          },
        },
        { new: true }
      );
  
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
  
      const response = {
        message: "Image added and profile updated successfully",
        data: student,
      };
  
      res.status(200).json(response);
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: error.message });
      
    }
  });

router.route("/register").post(async (req,res) => {
  console.log("inside sign up");
  //const RegNum :req.body.RegNum;
  //const SEmail : req.body;
  const existingRegNum = await Student.findOne({ RegNum: req.body.RegNum  });
  const existingSEmail = await Student.findOne({ SEmail : req.body.SEmail});
  if (existingRegNum) {
    // The RegNum already exists, so respond with a conflict status
    console.log("RegNum already registered");
    return res.status(409).json({ message: "RegNum already registered" });
  }

  if (existingSEmail ) {
    // The SEmail already exists, so respond with a conflict status
    console.log("SEmail already registered");    
    return res.status(409).json({ message: "SEmail already registered" });
  }

 const student = new Student(
  {
    RegNum :req.body.RegNum,
    fname : req.body.fname,
    lname : req.body.lname,
    BD : req.body.BD,
    city : req.body.city,
    gender : req.body.gender,
    SEmail : req.body.SEmail,
    SPhone : req.body.SPhone,
    Password : req.body.Password,
    Major :req.body.Major,
    GPa : req.body.GPa,
    Interests : req.body.Interests,
    
 });
 student.save().then(() => {
    console.log("Registerd!");
    res.status(200).json("ok");
 })
 .catch((err) => {
    res.status(403).json({ msg : err});
 })

 //res.json("Registerd");
});

module.exports = router;