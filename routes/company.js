const express = require("express");
const Company =require("../models/company.model");
const config = require("../config");
const multer = require("multer");
const path = require("path");
const formidable = require('formidable');
const fs = require('fs');
const jwt = require("jsonwebtoken");
let middleware = require("../middleware");
const router = express.Router();
router.route("/:RegNum").get(middleware.checkToken, (req, res) => {
    User.findOne({ RegNum: req.params.RegNum }, (err, result) => {
      if (err) return res.status(500).json({ msg: err });
      return res.json({
        data: result,
        SID: req.params.RegNum,
      });
    });
  });
router.route("/checkusername/:RegNum").get((req, res) => {
    User.findOne({ RegNum: req.params.RegNum }, (err, result) => {
      if (err) return res.status(500).json({ msg: err });
      if (result !== null) {
        return res.json({
          Status: true,
        });
      } else
        return res.json({
          Status: false,
        });
    });
  });
/*app.post('/Company/upload', (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = __dirname + './uploads'; // Set the directory to save the files

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'File upload error' });
    }

    const RegNum = fields.id; // Company ID
    const file = files.image; // Uploaded file

    const oldPath = file.path;
    const newPath = `${form.uploadDir}/${id}.jpg`; // Rename the file with the Company ID

    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        return res.status(500).json({ error: 'File rename error' });
      }

      res.status(200).json({ message: 'Image uploaded and saved successfully' });
    });
  });
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




//const jwt = require("jsonwebtoken");
//const middleware = require("../middleware");
/*router.route("/:id").get(middleware.checkToken, (req, res) => {
   User.findOne({ id: req.params.id }, (err, result) => {
     if (err) return res.status(500).json({ msg: err });
     return res.json({
       data: result,
       id: req.params.id,
     });
   });
 });
 
 /*router.route("/checkid/:id").get((req, res) => {
   User.findOne({ id: req.params.id }, (err, result) => {
     if (err) return res.status(500).json({ msg: err });
     if (result !== null) {
       return res.json({
         Status: true,
       });
     } else
       return res.json({
         Status: false,
       });
   });
 });*/

/* router.route("/checkid/:RegNum").get(async (req, res) => {
  try {
    const result = await User.findOne({ RegNum: req.params.RegNum });

    if (result !== null) {
      res.json({
        Status: true,
      });
    } else {
      res.json({
        Status: false,
      });
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});*/

 
 router.route("/loginID").post(async (req, res) => {
  try {
    const result = await Company.findOne({ ID: req.body.ID });

    if (result === null) {
      return res.status(403).json("ID is incorrect");
    }

    if (result.Password === req.body.Password) {
      // Implement JWT token functionality here
      let token = jwt.sign({ ID: req.body.ID }, config.key, {});

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


  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
      cb(null, req.body.ID + ".jpg");
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
      const company = await Company.findOneAndUpdate(
        { ID: req.body.ID },
        {
          $set: {
            img: req.file.path,
          },
        },
        { new: true }
      );
  
      if (!company) {
        return res.status(404).json({ message: "company not found" });
      }
  
      const response = {
        message: "Image added and profile updated successfully",
        data: company,
      };
  
      res.status(200).json(response);
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: error.message });
      
    }
  });
  
router.route("/register").post(async (req,res) => {
  console.log("inside sign up");
  const existingID = await Company.findOne({ ID : req.body.ID  });
  const existingCEmail = await Company.findOne({ CEmail : req.body.CEmail});
  if (existingID) {
    // The RegNum already exists, so respond with a conflict status
    console.log("ID already registered");
    return res.status(409).json({ message: "ID already registered" });
  }

  if (existingCEmail ) {
    // The SEmail already exists, so respond with a conflict status
    console.log("CEmail already registered");    
    return res.status(409).json({ message: "CEmail already registered" });
  }

 const company = new Company(
  {
    ID :req.body.ID,
    Name : req.body.Name,
    CEmail : req.body.CEmail,
    Work : req.body.Work,
    BD : req.body.BD,
    city : req.body.city,
    CPhone : req.body.CPhone,
    Password : req.body.Password,
    Cwebsite :req.body.Cwebsite,    
 });
 company.save().then(() => {
    console.log("Registerd!");
    res.status(200).json("ok");
 })
 .catch((err) => {
    res.status(403).json({ msg : err});
 })

});

module.exports = router;