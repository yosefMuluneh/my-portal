import { useEffect, useState } from "react"
import { useLoginContext } from "../context"
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Tooltip,
    Avatar
  } from "@material-tailwind/react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { IoIosArrowDropdownCircle,IoIosArrowDropupCircle } from "react-icons/io"
import profile from '../profile.png'
import profile2 from '../profile2.webp'


const MyProfile = () => {
    const {setLogin} = useLoginContext()
    const [myProfile,setMyProfile] = useState()
    const [message,setMessage] = useState()
    const navigation = useNavigate()

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
    
    const loadProfile = async()=>{
        const userId = Cookies.get("userId")
        const myId = userId.split("/")[0]+ userId.split("/")[1]
        const token = Cookies.get("token")
        console.log("my user id is",myId)
        const response = await fetch(`http://localhost:3030/auth/my-profile/${myId}`,{
            method:'get',
            credentials:"include",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        })

        const data = await response.json()
        if(response.status===200){
          setMyProfile(data.user)
          console.log("ia here dudes",data.user)
        }else{
          setMessage(data.message)
        }
    }

    useEffect(()=>{
        setLogin(true)
    },[setLogin])
  return (
    <div className="my-container w-full  gap-6 px-8 py-4  ">
      <div className="w-full flex pt-4 flex-col items-center">
      <div className="w-full flex flex-col items-center bg-gray-100 rounded-lg  shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-grey-700 dark:border-grey-700">
          <div className="px-6 space-y-4 md:space-y-6 sm:p-8">
              <Card className="w-full">
      <CardHeader floated={false} className="h-80">
      {<img src={myProfile ? profile : profile2} className="w-full md:h-full"/>}

      </CardHeader>
      <CardBody className="text-center">
        <Typography variant="h4" color="blue-gray" className="mb-2">
          {myProfile?.fName} {myProfile?.lName}
        </Typography>
        <Typography color="blue" className="font-medium" textGradient>
          {myProfile?.id}
        </Typography>
      </CardBody>
      <CardFooter className="flex flex-col  justify-center gap-4 pt-2">
       <div className="flex gap-3">
      {
        myProfile?.myclass ?
<div className="flex flex-row gap-4">
<p className="text-gray-800">Class : </p> 
        <p className="text-gray-400">{myProfile?.myclass}({myProfile?.classId})</p>
</div>:<div className="flex flex-row gap-4">
<p className="text-gray-800">Educational Level : </p> 
        <p className="text-gray-400">Masters of Science in Physics</p>
</div>
      } 
        </div>
        <div className="flex gap-3">
        <p className="text-gray-800">Academic Year : </p>  
        <p className="text-gray-400">{new Date().getFullYear()}</p>
          </div> 
        
        <button type="button" onClick={logout}   className="w-full block text-white bg-gray-900 hover:bg-grey-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Log out</button>


      </CardFooter>
    </Card>
              <p className="text-red-500" >{message}</p>
          </div>
      </div>
  </div>
  <div className="relative flex flex-col lg:mr-28 gap-2 mt-4 pb-10 pr-10 px-6 bg-grey-100  w-full border border-grey-200 rounded-lg shadow dark:bg-gray-800 dark:border-blue-700 py-4">
        <h3>Latest news</h3>
        <div className="px-6">
            <div className="flex space-between">
                <h5 className="flex-1 w-64 mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">news?.title</h5>
                <p className="dark:text-gray-400 text-gray-500">news?.postedBy</p>
            </div>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">news?.description</p>
            
            <p className="absolute bottom-8 right-8 pt-10">formattedDate</p>
                    
                </div>
                </div>
    </div>
  )
}

export default MyProfile
