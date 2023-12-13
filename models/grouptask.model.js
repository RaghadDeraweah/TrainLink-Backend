const mongoose =require("mongoose");
const Schema = mongoose.Schema ;
const Grouptask = Schema({
    groupid: {
        type: String,
        require : true,
        unique : false,
    },
    cid :{
        type: String,
        require : true,
        unique : false,
        //indexedDB :true
    },
    cname :{
        type: String,
        require : true,
    },
    cimg :{
        type: String,
        default: "",
    },
    TaskName : {
        type : String,
        require :true,
        unique : false,
    },
    lockDate :{
        type : Date,
        require :true,
    },
    TaskDes: {
        type : String,
        require :true,
        unique : false,
    },
    postDate :{
        type : Date,
        require :true,
    },
    TaskStatus: {
        type : String,
        require :true,
    },
    taskpdf :{
        type: String,
        default: "",
    },
    submitedStuId:{
        type: Array,
        require : false,   
        default: [],
    },

});
module.exports = mongoose.model("Grouptask",Grouptask);