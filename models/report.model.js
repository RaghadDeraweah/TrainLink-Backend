const mongoose =require("mongoose");
const Schema = mongoose.Schema ;
const Report = Schema({
    groupid: {
        type: String,
        require : true,
        unique : false,
    },
    StuId : {
        type : String,
        require :true,
        unique : false,
    },
    StuName : {
        type : String,
        require :true,
        unique : false,
    },
    StuImg : {
        type : String,
        require :true,
        unique : false,
    },
    week : {
        type : String,
        require :true,
        unique : false,
    },
    postDate :{
        type : Date,
        require :true,
    },
    hours: {
        type: String,
        default: "",
    },
    actualhours: {
        type: String,
        default: "",
    },
    companyFeedback :{
        type: String,
        default: "",
    },
    universityFeedback :{
        type: String,
        default: "",
    },
    companyApproval :{
        type: Boolean,
        default: false,
    },
    universityApproval :{
        type: Boolean,
        default: false,
    },
    DaysOfWeek :{
        type: String,
        require :true,
    },
    nonattendancehours :{
        type: String,
        require :true,
    },
    excuse :{
        type: String,
        require :true,
    },
    work :{
        type: String,
        require :true,
    },

});
module.exports = mongoose.model("Report",Report);