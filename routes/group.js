const express = require("express");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Group =require("../models/group.model");
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
    console.log("inside add group");
    
    // Create a new Group
    const newGroup = new Group({
      postid: req.body.postid,
        cid: req.body.cid,
        cname: req.body.cname,
        cimg: req.body.cimg,
        groupname: req.body.groupname,
        about: req.body.about,
        des: req.body.des, // Number of available seats
        membersStudent: req.body.membersStudent,
        membersStudentId: req.body.membersStudentId,
        islocked : false,
        phase: "Assessment",
    });
    
    // Save the new Group to the database
    newGroup.save()
        .then(savedGroup => {
            console.log('Group created:');
            res.status(200).json(newGroup._id);
        })
        .catch(error => {
            console.error('Error creating Group:', error);
        });
  
});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, "Group"+req.body._id + ".jpg");
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
    const group = await Group.findOneAndUpdate(
      { _id: req.body._id },
      {
        $set: {
          groupImg: req.file.path,
        },
      },
      { new: true }
    );

    if (!group) {
      return res.status(404).json({ message: "group not found" });
    }

    const response = {
      message: "Image added and group updated successfully",
      data: Group,
    };

    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
    
  }
});
router.get('/gruops/:cid', async (req, res) => {
    try {
      console.log("inside get goups");
      const group = await Group.find({ cid: req.params.cid });
      if (!group) {
        return res.status(404).json({ error: 'No groups found for the specified cid.' });
      } 
      const groupsList = Array.isArray(group) ? group : [group];
      const formattedgroups = groupsList.map((group) => ({
        _id: group._id,
        postid: group.postid,
        cid: group.cid,
        cname: group.cname,
        cimg: group.cimg,
        groupname:group.groupname,
        about: group.about,
        des: group.des,
        groupImg: group.groupImg, // Number of available seats
        membersStudent: group.membersStudent,
        membersStudentId: group.membersStudentId,
        islocked : group.islocked,
        phase:  group.phase,
        StartDate: dayjs(group.StartDate).format('YYYY-MM-DD'),
        EndDate: dayjs(group.EndDate).format('YYYY-MM-DD'),
      }));
      res.json(formattedgroups);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while retrieving groups.' });
    }
  });
router.get('/groupid/:_id', async (req, res) => {
    try {
        const _id = req.params._id;
      console.log("inside get goup#"+req.params._id);
   /*   if (!ObjectId.isValid(req.params._id)) {
        return res.status(400).json({ error: "Invalid ObjectId format." });
      }*/
      const group = await Group.findOne({ _id });
    
      if (group) {
        res.json(group);
      } else {
        return res.status(404).json({ error: 'No group found for the specified _id.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while retrieving group.' });
    }
  });  
router.put('/lock/:_id', async (req, res) => {
    const _id = req.params._id;
    const { islocked } = req.body;
  
    try {
      // Find the post by ID and update the isFreezed field
      const updatedGroup = await Group.findByIdAndUpdate(
        _id,
        { $set: { islocked } },
        { new: true } // Return the updated document
      );
  
      if (!updatedGroup) {
        return res.status(404).json({ message: 'group not found' });
      }
  
      res.json(updatedGroup);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
router.put('/updateReqstu/:_id', async (req, res) => {
    const _id = req.params._id;
    const { membersStudentId } = req.body;
  
    try {
      // Find the post by ID and update the isFreezed field
      const updatedPost = await Group.findByIdAndUpdate(
        _id,
        { $set: { membersStudentId } },
        { new: true } // Return the updated document
      );
  
      if (!updatedPost) {
        return res.status(404).json({ message: 'group not found' });
      }
  
      res.json(updatedPost);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  router.put('/updateReqstuMaps/:_id', async (req, res) => {
    const _id = req.params._id;
    const { membersStudent } = req.body;
  
    try {
      // Find the post by ID and update the isFreezed field
      const updatedPost = await Group.findByIdAndUpdate(
        _id,
        { $set: { membersStudent } },
        { new: true } // Return the updated document
      );
  
      if (!updatedPost) {
        return res.status(404).json({ message: 'group not found' });
      }
  
      res.json(updatedPost);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  router.put('/phase/:_id', async (req, res) => {
    const _id = req.params._id;
    const { phase } = req.body;
  
    try {
      // Find the post by ID and update the isFreezed field
      const updatedPost = await Group.findByIdAndUpdate(
        _id,
        { $set: { phase } },
        { new: true } // Return the updated document
      );
  
      if (!updatedPost) {
        return res.status(404).json({ message: 'group not found' });
      }
  
      res.json(updatedPost);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  router.put('/start/:_id', async (req, res) => {
    console.log("Inside edit start date");
    const _id = req.params._id;
    const StartDate  = dayjs();
  
    try {
      // Find the post by ID and update the isFreezed field
      const updatedPost = await Group.findByIdAndUpdate(
        _id,
        { $set: { StartDate } },
        { new: true } // Return the updated document
      );
  
      if (!updatedPost) {
        return res.status(404).json({ message: 'group not found' });
      }
  
      res.json(updatedPost);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  router.put('/end/:_id', async (req, res) => {
    const _id = req.params._id;
    const  EndDate  = dayjs();
  
    try {
      // Find the post by ID and update the isFreezed field
      const updatedPost = await Group.findByIdAndUpdate(
        _id,
        { $set: { EndDate } },
        { new: true } // Return the updated document
      );
  
      if (!updatedPost) {
        return res.status(404).json({ message: 'group not found' });
      }
  
      res.json(updatedPost);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  router.delete('/delete/:_id', async (req, res) => {
    const _id = req.params._id;

  
    try {
      // Find the post by ID and update the isFreezed field
      const result = await Group.deleteOne( { _id: new ObjectId(req.params._id) });
  
      if (result.deletedCount === 1) {
        res.status(200).json({ success: true, message: 'Document deleted successfully' });
      } else {
        res.status(404).json({ success: false, message: 'Document not found' });
      }
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
module.exports = router;