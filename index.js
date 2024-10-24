const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const admin = require("firebase-admin");
const studentRoute = require("./routes/student");
const companyRoute = require("./routes/company");
const postRoute = require("./routes/posts");
const groupRoute = require("./routes/group");
const grouppostRoute = require("./routes/grouppost");
const grouptaskRoute = require("./routes/grouptask");
const tasksubmissionRoute = require("./routes/tasksubmission");
const reportRoute = require("./routes/report");
const companyFormRoute = require("./routes/companyform");
const StudentpostRoute = require("./routes/studentpost");
const notificationRoute = require("./routes/notification");
const unistudentsRoute = require("./routes/unistudents");
const PartnershipRoute = require("./routes/partnership");
const app=express();
const Port = process.env.port || 5000;
mongoose.connect('mongodb://127.0.0.1:27017/test1' ,{useNewUrlParser: true,
useUnifiedTopology: true,});
const corsOptions = {
    origin: 'http://localhost:49999',  // Replace with your Flutter web app's domain
  };
app.use(cors(corsOptions));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:49999');  // Replace with your Flutter web app's domain
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
//mongodb://localhost:27017
const connection =mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB connected");
});
app.use("/uploads", express.static("uploads"));
app.use("/cvsuploads", express.static("cvsuploads"));
app.use("/tasksuploads", express.static("tasksuploads"));
app.use("/reportsuploads", express.static("reportsuploads"));
app.use(express.json());
app.use("/student",studentRoute);
app.use("/company",companyRoute);
app.use("/post",postRoute);
app.use("/group",groupRoute);
app.use("/group-post",grouppostRoute);
app.use("/group-task",grouptaskRoute);
app.use("/task-submit",tasksubmissionRoute);
app.use("/report",reportRoute);
app.use("/companyform",companyFormRoute);
app.use("/student-post",StudentpostRoute);
app.use("/notification", notificationRoute);
app.use("/unistudents", unistudentsRoute); 
app.use("/partnership",PartnershipRoute);
app.route("/").get((req,res) => res.json("your first rest api 1"));
app.listen(Port, () => console.log('your server running on port '+ Port));