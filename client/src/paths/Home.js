import React from "react";
import { Link } from "react-router-dom";
import '../path.css';
export default function Home(){
    return(
        <div>
            <h2>Welcome to</h2>
            <h1 className="aimee">Aimee</h1>
            <h2>Your Period Tracking Assistant</h2>
            <p>Effortlessly track your cycle and manage your health with our intuitive period tracker!!</p>

            <Link to="/register"><button>Register</button></Link>
            <Link to="/login"><button>Login</button></Link>
            
        </div>
    )
}