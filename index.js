const express = require("express");
const mongoose = require("mongoose");
const studentRoute = require("./routes/student");
const companyRoute = require("./routes/company");
const app=express();
const Port = process.env.port || 5000;
mongoose.connect('mongodb://127.0.0.1:27017/test1');
//mongodb://localhost:27017
const connection =mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB connected");
});
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use("/student",studentRoute);
app.use("/company",companyRoute);
app.route("/").get((req,res) => res.json("your first rest api 1"));
app.listen(Port, () => console.log('your server running on port '+ Port));