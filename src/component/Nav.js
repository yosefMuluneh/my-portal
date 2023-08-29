import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import profile2 from '../profile2.webp'
import profile from '../profile.png'

import { useNavigate } from "react-router-dom";
import {
  Navbar,
  MobileNav,
  Typography,
  IconButton,
  Button,
} from "@material-tailwind/react";

import { Avatar } from "@material-tailwind/react";
import Cookies from "js-cookie";
 

export default function Nav() {
  const [openNav, setOpenNav] = useState(false);
  const role = Cookies.get("role")
  const location = useLocation()
  const navigation = useNavigate()
  const [activeTab, setActiveTab] = useState(location.pathname);

  const logout = async()=>{
    navigation('/')

    const token = Cookies.get("token")
        const response = await fetch("http://localhost:3030/auth/logout",{
            method:'get',
            credentials:"include",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        })
        
  }
  
  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
    
    console.log("current tab",location.pathname)
  },[location] );
 
  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row  lg:items-center lg:gap-16">
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          onClick={() => setActiveTab("home")}
          className={`p-1 font-normal hover:text-24 ${
            activeTab === "/home" || activeTab === '/admin/home' ? "font-bold text-xl" : "font-normal"
          }`}
        >
          <a href={role==='Admin'? "/admin/home":"/home"} className="flex items-center" >
            Home
          </a>
        </Typography>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          onClick={() => setActiveTab("assign-teacher")}
          className={`p-1 font-normal hover:text-24 ${
            activeTab === "/assign-teacher" || activeTab === "/my-assessment" || activeTab === "/assess-students"? "font-bold text-xl" : "font-normal"
          }`}
        >
          <a href={role==='Admin'? "/assign-teacher":role==='Student'?"/my-assessment":"/assess-students"} className="flex items-center" >
            
            {role==='Admin'? "Assign Teacher":"Assessment"}
          </a>
        </Typography>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          onClick={() => setActiveTab("register-teacher")}
          className={`p-1 font-normal hover:text-24 ${
            activeTab === "/register-teacher" || activeTab === "/student-chat" || activeTab === "/chat-classes" ? "font-bold text-xl" : "font-normal"
          }`}
        >
          <a href={role==='Admin'? "/register-teacher":role==='Student'?"/student-chat":"/chat-classes"} className="flex items-center" >
            
            {role==='Admin'? "Register Teacher":role==='Student'?"Chat":"Chat Rooms"}
          </a>
        </Typography>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          onClick={() => setActiveTab("register-student")}
          className={`p-1 font-normal hover:text-24 ${
            activeTab === "/register-student" || activeTab === "/my-grade" || activeTab === "/submit-grade" ? "font-bold text-xl" : "font-normal"
          }`}
        >
          <a href={role==='Admin'? "/register-student":role==='Student'?"/my-grade":"/submit-grade"} className="flex items-center" >
            
            {role==='Admin'? "Register Student":role==='Student'?"Grade":"Final Grade"}
          </a>
        </Typography>
      </ul>
  );
 
  return (
    <Navbar className="mx-auto  max-w-screen-xl py-2 px-4 lg:px-0 lg:py-4">
      <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
        <Typography
          
          variant="small"
          className="mx-4 sm:pl-4 md:pl-16 cursor-pointer lg:pl-0 py-1.5 font-normal"
        >
          <><span className="text-3xl sm:pl-0 lg:px-0 ">Kingdom School Portal</span></>
        </Typography>
        <div className="hidden lg:block">{navList}</div>
        <div className="md:absolute rounded lg:relative md:right-4 sm:absolute sm:right-4">
        <Avatar src={profile2} className="hover:cursor-pointer" onClick={e=>navigation('my-profile')}  alt="avatar" />
        </div>
       
        <IconButton
          variant="text"
          className="ml-auto mr-16 mr-4 h-6 w-6 absolute left-2 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </IconButton>
      </div>
      <MobileNav open={openNav}>
        <div className="container mx-auto">
          {navList}
          
        </div>
      </MobileNav>
    </Navbar>
  );
}