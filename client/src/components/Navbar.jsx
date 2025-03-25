import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { AppContext } from "../context/AppContext";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

function Navbar() {
  const {userData,backendUrl,setUserData,setIsLoggedIn}=useContext(AppContext)
  const [isOpen, setIsOpen] = useState(false);
  const navigate=useNavigate();
  const logout=async()=>{
    try {
        axios.defaults.withCredentials=true
        const {data}=await axios.post(backendUrl + 'api/auth/logout')
        data.success && setIsLoggedIn(false)
        data.success && setUserData(false)
        navigate('/')
        
    } catch (error) {
        toast.error(error.message)
        
    }

  }

  const sendVerificationOtp=async()=>{
    try {
        axios.defaults.withCredentials=true
        const {data} =await axios.post(backendUrl+'api/auth/send-verify-otp')
        if(data.success){
            navigate('/emailverify')
            toast.success(data.message)
        }else{
            toast.error(data.message)
        }
    } catch (error) {
        toast.error(error.message)
    }
  }

  return (
    <header className="bg-gray-200 p-4 rounded-2xl shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        
        <div className="text-2xl font-bold">Hi!!!!{userData?userData.name:"user data not found"}</div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
        {userData?<div>{!userData.isAccountVerified && (
  <li onClick={sendVerificationOtp} className="text-blue-500 hover:underline">
    Verify Email{userData.isAccountVerified}
  </li> 
)}
            
            <button onClick={logout}>Logout</button>  
            </div>:
            <Link to="/login" className="text-blue-500 hover:underline">Login</Link>  }
            <Link to="/" className="text-blue-500 hover:underline">Home</Link>
         
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-blue-500 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden mt-2 bg-gray-300 p-4 rounded-lg space-y-2">
          <Link to="/" className="block text-blue-500 hover:underline" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/login" className="block text-blue-500 hover:underline" onClick={() => setIsOpen(false)}>Login</Link>
         
        </div>
      )}
    </header>
  );
}

export default Navbar;