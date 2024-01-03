const mongoose =require("mongoose");
const Schema = mongoose.Schema ;
const Group = Schema({
    postid: {
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
    groupname : {
        type : String,
        require :true,
        unique : false,
    },
    about :{
        type : String,
        require :true,
        unique : false,
    },
    des :{
        type : String,
        require :true,
        unique : false,
    },
    groupImg :{
        type: String,
        default: "",
    },
    membersStudent:{
        type: Array,
        require : false,   
    },
    membersStudentId:{
        type: Array,
        require : false,   
    },
    islocked :{
        type: Boolean,
        require : false,        
    },
    phase :{
        type: String,
        require : true,        
    },
    StartDate :{
        type : Date,
    },
    EndDate :{
        type : Date,
    },
    isDel :{
        type: Boolean,
        require : false,  
    },

});
module.exports = mongoose.model("Group",Group);