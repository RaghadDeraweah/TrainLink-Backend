const mongoose =require("mongoose");
const Schema = mongoose.Schema ;
const Studentpost = Schema({
    RegNum: {
        type: String,
        require : true,
        unique : false,
    },
    sname :{
        type: String,
        require : true,
        unique : false,
        //indexedDB :true
    },
    simg :{
        type: String,
        default: "",
    },
    title:{
        type : String,
        require :true,
        unique : false,
    },
    content : {
        type : String,
        require :true,
        unique : false,
    },
    projectlink : {
        type : String,
        require :true,
        unique : false,
    },
    postDate :{
        type : Date,
        require :true,
    },
    frameworks :{
        type: Array,
        require : true,
    },
    likes :{
        type: Array,
        require : true,
    },

});
module.exports = mongoose.model("Studentpost",Studentpost);