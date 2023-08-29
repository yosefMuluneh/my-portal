import { useLoginContext,useIdContext, useAuthContext } from "./context"
import { useState } from "react"
import { useNavigate,NavLink} from "react-router-dom"
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import backgroundimage from './backgroundimage.jpg'
import {
  Card,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import Cookies from "js-cookie";
import { useEffect } from "react";

const Login = () =>{

    const navigation = useNavigate()
    const {setLogin} = useLoginContext()
    const {userId, setId} = useIdContext()
    const {setAuth} = useAuthContext()
    const [password,setPassword] = useState("")
    const [message,setMessage] = useState()
    const [showPassword, setShowPassword] = useState(false);
    

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

      const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };

    const authenticate =async () =>{
         await authorize(userId,password)
    }

    async function authorize(userId,userPassword){
      console.log(userId)
        const response = await fetch("http://localhost:3030/auth/login",{
            method:"post",
            credentials:"include",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                userId:userId,
                password:userPassword
            })
        })

        const payload = await response.json()
        console.log('token',payload)
        if (response.status === 200){
            setLogin(true)
            setAuth(payload.token)
            console.log(payload.role)
            Cookies.set("role",payload.role)
            Cookies.set("userId",payload.userId)
            Cookies.set("myname",payload.fName+" "+payload.lName)
            payload.role==="Admin"?navigation("admin/home"):navigation("/home")
        }else{
            setMessage(payload.message)
            navigation("/")
            await sleep(2500)
            setMessage('')
        }
        
    }
   

