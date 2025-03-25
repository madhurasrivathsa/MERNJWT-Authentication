import React, { useState,useRef, useContext } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { AppContext } from "../context/AppContext"
import { toast } from "react-toastify"
import axios from "axios"
function Resetpassword({ length = 6, onSubmit }){
    const {backendUrl}=useContext(AppContext)
    axios.defaults.withCredentials=true
    const navigate=useNavigate()
    const [email,setEmail]=useState('')
    const [newPassword,setNewPassword]=useState('')
    const[isEmailSent,setIsEmailSent]=useState('')
    const [isOtpSubmitted,setIsOtpSubmitted]=useState('')
      const [otp, setOtp] = useState(new Array(length).fill(""));
    const [otpArray, setOtpArray] = useState(new Array(6).fill("")); 
   
    const inputRefs = useRef([]);
    //  const {backendUrl,isLoggedIn,userData,getUserData}=useContext(AppContext)
      
    
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
    
      const onSubmitEmail = async (e) => {
        e.preventDefault();
        try {
          const { data } = await axios.post(backendUrl + "api/auth/send-reset-otp", { email });
      
          if (data.success) {
            toast.success("OTP Sent to your Email");
            setIsEmailSent(true);
          } else {
            toast.error("Email Not Registered");
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Something went wrong");
        }
      };


      const onSubmitOtp=async(e)=>{
        e.preventDefault();
        const otp=inputRefs.current.map(e=>e.value)
        setOtp(otp.join(''))
        setIsOtpSubmitted(true)
      }

      const onSubmitNewPassword=async(e)=>{
        e.preventDefault();
        try {
            const {data}=await axios.post(backendUrl + 'api/auth/reset-password',{email,otp,newPassword})
            data.success?toast.success(data.message):toast.error(data.message)
            data.success && navigate('/login')
        } catch (error ) {
            toast.error(error.message)
        }


      }
      
   
    
    return(<>
   {!isEmailSent && <form  onSubmit={onSubmitEmail} className="p-4 bg-gray-100 rounded-lg">
        <h1>Enter Email to reset your Password</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="border border-gray-300 rounded-md p-2 w-full mb-2"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
      >
        Submit
      </button>
    </form> }
    
   
  {!isOtpSubmitted && isEmailSent&& <div className="flex gap-2">
    <div className="flex gap-2">
  <form onSubmit={onSubmitOtp}>
    <h1>Enter OTP that you have received from your mail</h1>
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

    </div>}
   

{isOtpSubmitted && isEmailSent &&   <form   onSubmit={onSubmitNewPassword} className="p-4 bg-gray-100 rounded-lg">
        <h1>Enter new password</h1>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Enter your new Passowrd"
        className="border border-gray-300 rounded-md p-2 w-full mb-2"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
      >
        Submit
      </button>
    </form>}
    
        
        
        
        
        
        </>)
}
export default Resetpassword