import Header from './Header';
import { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import profile from "./pictures/img-bg.png"

export default function Profile(){
    const [userData,setData]=useState({});
    useEffect(()=>{
        axios.get('http://localhost:3001/uname',{withCredentials:true})
        .then((res)=>{
            setData(res.data);
        })
    },[])
    return(
        <div>
            <Header/>
            <h1>How You Doin' Sissy!</h1>
            <img className='profile-img' src={profile} alt="Profile_Image"/>
            <div>
                <p>Name: {userData.name}</p>
                <p>Email: {userData.email}</p>
            </div>
            <div>
                <Link to='/updateprofile'><button>Edit Profile</button></Link>
                <Link to='/dashboard'><button>Home</button></Link>
            </div>

        </div>
    )
}