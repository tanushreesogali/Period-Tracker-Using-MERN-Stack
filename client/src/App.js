import './App.css';
import { Route, Routes} from "react-router-dom";
import Home from "./paths/Home";
import Login from "./paths/Login";
import Register from "./paths/Register";
import Dashboard from "./paths/Dashboard/Dashboard";
import Profile from "./paths/Dashboard/Profile";
import UpdateProfile from "./paths/Dashboard/UpdateProfile";
import LogPeriod from './paths/components/LogPeriod';
import Prediction from './paths/components/Prediction';
import HistoryCalender from './paths/components/HistoryCalender';



function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/updateprofile" element={<UpdateProfile/>} />
        <Route path="/logperiod" element={<LogPeriod/>} />
        <Route path="/predict" element={<Prediction/>} />
        <Route path="/calender" element={<HistoryCalender/>} />
      </Routes>
    </div>
  );
}

export default App;
