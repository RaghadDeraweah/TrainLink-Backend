const mongoose =require("mongoose");
const Schema = mongoose.Schema ;
const Post = Schema({
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
    appliedStuId:{
        type: Array,
        require : false,   
    },
    lockDate : {
        type : Date,
        require :true,
        unique : false,
    },
    postContent : {
        type : String,
        require :true,
        unique : false,
    },
    postDate :{
        type : Date,
        require :true,
    },
    postImg :{
        type: String,
        default: "",
    },
    location : {
        type : String,
        require :true,
        unique : false,
    },
    seats :{
        type: Number,
        require : true,
    },
    field :{
        type : String,
        require :true,
        unique : false,

    },
    isFreezed :{
        type : Boolean,
        require :true,
        unique : false,
    },
    isRemotly :{
        type : Boolean,
        require :true,
        unique : false,
    },
    isUni :{
        type : Boolean,
        require :true,
        unique : false,
    },
    hasgroup :{
        type : Boolean,
        require :true,
        unique : false,
    },
    hours :{
        type: Number,
        require : true,
    },
    semester :{
        type : String,
        require :true,
        unique : false,

    },
});
//Student.index({ id: 1 });
module.exports = mongoose.model("Post",Post);