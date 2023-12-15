const mongoose =require("mongoose");
const Schema = mongoose.Schema ;
const Unistudents = Schema({
    RegNum :{
        type: String,
        require : true,
        unique :true,
        //indexedDB :true
    },
    city : {
        type : String,
        require :true,
        unique : false,
    },
    SEmail :{
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
    stustatus: {
        type: String,
        default: "",
    },
    startyear :{
        type: String,
        default: "",
    },
    graduationyear : {
        type: String,
        default: "",
    },
    finishedhours : {
        type: String,
        default: "",
    },
    universityTraining: {
        type: Boolean,
    },

});
//Student.index({ id: 1 });
module.exports = mongoose.model("Unistudents",Unistudents);