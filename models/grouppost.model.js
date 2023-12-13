const mongoose =require("mongoose");
const Schema = mongoose.Schema ;
const Grouppost = Schema({
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
    content : {
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



});
module.exports = mongoose.model("Grouppost",Grouppost);