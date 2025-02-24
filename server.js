//Import express for creating for creating API's endpoints
const express=require("express");
const path=require('path');
const fs=require("fs");
const users=require("./database.json");
const{ json } = require("stream/consumers");
var database;
var token="wrong key";

//Read database.json file
fs.readFile("database.json",function(err,data){
    //check for errors
    if(err) throw err;

    //Converting to JSON
    database=JSON.parse(data);
});

//Import jwt for API's endpoints authentication
const jwt=require("jsonwebtoken");
const { request } = require("http");

//creates an express application, initiate express top level function
const app=express();

//A port for serving API's
const port=5000;

//allow json data
app.use(express.json());
app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/login.html');
});

//login route
app.post("/auth",(req,res)=>{

    //Get the name to the json body data
    const name=req.body.name;
    console.log(name);

    //Get the password to the json body data
    const password=req.body.password;
    console.log(password);

    //Make two variables for further use
    let isPresent=false;
    let isPresentIndex=null;

    //iterate a loop to the data items and check with data are matched.
    for(let i=0;i<database.length;i++){
        if(database[i].name===name && database[i].password===password){
            isPresent=true;
            isPresentIndex=i;
            break;
        }
    }
    if(isPresent){
        const token=jwt.sign({user :database[isPresentIndex]},"secret");
        res.json({
            login:true,
            token:token,
            data:database[isPresentIndex],
        });
    }
    else{
        res.json({
            login:false,
            token:token,
            error:"Please check name and password.",
        });
    }
});

//verify route
app.post("/verifyToken",(req,res)=>{

    //Get token value to the json body
    const token=req.body.token;

    //if the token is present
    if(token){
        const decode=jwt.verify(token,"secret");

        //return response with decode data
        res.json({
            login:true,
            data:decode,
        });
    }else{
        res.json({
            login:false,
            data:error,
        });
    }
});
app.post("/login",(req,res)=>{
    res.redirect("/login");
});

//Listen the server
app.listen(port,()=>{
    console.log(`Server is running on :http://localhost:${port}/`);
});