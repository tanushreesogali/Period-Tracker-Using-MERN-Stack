
import { useState } from "react";
import Header from "../Dashboard/Header";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
export default function LogPeriod(){
    const [formData, setForm] =useState({
        startDate:'',
        endDate:''
    })
    const [res, setRes]=useState('');

    const navigate=useNavigate();

    const handleChange=(e)=>{
        const {name, value}=e.target;
        setForm({
            ...formData,
            [name]:value
        })
    }

    const handleSubmit=(e)=>{
        e.preventDefault();
        axios.post('http://localhost:3001/period/log',formData,{withCredentials:true})
        .then(result=>{
            if(result.data){
                setRes(result.data);
            }
            else{
                setRes('Error! Try again soon')
            }
        })
    }
    return(
        <div>
            <Header/>
            <h1>Looks like its time for a treat!</h1>
            <form onSubmit={handleSubmit}>
                <label>Start Date </label><input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required/> <br/>
                <label>End Date </label><input type="date" name="endDate" value={formData.endDate} onChange={handleChange} /><br/>
                <button>Save</button><br/>
                <p>{res}</p>
            </form>
            <button onClick={()=>{navigate('/dashboard')}}>Home</button>
            
        </div>
    )
}