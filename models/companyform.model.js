const mongoose =require("mongoose");
const Schema = mongoose.Schema ;
const companyForm = Schema({
    CID :{
        type: String,
        require : true,
        unique : false,
    },
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
    postDate :{
        type : Date,
        require :true,
    },
    hours :{
        type : String,
        require :true,
    },
    q1 :{
        type: String,
        default: "",
    },
    q2 :{
        type: String,
        default: "",
    },
    q3 :{
        type: String,
        default: "",
    },
    q4 :{
        type: String,
        default: "",
    },
    mark :{
        type:Number,
    },
    submitedReports :{
        type:Number,
    },
    universityApproval :{
        type: Boolean,
        default: false,
    },

});
module.exports = mongoose.model("companyForm",companyForm);