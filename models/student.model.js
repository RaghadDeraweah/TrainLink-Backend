const mongoose =require("mongoose");
const Schema = mongoose.Schema ;
const Student = Schema({
    RegNum :{
        type: String,
        require : true,
        unique :true,
        //indexedDB :true
    },
    fname : {
        type : String,
        require :true,
        unique : false,
    },
    lname : {
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
    gender :{
        type: String,
        require : true,
    },
    SEmail :{
        type: String,
        require : true,
    },
    SPhone :{
        type: String,
        require : true,
    },
    Password :{
        type: String,
        require : true,
    },
    Major :{
        type: String,
        require : true,
    },
    GPa :{
        type: String,
        require : false,
    },
    Interests :{
        type: Array,
        require : true,
    },
    img: {
        type: String,
        default: "",
    },

});
//Student.index({ id: 1 });
module.exports = mongoose.model("Student",Student);