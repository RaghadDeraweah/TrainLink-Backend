const mongoose =require("mongoose");
const Schema = mongoose.Schema ;
const companyForm = Schema({
    CID :{
        type: String,
        require : true,
        unique : false,
    },
    groupid: {
        type: String,
        require : true,
        unique : false,
    },
    StuId : {
        type : String,
        require :true,
        unique : false,
    },
    StuName : {
        type : String,
        require :true,
        unique : false,
    },
    StuImg : {
        type : String,
        require :true,
        unique : false,
    },
    postDate :{
        type : Date,
        require :true,
    },
    hours :{
        type : String,
        require :true,
    },
    isUni :{
        type : Boolean,
        require :true,
    },
    q1 :{
        type: String,
        default: "",
    },
    q2 :{
        type: String,
        default: "",
    },
    q3 :{
        type: String,
        default: "",
    },
    q4 :{
        type: String,
        default: "",
    },
    q5:{
        type: String,
        default: "",
    },
    q6 :{
        type: String,
        default: "",
    },
    q7 :{
        type: String,
        default: "",
    },
    q8 :{
        type: String,
        default: "",
    },
    q9 :{
        type: String,
        default: "",
    },
    q10 :{
        type: String,
        default: "",
    },
    q11:{
        type: String,
        default: "",
    },
    q12 :{
        type: String,
        default: "",
    }, 
    q13 :{
        type: String,
        default: "",
    },
    q14 :{
        type: String,
        default: "",
    },
    q15 :{
        type: String,
        default: "",
    }, 
    q16 :{
        type: String,
        default: "",
    }, 
    t1 :{
        type: String,
        default: "",
    },
    t2 :{
        type: String,
        default: "",
    },
    t3 :{
        type: String,
        default: "",
    },
    t4 :{
        type: String,
        default: "",
    },
    t5:{
        type: String,
        default: "",
    },
    t6 :{
        type: String,
        default: "",
    },
    t7 :{
        type: String,
        default: "",
    },
    t8 :{
        type: String,
        default: "",
    },
    t9 :{
        type: String,
        default: "",
    },
    t10 :{
        type: String,
        default: "",
    },
    t11:{
        type: String,
        default: "",
    },
    s12 :{
        type: String,
        default: "",
    }, 
    s13 :{
        type: String,
        default: "",
    },
    s14 :{
        type: String,
        default: "",
    },
    s15 :{
        type: String,
        default: "",
    }, 

    mark :{
        type:Number,
    },
    submitedReports :{
        type:Number,
    },
    universityApproval :{
        type: Boolean,
        default: false,
    },

});
module.exports = mongoose.model("companyForm",companyForm);