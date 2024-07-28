import Header from './Header';
import { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


export default function UpdateProfile(){
    const [show, setShow]=useState('');
    const [userData, setData]=useState({
        email: '',
        name: '',
        password: ''
    });
    
    const handleChange=(e)=>{
        const {name,value}=e.target;
        setData({
            ...userData,
            [name]:value
        })
    }

    const handleSubmit=(e)=>{
        e.preventDefault();
        axios.post('http://localhost:3001/update',userData,{withCredentials:true})
        .then(result=>{
            if(result.data==='1'){
                setShow('Profile Updated Successfully!')
            }
            else{
                setShow('Error! Try Again Later')
            }
        })

    }


    useEffect(()=>{
        axios.get('http://localhost:3001/uname',{withCredentials:true})
        .then((res)=>{
            console.log(res.data);
            setData(res.data);
        })
    },[])
    return(
        <div>
            <Header/>
            <h1>Update Your Profile</h1>
            <form onSubmit={handleSubmit}>
                <label>Email: </label><input 
                type="text" 
                name="email" 
                placeholder="Enter your Email" 
                value={userData.email}
                onChange={handleChange} 
                required/><br/><br/>

                <label>Name: </label><input 
                type="text" 
                name="name" 
                placeholder="Enter your Name" 
                value={userData.name}
                onChange={handleChange} 
                required/><br/><br/>

                <label>Password: </label><input 
                type="password" 
                name="password" 
                placeholder="Enter a new Password"
                onChange={handleChange}  
                required/><br/><br/>
                <button type="submit">Update</button><br/><br/>
                <p>{show}</p>
            </form>
            <label>No updates needed?</label>
            <Link to='/dashboard'><button>Home</button></Link>

        </div>
    )
}