import React from "react"
import { Outlet } from "react-router-dom"
import Navbar from "./components/Navbar"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles
function App(){
  return (
  <>
  <ToastContainer position="top-right" autoClose={3000} />
    <Navbar/>
    <Outlet />
    </>)

}
export default App