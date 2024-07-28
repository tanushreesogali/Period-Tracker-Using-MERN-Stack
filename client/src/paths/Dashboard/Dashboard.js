import React, {useState, useEffect} from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import calender from "./pictures/cal2.png"
import think from "./pictures/think.png"
import record from "./pictures/record.png";


//Edit period is left!!

export default function Dashboard(){
    const navigate = useNavigate();

    const [data,setData]=useState({
        latestLog:'',
        nextPeriod:'',
        periodStatus:''
    })

    useEffect(()=>{
        axios.get('http://localhost:3001/period/dashboard',{withCredentials:true})
        .then((res)=>{
            setData(res.data);
        })
    },[])

    const render = () => {
        const { latestLog, periodStatus } = data;
    
        if (latestLog === -1) {
            return <p>Ooo...looks like a Star landed on Me!!</p>;
        }
    
        if (periodStatus.isOngoing) {
            return <p>Day {periodStatus.periodDay} of Period</p>;
        }
    
        if (!periodStatus.isLate) {
            return <p>{periodStatus.toStartDays} day{periodStatus.toStartDays !== 1 ? 's' : ''} left</p>;
        }
    
        if (periodStatus.isLate && periodStatus.toStartDays === 0) {
            return <p>Period may come today</p>;
        }
    
        return <p>{periodStatus.toStartDays} day{periodStatus.toStartDays !== 1 ? 's' : ''} late</p>;
    }
    
    const style = {
        display: data.latestLog === -1 ? 'none' : 'block',
        fontSize:'14.5px'
    };

    return(
        <div>
            <Header/>
            <div className="main-div">
                <div className="dash-div" onClick={()=>{navigate('/logperiod')}}>
                    <div>
                        <div>{render()}</div>
                        <div>
                            <p style={style}>Next period: {data.nextPeriod}</p>
                        </div>
                    </div>
                    <div className="dash-log-div">
                        <img src={record} height="120px" width="auto"/>
                        <p className="dash-div-title">Record period</p>
                    </div>
                </div>

                <div className='nav-div'>
                    <div onClick={()=>{navigate('/calender')}} className="nav-calen-div">
                        <img src={calender} height="160px" width="75%"/>
                        <p className="nav-div-title">History</p>
                        <span className="nav-div-sub">Let Bygones be no more gones </span>
                    </div>

                    <div onClick={()=>{navigate('/predict')}} className="nav-pred-div">
                        <img src={think} height="160px" width="75%"/>
                        <p className="nav-div-title" >Prediction</p>
                        <span className="nav-div-sub">So your best dates are not ruined!</span>
                    </div>
                    
                {/* <p>Stats -avg period/cycle len -capsule diagram -cycle trends</p> */}
                </div>
            </div>
            
        </div>
    )
}