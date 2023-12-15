const express = require("express");
const Student =require("../models/student.model");
const config = require("../config");
const multer = require("multer");
const path = require("path");
const formidable = require('formidable');
const fs = require('fs');
const jwt = require("jsonwebtoken");
let middleware = require("../middleware");
const router = express.Router();

router.route("/loginEmail").post(async (req, res) => {
  try {
    console.log("Inside Login stu via Email");
    const result = await Student.findOne({ SEmail: req.body.SEmail });

    if (result === null) {
      console.log("SEmail is incorrect");
      return res.status(403).json("SEmail is incorrect");
    }

    if (result.Password === req.body.Password) {
      // Implement JWT token functionality here
      let token = jwt.sign({ SEmail: req.body.SEmail }, config.key, {});
      console.log("login!");
      //res.status(200).json("Sucess login");
      res.json({
        token: token,
        msg: "success",
      });
    } else {
      res.status(403).json("Password is incorrect");
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}); 
 router.route("/loginRegNum").post(async (req, res) => {
  try {
    console.log("Inside Login stu via RegNum");
    const result = await Student.findOne({ RegNum: req.body.RegNum });

    if (result === null) {
      console.log("ID is incorrect");
      return res.status(403).json("ID is incorrect");
      //console.log("ID is incorrect");
    }

    if (result.Password === req.body.Password) {
      // Implement JWT token functionality here
      let token = jwt.sign({ RegNum: req.body.RegNum }, config.key, {});
      console.log("login!");
      //res.status(200).json("Sucess login");
      res.json({
        token: token,
        msg: "success",
      });
    } else {
      res.status(403).json("Password is incorrect");
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
router.get('/students/:RegNum', async (req, res) => {
  try {
      console.log("inside get student data");
      console.log(req.params.RegNum);
    const student = await Student.findOne({RegNum: req.params.RegNum});
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
    stustatus : req.body.stustatus,
    startyear : req.body.startyear,
    graduationyear : req.body.graduationyear,
    universityTraining : req.body.universityTraining,
    finishedGroups :[],
    //finishedGroups : req.body.finishedGroups,
    
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

// Define a route to get a specific student by RegNum
router.get('/:regNum', async (req, res) => {
  try {
    //const regNum = req.params.regNum;
    console.log(req.params.regNum);
    // Use the findOne method to find a student with the specified RegNum
    const student = await Student.findOne({ RegNum: req.params.regNum });

    if (student) {
      // If the student is found, send it as a JSON response
      //print(student);
      console.log(student);
      res.json(student);
    } else {
      // If no student is found, send a 404 Not Found response
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error retrieving student:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
const storagecv = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './cvsuploads'); // Specify the directory to save the files
  },
  filename: function (req, file, cb) {
    cb(null, req.body.RegNum + ".pdf");
  },
});

const uploadcv = multer({ storage: storagecv });

router.patch('/add/cv', uploadcv.single('file'), async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { RegNum: req.body.RegNum },
      {
        $set: {
          cv: req.file.path,
        },
      },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const response = {
      message: "cv added and profile updated successfully",
      data: student,
    };

    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
    
  }

});
router.put('/unitrain/:RegNum', async (req, res) => {
  console.log("updatee for stu unitrain");
 // const RegNum = req.params.RegNum;
  const { universityTraining } = req.body;

  try {
    // Find the post by ID and update the isFreezed field
    const updatedstudent = await Student.findOneAndUpdate(
      { RegNum : req.params.RegNum },
      { $set: { universityTraining } },
      { new: true } // Return the updated document
    );

    if (!updatedstudent) {
      return res.status(404).json({ message: 'stu not found' });
    }

    res.json(updatedstudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.put('/ingroup/:RegNum/:available', async (req, res) => {
  console.log("updatee for stu group+available="+req.params.available);
  //const RegNum = req.params.RegNum;
  const { groupid } = req.body;
  const  available= req.params.available;

  try {
    // Find the post by ID and update the isFreezed field
    const updatedstudent = await Student.findOneAndUpdate(
      {RegNum :req.params.RegNum},
      { $set: { groupid ,available} },
      { new: true } // Return the updated document
    );

    if (!updatedstudent) {
      return res.status(404).json({ message: 'stu not found' });
    }

    res.json(updatedstudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/all/students', async (req, res) => {
  try {
    const students = await Student.find({});
    res.json(students);
  } catch (err) {
    console.error('Error retrieving students:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.put('/inpost/:RegNum/:request', async (req, res) => {
  console.log("updatee for stu post+request="+req.params.request);
  //const RegNum = req.params.RegNum;
  const { postid } = req.body;
  const  request= req.params.request;

  try {
    // Find the post by ID and update the isFreezed field
    const updatedstudent = await Student.findOneAndUpdate(
      {RegNum :req.params.RegNum},
      { $set: { postid ,request} },
      { new: true } // Return the updated document
    );

    if (!updatedstudent) {
      return res.status(404).json({ message: 'stu not found' });
    }

    res.json(updatedstudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.put('/updateFinishedgroups/:RegNum', async (req, res) => {
  //const RegNum = req.params.RegNum;
  const { finishedGroups } = req.body;

  try {
    // Find the post by ID and update the isFreezed field
    const updatedPost = await Student.findOneAndUpdate(
      {RegNum :req.params.RegNum},
      { $set: { finishedGroups } },
      { new: true } // Return the updated document
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'stu not found' });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = router;