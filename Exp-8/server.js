//Import express for creating API's endpoints
const express=require("express");
const db=require("./database");
const {MongoClient} = require('mongodb');
var token;
//Import jsonwentoken for authentication purpose
const jwt=require("jsonwebtoken");
const { sign } = require("crypto");
const { error } = require("console");
const app=express();
const port=3000;
app.use(express.json());
app.get('/',(req,res)=>{
    res.sendFile(__dirname +'/index.html');
});
app.get('/welcome',(req,res)=>{
    res.sendFile(__dirname +'/welcome.html');
});
app.get('/signup',(req,res)=>{
    res.sendFile(__dirname +'/signup.html');
});
app.get('/login',(req,res)=>{
    res.sendFile(__dirname +'/login.html');
});
//signup route
app.post("/register",async(req,res)=>{
    const name=req.body.name;
    const password=req.body.password;
    const work=req.body.work;
    tuple=await db.getData(name,password);
    if(JSON.parse(tuple).length>0){
        res.json({
            signup:false,
            token:null,
            error:"Already Registered"
        });
    }else{
        const token=jwt.sign(tuple,"secret");
        let emp={
            name:name,
            work:work,
            password:password,
            token:token
        };
        let result=await db.insertData(emp);
        res.json({
            signup:true,
            token:"generated",
            result:result
        });
    }
});

//login route
app.post("/auth",async(req,res)=>{
    const name=req.body.name;
    console.log(name);
    const password=req.body.password;
    console.log(password);
    tuple=await db.getData(name,password);
    if(JSON.parse(tuple).length>0){
        const token=jwt.sign(tuple,"secret");
        res.json({
            login:true,
            token:token,
            data:JSON.parse(tuple)
        });
    }else{
        res.json({
            login:false,
            error:"Please check name and password."
        });
    }
});
//verify route

app.post("/verifyToken",(req,res)=>{
    const token=req.body.token;
    if(token){
        const decode=jwt.verify(token,"secret");
        res.json({
            login:true,
            data:decode,
        });
    }else{
        res.json({
            login:false,
            data:"error",
        });
    }
});
app.post('/welcome',(req,res)=>{
    res.redirect("/welcome");
});
app.post('/login',(req,res)=>{
    res.redirect("/login");
});
app.post('/signup',(req,res)=>{
    res.redirect("/signup");
});

//Listen the server

app.listen(port,()=>{
    console.log(`Server is running:http://localhost:${port}`);
})