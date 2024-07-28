const express=require("express");
const cors=require("cors");
const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser=require('cookie-parser');
const moment =require('moment');
const nodemailer= require('nodemailer');


//ENV
const salt=bcrypt.genSaltSync(10);
const secret='niw28n4khska983nwkr90dpo';

//MODELS
const User=require("./models/userModel");
const PeriodLog=require("./models/periodLogModel");


const app=express();
app.use(express.json());
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}));
app.use(cookieParser());

mongoose.connect('mongodb://127.0.0.1:27017/Period_Tracker');


app.listen(3001,()=>{
    console.log("server is running");
})

const bodyParser = require("body-parser");
app.use(bodyParser.json());

//Nodemailer Transport 
const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port:465,
    security:true,
    auth:{
        user: 'aimeeptracker@gmail.com',
        pass: 'opsl rdct rlyj xvwg'
    }
})

//OTP Generator
const otpGen=()=>{
    let otp='';
    for(let i=0;i<4;i++){
        let num=Math.floor(Math.random()*10);
        otp+=num;
    }
    return otp;
}

//VERIFY
app.post("/api/verify",(req,res)=>{
    let {email,name,password}=req.body;
    email=email.toLowerCase();
    User.findOne({email:email})
    .then(user=>{
        if(user){
            res.json('0');
        }
        else{
            const otp=otpGen();
            transport.sendMail({
                to:email,
                subject:'Welcome to Aimee',
                html:`<h1>Hello beautiful!</h1><p>Welcome to Aimee: Your personal period tracking assistant</p><p>Your Verification Code:</p><h2>${otp}</h2>`
            }).then(()=>{
                console.log('Email sent');
            })
            res.json({ sentOtp: otp });

        }
    })
    
})

//REGISTER
app.post("/api/register",(req,res)=>{
    let {email,name,password}=req.body;
    email=email.toLowerCase();
    
    const passEncrypt=bcrypt.hashSync(password,salt);
    User.create({email,name,password:passEncrypt});
    jwt.sign({email:email,name:name,password:passEncrypt},secret,{},(err,token)=>{
        res.cookie('token',token).json("Profile created successfully");
    });       
})

//LOGIN
// 0=> not exists 1=>password mismatch 2=>successful
app.post("/login",(req,res)=>{
    let{email,password}=req.body;
    email=email.toLowerCase();
    User.findOne({email:email})
    .then(user=>{
        if(!user){
            res.json('0');
        }
        else{
            if(bcrypt.compareSync(password,user.password)){
                jwt.sign({email:user.email,name:user.name,password:user.password},secret,{},(err,token)=>{

                    res.cookie('token',token).json('2');
                });
            }
            else{
                res.json('1');
            }
        }
    })
})

//Get one user data
app.get('/uname',(req,res)=>{
    const {token}=req.cookies;
    jwt.verify(token,secret,{},(err,info)=>{
        res.json(info);
    })
})

//Logout
app.post('/logout',(req,res)=>{
    res.clearCookie('token').json('cookie deleted');
})

//Update Profile
app.post('/update',(req,res)=>{
    const {email,name,password} =req.body;
    const token = req.cookies.token;
    const passEncrypt=bcrypt.hashSync(password,salt);

    jwt.verify(token,secret,{},(err,userInfo)=>{
        const userEmail=userInfo.email;
        User.findOne({email:userEmail})
        .then(user=>{
            user.email=email;
            user.name=name;
            user.password=passEncrypt;
            user.save();
            jwt.sign({email:email,name:name,password:passEncrypt},secret,{},(err,newToken)=>{
                res.cookie('token',newToken).json("1");
                res.send(user);
            });
        })
    });
})

//FUNCTIONS

