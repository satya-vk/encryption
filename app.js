//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var encrypt = require("mongoose-encryption");
const app = express();
var env = require("dotenv").config();
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/userDB");
const userSchema = new mongoose.Schema({
  username:String,
  password:String
});
var secret = process.env.SOME_LONG_UNGUESSABLE_STRING;
console.log(process.env.APIKEY);
userSchema.plugin(encrypt, { secret: secret ,  encryptedFields: ['password']});

const user = new mongoose.model("user",userSchema);
app.get("/",function(res,res){
  res.render("home");
});
app.get("/register",function(req,res){
  res.render("register");
});
app.post("/register",function(req,res){
  const users = new user({
    username:req.body.username,
    password:req.body.password
  });
  users.save(function(err){
    if(err){
      console.log("there are errors"+err);
    }
    else{
      res.render("secrets");
    }
  })
});
app.get("/login",function(req,res){
  res.render("login");
});
app.post("/login",function(req,res){
  user.findOne({username:req.body.username},function(err,found){
    if(err){
      console.log("errors"+err);
    }
    else{
      if(found.password===req.body.password){
        res.render("secrets");
      }
      else{
        res.send("404");
      }
    }
  })
})
app.listen(3000,function(){
  console.log("server is started");
})
