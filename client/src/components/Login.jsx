import React, { useContext, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom";
import {AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";
function Login(){
    const [state, setState] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate=useNavigate();
    const { backendUrl, isLoggedIn, setIsLoggedIn,getUserData } = useContext(AppContext);

    const onSubmitHandler=async(e)=>{
        console.log("this is within onSubmitHandler")
        console.log("the state value is ",state)
        try {
            e.preventDefault()
            axios.defaults.withCredentials=true
            console.log("the backend url is ",backendUrl)
            if(state==='signup'){
                const {data}=await axios.post(backendUrl + 'api/auth/register',{name,email,password})
                console.log("the data is ",data)
                if(data.success){
                    setIsLoggedIn(true)
                    getUserData()
                    navigate('/')
                }else{
                    toast.error(data.message);
                }

            }else{
                const {data}=await axios.post(backendUrl + 'api/auth/login',{email,password})
                if(data.success){
                    setIsLoggedIn(true)
                    getUserData()
                    navigate('/')
                }else{
                    toast.error(data.message);
                }

            }
            
        } catch (error) {
           
                toast.error(error.response?.data?.message || "Something went wrong");
            
            }

    }

    return( <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-4">
            {state === "signup" ? "Create Your Account" : "Login To Your Account"}
          </h1>
          <form className="space-y-4" onSubmit={onSubmitHandler}>
            {state === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
                />
              </div>
            )}
  
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e)=>setPassword(e.target.value)}
                value={password}
              />
            </div>
  
            {state !== "signup" && (
              <div className="text-right">
                <Link to="/resetpassword">Forgot Password?</Link>
              </div>
            )}
  
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
              {state === "signup" ? "Sign Up" : "Login"}
            </button>
          </form>
  
          <p className="mt-4 text-center text-sm">
            {state === "signup" ? (
              <>
                Already have an account? 
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => setState("login")}
                >
                  Login here
                </button>
              </>
            ) : (
              <>
                Don’t have an account? 
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => setState("signup")}
                >
                  Sign up
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    )
}
export default Login