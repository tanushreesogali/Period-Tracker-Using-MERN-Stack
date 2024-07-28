import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function Register(){
    const [formData, setFormData] = useState({
        email:"",
        name:"",
        password:""
    });

    const [res, setRes]=useState("");

    const [otp,setOtp]=useState({
        sentOtp:'',
        verifyOtp:''
    });

    const navigate= useNavigate();

    const handleChange=(e)=>{
        const {name,value}=e.target;
        setFormData({
            ...formData,
            [name]:value
        })
    }

    const handleChange2=(e)=>{
        const { value } = e.target;
        setOtp({
            ...otp,
            verifyOtp: value 
        });
    }
    const handleSubmit =(e)=>{
        e.preventDefault(); 
        axios.post("http://localhost:3001/api/verify",formData,{
            headers:{
                'Content-Type':'application/json'
            },
            withCredentials: true
        })
        .then(result=>{
            
            if(result.data==='0'){
                setRes('Email already exists!');
            }
            else{
                setRes('OTP sent');
                setOtp({
                    ...otp,
                    sentOtp: result.data.sentOtp 
                });
            }
        })
    }

    const handleVerify =(e)=>{
        e.preventDefault(); 
        if(otp.sentOtp === otp.verifyOtp){
            axios.post("http://localhost:3001/api/register",formData,{
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials: true
            })
            .then(result=>{
                navigate('/dashboard')
            })
        }
        else{
            setRes('Invalid Otp!')
            navigate('/');
        }
        
    }

    const style = {
        display: res === '' ? 'none' : 'block'
    };

    return(
        <div>
            <h1>You are a Queen! Go Get The World</h1>
            <p>Welcome to Aimee!</p>

            <form onSubmit={handleSubmit}>
                <label>Email: </label><input type="text" name="email" placeholder="Enter your Email" value={formData.email} onChange={handleChange} required/><br/><br/>

                <label>Name: </label><input type="text" name="name" placeholder="Enter your Name" value={formData.name} onChange={handleChange} required/><br/><br/>

                <label>Password: </label><input type="password" name="password" placeholder="Enter a Password" value={formData.password} onChange={handleChange} required/><br/><br/>

                <button type="submit">Send OTP</button><br/><br/>
            </form>
            <div style={style}>
                <form onSubmit={handleVerify}>
                <label>OTP: </label><input type="text" name="verifyotp" placeholder="Enter sent OTP" value={otp.verifyotp} onChange={handleChange2} required/><br/><br/>
                <button type="submit">Verify Mail</button><br/><br/>
                </form>
                <p>{res}</p>
            </div>

            <label>Are you a friend of Aimee?</label><Link to="/login">Login</Link>

        </div>
    )
}