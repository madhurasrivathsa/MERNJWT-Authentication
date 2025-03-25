import './index.css'
import App from './App.jsx'
import React from 'react'

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Emailverify from './components/Emailverify.jsx'
import Login from './components/Login.jsx'
import Resetpassword from './components/Resetpassword.jsx'
import Home from './components/Home.jsx'
import ErrorPage from './components/ErrorPage.jsx'
import ReactDOM from 'react-dom/client'
import { AppContextProvider } from './context/AppContext.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,  // This is the main layout with <Outlet />
    errorElement: <ErrorPage/>, // Handle 404 or errors
    children: [
      {
        index: true,  // Default route (same as "/")
        element: <Home/>,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "emailverify",
        element: <Emailverify />,
      },
      {
        path: "resetpassword",
        element: <Resetpassword/>,
      },
    ],
  },
]);





ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppContextProvider> {/* Wrap everything inside AppContextProvider */}
      <RouterProvider router={router} />
    </AppContextProvider>
  </React.StrictMode>
);
