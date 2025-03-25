import { createContext, useEffect, useState } from "react";
import React from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    axios.defaults.withCredentials=true
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null); // Change false to null
    const getAuthState=async()=>{
        try {
            const {data}=await axios.get(backendUrl+'api/auth/is-auth')
            if(data.success){
                setIsLoggedIn(true)
                getUserData()
            }
            
        } catch (error) {
            toast.error(error.message)
            
        }
    }

    const getUserData=async()=>{
        try {
            const {data}=await axios.get(backendUrl+'api/user/data')
            console.log("The user data is",data)
            data.success?setUserData(data.userData):toast.error("error while getting user data")
            
        } catch (error) {
            toast.error("error while getting user data")
        }

    }




    useEffect(()=>{
        getAuthState()
    },[])

    const value = { backendUrl, isLoggedIn, setIsLoggedIn, userData, setUserData ,getUserData};

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
