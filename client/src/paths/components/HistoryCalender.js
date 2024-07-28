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
        prevArray:[],
    });

    useEffect(()=>{
        axios.get('http://localhost:3001/period/history',{withCredentials:true})
        .then((res)=>{
            setData(res.data);
        })
    },[])

    const Capsule = ({startDate, endDate, cycleLength, periodLength, toDisplay})=>{
        const cycleLengthPx=cycleLength*5;
        const periodLengthPx=periodLength*5;
        return(
            <div className='capsule-container'>
                <span>{startDate}</span>

                <div className="capsule" style={{ width: `${cycleLengthPx}px`}}>
                    <div className='sub-capsule' style={{width: `${periodLengthPx}px` }}>
                        {periodLength}
                    </div>

                    {toDisplay && <div className="cap-cycle-len">{cycleLength}</div>}
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
                
                {data.latestLog===-1? 
                <p>Period Log history not found</p>
                :
                    <div>
                        <p>Past Logs</p>
                        <div className='past-div'>
                            {data.prevArray.map((past,index)=>{
                                const toDisplay=index!==0;
                                const prevCycleLength=data.prevArray[index-1]?.cycleLength|| data.avgCycleLen;
                                return(
                                <Capsule
                                    key={index}
                                    startDate={past.startDate}
                                    endDate={past.endDate}
                                    cycleLength={prevCycleLength}
                                    periodLength={past.periodLength}
                                    toDisplay={toDisplay}

                                />
                                );
                            })}
                    </div>
                    </div>
                }
                <button onClick={()=>{navigate('/dashboard')}}>Home</button>
                </div>
        </div>
    )
}

