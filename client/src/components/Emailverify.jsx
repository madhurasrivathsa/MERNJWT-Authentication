import React, { useState, useRef, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const OTPInput = ({ length = 6, onSubmit }) => {
  axios.defaults.withCredentials=true
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);
  const {backendUrl,isLoggedIn,userData,getUserData}=useContext(AppContext)
  const navigate=useNavigate()

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, length);
    if (!/^\d+$/.test(pasteData)) return;

    const newOtp = pasteData.split("").concat(new Array(length - pasteData.length).fill(""));
    setOtp(newOtp);

    inputRefs.current[length - 1]?.focus();
    onSubmit(newOtp.join(""));
  };

  const onSubmitHandler=async(e)=>{
    try{
        e.preventDefault();
        const otpArray=inputRefs.current.map(e=>e.value)
        const otp=otpArray.join('')
        const {data}=await axios.post(backendUrl+'api/auth/verify-account',{otp})
        if(data.success){
            toast.success(data.message)
            getUserData()
            navigate('/')
        }else{
            toast.error(data.message)
        }

    }catch(error){
        toast.error(error.message)
    }
  }


 useEffect(()=>{isLoggedIn && userData && userData.isAccountVerified && navigate('/')},[isLoggedIn,userData])


  return (
    <div className="flex gap-2">
      <form onSubmit={onSubmitHandler}>
        <div className="flex gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              value={digit}
              maxLength={1}
              className="w-12 h-12 text-center border rounded-md focus:ring-2 focus:ring-blue-400"
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              ref={(el) => (inputRefs.current[index] = el)}
            />
          ))}
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default OTPInput;