useEffect(()=>{
  setLogin(false)
},[setLogin])
    return <section className="p-8"  style={{backgroundImage:`url(${backgroundimage})`,opacity:0.7,backgroundColor:'#300',backgroundRepeat:'no-repeat',backgroundSize:'cover'}}>
      <h1 className="text-6xl">Kingdom High School</h1>
      <div className="flex container my-container items-center justify-space-between mr-8">
      <div className="flex flex-grow-3 w-full flex-col items-centre justify-center mx-8">
        <section className="w-full">
        <Card className="mt-6  w-96 w-full mr-8">
      <CardBody>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="mb-4 h-12 w-12 text-blue-500"
        >
          <path
            fillRule="evenodd"
            d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-4.131A15.838 15.838 0 016.382 15H2.25a.75.75 0 01-.75-.75 6.75 6.75 0 017.815-6.666zM15 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"
            clipRule="evenodd"
          />
          <path d="M5.26 17.242a.75.75 0 10-.897-1.203 5.243 5.243 0 00-2.05 5.022.75.75 0 00.625.627 5.243 5.243 0 005.022-2.051.75.75 0 10-1.202-.897 3.744 3.744 0 01-3.008 1.51c0-1.23.592-2.323 1.51-3.008z" />
        </svg>
        <Typography variant="h5" color="blue-gray" className="mb-2">
          Kingdom Vision
        </Typography>
        <Typography>
          Because it&apos;s about motivating the doers. Because I&apos;m here to
          follow my dreams and inspire others.
        </Typography>
      </CardBody>
      
    </Card>
    <Card className="mt-6 w-96 w-full mr-8">
      <CardBody>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="mb-4 h-12 w-12 text-blue-500"
        >
          <path
            fillRule="evenodd"
            d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-4.131A15.838 15.838 0 016.382 15H2.25a.75.75 0 01-.75-.75 6.75 6.75 0 017.815-6.666zM15 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"
            clipRule="evenodd"
          />
          <path d="M5.26 17.242a.75.75 0 10-.897-1.203 5.243 5.243 0 00-2.05 5.022.75.75 0 00.625.627 5.243 5.243 0 005.022-2.051.75.75 0 10-1.202-.897 3.744 3.744 0 01-3.008 1.51c0-1.23.592-2.323 1.51-3.008z" />
        </svg>
        <Typography variant="h5" color="blue-gray" className="mb-2">
          Kingdom Mission
        </Typography>
        <Typography>
          Because it&apos;s about motivating the doers. Because I&apos;m here to
          follow my dreams and inspire others.
        </Typography>
      </CardBody>
      
    </Card>
    <Card className="mt-6 w-96 w-full mr-8">
      <CardBody>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="mb-4 h-12 w-12 text-blue-500"
        >
          <path
            fillRule="evenodd"
            d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-4.131A15.838 15.838 0 016.382 15H2.25a.75.75 0 01-.75-.75 6.75 6.75 0 017.815-6.666zM15 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"
            clipRule="evenodd"
          />
          <path d="M5.26 17.242a.75.75 0 10-.897-1.203 5.243 5.243 0 00-2.05 5.022.75.75 0 00.625.627 5.243 5.243 0 005.022-2.051.75.75 0 10-1.202-.897 3.744 3.744 0 01-3.008 1.51c0-1.23.592-2.323 1.51-3.008z" />
        </svg>
        <Typography variant="h5" color="blue-gray" className="mb-2">
          Kingdom Values
        </Typography>
        <Typography>
          Because it&apos;s about motivating the doers. Because I&apos;m here to
          follow my dreams and inspire others.
        </Typography>
      </CardBody>
      
    </Card>
        </section>
      </div>
      
  <div className="flex flex-col w-full items-center justify-center lg:px-6 lg:pb-8 pt-0 sm:py-10 md:items-center sm:items-center  mx-auto md:h-screen lg:py-0">
      <NavLink to="home" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="w-8 h-8 mr-2 color:gray-900" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo"/>
          <h1 className="text-gray-900">Kingdom School Portal</h1>   
      </NavLink>
      <div className="w-full bg-gray-100 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-grey-700 dark:border-grey-700">
          <div className="px-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-grey-700 md:text-2xl dark:text-white">
                  Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" action="#">
                  <div className="" >
                      <label htmlFor="userId" className="block mb-2 text-sm font-medium text-grey-700 dark:text-grey-600">Your Id</label>
                      <input value={userId} onChange={e=>setId(e.target.value)} type="text" name="userId" id="userId" className="bg-white-900 border border-gray-500 text-gray-600 md:text-md rounded-lg focus:ring-grey-500 focus:border-grey-700 block w-full p-2.5 grey:bg-grey-700 grey:border-grey-900 grey:placeholder-grey-400 grey:text-grey focus:outline-none focus:border-2 placeholder-grey-400 focus:shadow-outline-grey" placeholder="XXX/####" required=""/>
                      
                  </div>

                  
                    <div className="relative">

                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-grey-700 dark:text-grey">Password</label>
                      <input value={password} onChange={e=>setPassword(e.target.value)} type={showPassword?'text':"password"} name="password" id="password" placeholder="••••••••" className="bg-white-900 border border-gray-500 text-gray-600 md:text-md rounded-lg focus:ring-grey-500 focus:border-grey-600 block w-full p-2.5 grey:bg-grey-700 grey:border-grey-900 gray:placeholder-gray-400 gray:text-gray focus:outline-none focus:border-2 placeholder-gray-400 focus:shadow-outline-gray" required=""/>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pt-6">
    {showPassword ? (
      <FaEyeSlash
        className="text-grey-400 cursor-pointer"
        onClick={togglePasswordVisibility}
      />
    ) : (
      <FaEye
        className="text-grey-400 cursor-pointer"
        onClick={togglePasswordVisibility}
      />
    )}
  </div>
                  </div>
                  <div className="flex items-center justify-between">
                      <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required=""/>
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                          </div>
                      </div>
                     <a href="home" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">Forgot password?</a>
                  </div>
                  <button type="button" onClick={authenticate}  className="w-full text-white bg-gray-900 hover:bg-grey-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                  
              </form>
              <p className="text-red-500" >{message}</p>
          </div>
      </div>
  </div>
  </div>
</section>
}
export default Login

// "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"