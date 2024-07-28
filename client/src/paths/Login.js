import React from "react";
import { Link} from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login(){
    const [formData, setFormData] = useState({
        email:"",
        password:""
    });

    const [res, setRes]=useState('');
    const navigate=useNavigate();

    const handleChange=(e)=>{
        const {name,value}=e.target;
        setFormData({
            ...formData,
            [name]:value
        })
    }

    const handleSubmit =(e)=>{
        e.preventDefault();
        axios.post('http://localhost:3001/login',formData,{withCredentials:true})
        .then(result=>{
            if(result.data==='0'){
                setRes('Profile not found!');
            }
            else if(result.data==='1'){
                setRes('Incorrect Password')
            }
            else{
                setRes('Login sucessful');
                navigate('/dashboard')
            }
        })
        
        
         
    }

    return(
        <div>
            <h1>This day misses your beautiful Smile!</h1>
            <p>Welcome Back!</p>

            <form onSubmit={handleSubmit}>
                <label>Email: </label><input type="text" name="email" placeholder="Enter your Email" value={formData.email} onChange={handleChange} required/><br/><br/>
                <label>Password: </label><input type="password" name="password" placeholder="Enter your Password" value={formData.password} onChange={handleChange} required/><br/><br/>
                <button type="submit">Login</button><br/><br/>
                <p>{res}</p>
            </form>

            <label>Wanna join Aimee's Party?</label><Link to="/register">Register</Link>

        </div>
    )
}