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
    Company.findOne({ RegNum: req.params.RegNum }, (err, result) => {
      if (err) return res.status(500).json({ msg: err });
      return res.json({
        data: result,
        SID: req.params.RegNum,
      });
    });
  });
router.route("/checkID").get( middleware.checkToken,  async(req, res) => {
  console.log(req.decoded.ID +"ppppppp");
  try {
    //const result = await Company.findOne({ ID: req.body.ID });
    console.log(req.decoded.ID +"ppppppp");
    const result = await Company.findOne({ ID: req.decoded.ID });

    if (!result) {
      return res.json({ Status: false, ID: req.decoded.ID });
    } else {
      return res.json({ Status: true, ID: req.decoded.ID });
    }
  } catch (err) {
    console.log(req.decoded.ID +"ppppppp");
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
});
router.get('/companies/:ID', async (req, res) => {
  try {
      console.log("inside get company data");
      console.log(req.params.ID);
    const company = await Company.findOne({ID: req.params.ID});
    if (company) {
      res.json(company);
    } else {
      return null; // Return null if the company with the specified ID is not found
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while retrieving company info.' });
  }
});


router.route("/LoginEmail").post(async (req, res) => {
  try {
    const result = await Company.findOne({ CEmail: req.body.CEmail });

    if (result === null) {
      return res.status(403).json("CEmail is incorrect");
    }

    if (result.Password === req.body.Password) {
      // Implement JWT token functionality here
      let token = jwt.sign({ CEmail: req.body.CEmail }, config.key, {});

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
router.route("/chekkid").post(async (req, res) => {
  try {
    const result = await Company.findOne({ ID: req.body.ID });

    if (result === null) {
      return res.status(403).json("ID is incorrect");
    }else{

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
    reason:"",
    deleted:false,
    isdeldete:false, 
 });
 company.save().then(() => {
    console.log("Registerd!");
    res.status(200).json("ok");
 })
 .catch((err) => {
    res.status(403).json({ msg : err});
 })

});
router.get('/all/companies', async (req, res) => {
  try {
    const companies = await Company.find({});
    res.json(companies);
  } catch (err) {
    console.error('Error retrieving companies:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.put('/delete/:ID', async (req, res) => {
  console.log("updatee for company delete");
  //const RegNum = req.params.RegNum;
  const { reason } = req.body.reason;
  const { deletedate } = req.body.deletedate;
  const { isdeldete } = true;
  //const  ID= req.params.ID;

  try {
    // Find the post by ID and update the isFreezed field
    const updatedstudent = await Company.findOneAndUpdate(
      {ID :req.params.ID},
      { $set: { reason ,deletedate,isdeldete} },
      { new: true } // Return the updated document
    );

    if (!updatedstudent) {
      return res.status(404).json({ message: 'company not found' });
    }

    res.json(updatedstudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.put('/deletenow/:ID', async (req, res) => {
  console.log("updatee for company finish deleteion");
  //const RegNum = req.params.RegNum;
  const { deleted } = true;
  //const  ID= req.params.ID;

  try {
    // Find the post by ID and update the isFreezed field
    const updatedstudent = await Company.findOneAndUpdate(
      {ID :req.params.ID},
      { $set: { deleted } },
      { new: true } // Return the updated document
    );

    if (!updatedstudent) {
      return res.status(404).json({ message: 'company not found' });
    }

    res.json(updatedstudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.put('/updatetrainee/:ID', async (req, res) => {
  //const RegNum = req.params.RegNum;
  console.log("inside updatetrainee");
  const { trainee } = req.body;

  try {
    // Find the post by ID and update the isFreezed field
    const updatedPost = await Company.findOneAndUpdate(
      {ID :req.params.ID},
      { $set: { trainee } },
      { new: true } // Return the updated document
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.put('/updaterating/:ID', async (req, res) => {
  //const RegNum = req.params.RegNum;
  const { rating } = req.body;

  try {
    // Find the post by ID and update the isFreezed field
    const updatedPost = await Company.findOneAndUpdate(
      {ID :req.params.ID},
      { $set: { rating } },
      { new: true } // Return the updated document
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = router;