const authUser = (req,res,next)=>{
    const token=req.cookies.token;
    const userInfo=jwt.verify(token,secret,{});
    req.user=userInfo;
    next();

}
const getAvgData= async(req,res,next)=>{
    let totalPeriodLen=0;
    let totalCycleLen=0;
    let periodCount=0;
    let cycleCount=0;
    const prevPeriodLogs= await PeriodLog.find({email: req.user.email}).sort({startDate:-1});
    if(prevPeriodLogs.length===0){
        req.avgPeriodLen=5;
        req.avgCycleLen=30;
        req.latestLog=-1;
    }
    else{
       for(let i=0;i<prevPeriodLogs.length;i++){
        totalPeriodLen+=prevPeriodLogs[i].periodLength;
        totalCycleLen+=prevPeriodLogs[i].cycleLength;
        periodCount++;
        cycleCount++;
       } 

       req.avgPeriodLen=parseInt(totalPeriodLen/periodCount);
       req.avgCycleLen=parseInt(totalCycleLen/cycleCount);
       req.prevlogs=prevPeriodLogs;
       req.latestLog=prevPeriodLogs[0];
    }
    next();
}
//Period Log
//create new log
app.post('/period/log',(req,res)=>{
    let {startDate,endDate}=req.body;
    const {token} = req.cookies;
    jwt.verify(token,secret,{},(err,userInfo)=>{
        const email=userInfo.email;
        PeriodLog.create({email,startDate,endDate})
        .then(()=>{
            res.json("Log saved successfully!")
        })
        
    })
})


//past and predictions with average cycle and period lengths

app.get('/period/prediction',authUser,getAvgData,(req,res)=>{
    const {latestLog, avgCycleLen,avgPeriodLen, prevlogs}=req;

    const formatDate = (date) => {
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    // let prevArray=[];
    // for(let i=0;i<prevlogs.length;i++){
    //     let startDate=new Date(prevlogs[i].startDate);
    //     let endDate=new Date(prevlogs[i].endDate);
    //     let cycleLength=prevlogs[i].cycleLength;
    //     let periodLength=prevlogs[i].periodLength;
    //     prevArray.push({startDate:formatDate(startDate),endDate:formatDate(endDate), cycleLength, periodLength})
    // }

    // if(latestLog===-1){
    //     res.json({latestLog, avgCycleLen,avgPeriodLen});
    //     return;
    // }

    let predictArray=[];
    for(let i=0;i<6;i++){
        let startDate=new Date(latestLog.startDate);
        startDate.setDate(startDate.getDate()+avgCycleLen*(i+1));

        let endDate= new Date(startDate);
        endDate.setDate(startDate.getDate()+avgPeriodLen);
        predictArray.push({startDate:formatDate(startDate), endDate:formatDate(endDate)});
    }
    res.json({latestLog, avgCycleLen,avgPeriodLen, predictArray});
})

app.get('/period/history',authUser,getAvgData,(req,res)=>{
    const {latestLog, avgCycleLen,avgPeriodLen, prevlogs}=req;

    const formatDate = (date) => {
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };
    if(latestLog===-1){
        res.json({latestLog, avgCycleLen,avgPeriodLen});
        return;
    }
    let prevArray=[];
    for(let i=0;i<prevlogs.length;i++){
        let startDate=new Date(prevlogs[i].startDate);
        let endDate=new Date(prevlogs[i].endDate);
        let cycleLength=prevlogs[i].cycleLength;
        let periodLength=prevlogs[i].periodLength;
        prevArray.push({startDate:formatDate(startDate),endDate:formatDate(endDate), cycleLength, periodLength})
    }
    res.json({latestLog, avgCycleLen,avgPeriodLen, prevArray});

})


//dashboard component with period status, next period

app.get('/period/dashboard',authUser,getAvgData,(req,res)=>{
    const {latestLog, avgCycleLen,avgPeriodLen}=req;

    const formatDate = (date) => {
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    };

    if(latestLog===-1){
        res.json({latestLog});
        return;
    }
    //next period
    let startDate=new Date(latestLog.startDate);
    startDate.setDate(startDate.getDate()+avgCycleLen);

    
    const nextPeriod =formatDate(startDate);

    //period status
    const now=moment();
    const StartDate=moment(latestLog.startDate);
    const EndDate=moment(latestLog.endDate);

    let periodStatus={};

    if(now.isBetween(StartDate,EndDate,null,[])){
        const periodDay=now.diff(StartDate,'days')+1;
        periodStatus={
            isOngoing:true,
            periodDay
        };
    }else{
        const nextPeriodStart=StartDate.add(avgCycleLen,'days');
        const toStartDays=nextPeriodStart.diff(now,'days');
        if(toStartDays<=0){

            periodStatus={
                isOngoing:false,
                isLate:true,
                toStartDays:Math.abs(toStartDays)
                
            }
        }else{
            periodStatus={
                isOngoing:false,
                isLate:false,
                toStartDays    
            }
        }
    }
    
    res.json({nextPeriod,periodStatus});
})







