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

});
module.exports = mongoose.model("Studentpost",Studentpost);