//jshint esversion:6
 import dotenv from 'dotenv';
 dotenv.config();
 import config from "dotenv";
 import express from "express";
 import bodyParser from "body-parser";
 import ejs from "ejs";
 import mongoose, { Mongoose } from "mongoose";
 import encryption from "mongoose-encryption"

const app=express();

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));


mongoose.connect("mongodb://0.0.0.0:27017/secret")    //problem
.then(() => console.log("Database connected!"))
.catch(err => console.log(err));

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encryption, {secret: process.env.SECRET, encryptedfields: ['password']});


 app.get("/", function(req,res){
    res.render("home");
 })

 const user= new mongoose.model("user", userSchema)




 app.get("/login", function(req,res){
    res.render("login");
 })

 app.get("/register", function(req,res){
    res.render("register");
 });

 app.post("/register", function(req, res){
    const newUser = new user({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save().then(()=>{
        res.render("secrets");
    }).catch((err)=>{
        console.log(err);
    })
});

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    user.findOne({ email: username })
        .then((foundUser) => {
            if (foundUser && foundUser.password === password) {
                console.log("Authentication successful");
                res.render("secrets");
            } else {
                console.log("Incorrect username or password");
                res.send("Incorrect username or password");
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Internal Server Error");
        });
    });            

const port=3000;
 app.listen(port, function(){
    console.log(`Server running on port ${port}`);
 });