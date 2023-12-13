const mongoose =require("mongoose");
const Schema = mongoose.Schema ;
const GrouptaskSubmission = Schema({
    groupid: {
        type: String,
        require : true,
        unique : false,
    },
    TaskId : {
        type : String,
        require :true,
        unique : false,
    },
    StuId : {
        type : String,
        require :true,
        unique : false,
    },
    postDate :{
        type : Date,
        require :true,
    },
    notes :{
        type: String,
        default: "",
    },
    taskLink :{
        type: String,
        default: "",
    },

});
module.exports = mongoose.model("GrouptaskSubmission",GrouptaskSubmission);