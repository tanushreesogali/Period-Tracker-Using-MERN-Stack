import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../Dashboard/Header";
import axios from "axios";
import '../../App.css';


export default function Prediction(){
    const navigate= useNavigate();
    const [data, setData]=useState({
        latestLog:'',
        avgCycleLen:0,
        avgPeriodLen:0,
        predictArray:[],
    });

    useEffect(()=>{
        axios.get('http://localhost:3001/period/prediction',{withCredentials:true})
        .then((res)=>{
            setData(res.data);
        })
    },[])

    const Capsule = ({startDate, endDate, avgCycleLen, avgPeriodLen})=>{
        const cycleLengthPx=avgCycleLen*5;
        const periodLengthPx=avgPeriodLen*5;
        return(
            <div className='capsule-container'>
                <span>{startDate}</span>

                <div className="capsule" style={{ width: `${cycleLengthPx}px`}}>
                    <div className='sub-capsule' style={{width: `${periodLengthPx}px` }}>
                        {avgPeriodLen}
                    </div>

                    <div className="cap-cycle-len">{avgCycleLen}</div>
                </div>

                <span>{endDate}</span>
            </div>
        )
    }


    return(
        <div>
            <Header/>
            <div style={{height:"auto", width:"500px"}}>
                <div className='avg-div' >
                    <p className='avg-p'>Average Cycle Length: {data.avgCycleLen} </p>
                    <p className='avg-p'>Average Period Length: {data.avgPeriodLen} </p>
                </div>
                
                    <p>Prediction</p>
                    <div className='predict-div'>
                    {data.predictArray.map((prediction,index)=>(
                        <Capsule
                        key={index}
                        startDate={prediction.startDate}
                        endDate={prediction.endDate}
                        avgCycleLen={data.avgCycleLen}
                        avgPeriodLen={data.avgPeriodLen}

                    />
                        // <p key={index}>{prediction.startDate} ---&gt; {prediction.endDate}</p>
                    ))}
                    </div>
                <button onClick={()=>{navigate('/dashboard')}}>Home</button>
                </div>
        </div>
    )
}

