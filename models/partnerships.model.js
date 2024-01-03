const mongoose =require("mongoose");
const Schema = mongoose.Schema ;
const Partnership = Schema({
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
    isSignup :{
        type :Boolean,
        default:false,
    },
});
//Student.index({ id: 1 });
module.exports = mongoose.model("Partnership",Partnership);