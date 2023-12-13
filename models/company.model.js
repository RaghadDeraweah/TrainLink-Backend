const mongoose =require("mongoose");
const Schema = mongoose.Schema ;
const Company = Schema({
    ID :{
        type: String,
        require : true,
        unique :true,
        //indexedDB :true
    },
    Name : {
        type : String,
        require :true,
        unique : false,
    },
    CEmail :{
        type: String,
        require : true,
    },
    Work : {
        type : String,
        require :true,
        unique : false,
    },
    BD :{
        type : Date,
        require :true,
    },
    city : {
        type : String,
        require :true,
        unique : false,
    },
    CPhone :{
        type: String,
        require : true,
    },
    Password :{
        type: String,
        require : true,
    },
    website :{
        type: String,
        require : true,
    },
    img: {
        type: String,
        default: "",
    },
    reason :{
        type: String,
        default: "",       
    },
    deletedate :{
        type : Date,
        require : false,
    },
    deleted :{
        type: Boolean,
        default: false,
    },
    isdeldete :{
        type: Boolean,
        default: false,
    },
    trainee :{
        type : Array,
        default: [],
    },
    rating :{
        type : Array,
        default: [],
    }

});
//Student.index({ id: 1 });
module.exports = mongoose.model("Company",Company);