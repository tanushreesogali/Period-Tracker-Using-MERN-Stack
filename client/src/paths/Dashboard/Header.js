import React from 'react';
import {useState, useEffect } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import axios from 'axios';
import '../../path.css';
import profile from "./pictures/img-bg.png"

export default function Header(){
    const [userData,setData]=useState({});
    const navigate=useNavigate();

    useEffect(()=>{
        axios.get('http://localhost:3001/uname',{withCredentials:true})
        .then((res)=>{
            setData(res.data);
        })
    },[])

    function logout(){
        axios.post("http://localhost:3001/logout",{withCredentials:true});
        navigate('/');
    }
    return(
        <div className="header">
            
            <div className="profile-div">
                <div>
                <Link to='/profile'>
                    <img className="head-profile" src={profile} alt="Profile_Image" />  
                </Link>
                </div>
                <div><label> Hi <span>{userData.name}</span></label></div>
            </div>
            <button onClick={logout}>Logout</button>
        </div>
    )
}