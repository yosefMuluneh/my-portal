import { useEffect } from "react"
import { useLoginContext } from "../../context"
import { useState } from "react"
import { NavLink} from "react-router-dom"
import { Typography } from "@material-tailwind/react"
import Cookies from "js-cookie"


const Register = () =>{
    const {setLogin}=useLoginContext()
    const [teachers,setTeachers]=useState([])
    const [fName,setFName]=useState()
    const [lName,setLName]=useState()
    const [teacherId,setTeacherId]=useState()
    const [password,setPassword] = useState()
    const [subject,setSubject] = useState()
    const [message,setMessage] = useState()
    const [success,setSuccess] = useState(false)
    const [teachersIds,setTeachersIds] = useState([])
    const [idAlreadyExist,setIdAlreadyExist]=useState(false)
    const [allCourses,setAllCourses] = useState([])

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
    const registerTeacher = async()=>{
    const token = Cookies.get("token")
    if(!teachersIds.includes(teacherId)){
        const response = await fetch("http://localhost:3030/admin/new-teacher",{
            method:"post",
            credentials:"include",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            },
            body:JSON.stringify({
                teacherId,
                fName,
                lName,
                subject,
                password

            })

        })
        const data = await response.json()
        if(response.status===201){
            setSuccess(true)
            getAllTeachers()
            setMessage(data.message)
            await sleep(1500)
            setMessage("")
        }else{
        setMessage(data.message)
        await sleep(1500)
        setMessage("")
    }
}else{
    setIdAlreadyExist(true)
    setMessage("Id already Exist")
    await sleep(2000)
    setIdAlreadyExist(false)
    setMessage("")
}
}

    const getAllTeachers = async() =>{
    const token = Cookies.get("token")

        const response = await fetch("http://localhost:3030/admin/teachers",{
            method:'get',
            credentials:"include",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        })
        const data =await response.json()
        if(response.status===201){
            setTeachers(data.teachers)
            const allIds=teachers.map(teacher=>(teacher.id))
            setTeachersIds(allIds)
        }else{
            setMessage(data.message)
        }
    }

    const getAllCourses = async() =>{
        const token = Cookies.get("token")
    
            const response = await fetch("http://localhost:3030/admin/all-courses",{
                method:'get',
                credentials:"include",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${token}`
                }
            })
            const data =await response.json()
            if(response.status===200){
                setAllCourses(data.courses)
            }else{
                setMessage(data.message)
            }
        }
    
        
    
    useEffect(()=>{
        setLogin(true)
        getAllTeachers()
        getAllCourses()
    },[setLogin])
    return <div className="flex flex-row  my-container gap-4 w-full justify-center px-8 ">
    <div className="mb-4 pb-8 mt-2 flex pt-10 flex-col w-full gap-2 lg:mb-0 lg:mt-0  round items-center ">
      <NavLink to="home" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="w-8 h-8 mr-2 color:gray-900" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo"/>
          <h1 className="text-gray-900">Kingdom School Portal</h1>   
      </NavLink>
      <div className="w-full bg-gray-100 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-grey-700 dark:border-grey-700">
          <div className="px-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-grey-700 md:text-xl dark:text-white">
                  Register a Teacher
              </h1>
              <form className="space-y-4 md:space-y-6" action="#">
                  <div className="" >
                      <label htmlFor="fName" className="block mb-2 text-sm font-medium text-grey-700 dark:text-grey-600">First Name</label>
                      <input value={fName} onChange={e=>setFName(e.target.value)} type="text" name="userId" id="userId" className="bg-white-900 border border-gray-500 text-gray-600 md:text-md rounded-lg focus:ring-grey-500 focus:border-grey-700 block w-full p-2.5 grey:bg-grey-700 grey:border-grey-900 grey:placeholder-grey-400 grey:text-grey focus:outline-none focus:border-2 placeholder-grey-400 focus:shadow-outline-grey" placeholder="First Name" required=""/>
                      
                  </div>
                  <div className="" >
                      <label htmlFor="lName" className="block mb-2 text-sm font-medium text-grey-700 dark:text-grey-600">Last Name</label>
                      <input value={lName} onChange={e=>setLName(e.target.value)} type="text" name="userId" id="userId" className="bg-white-900 border border-gray-500 text-gray-600 md:text-md rounded-lg focus:ring-grey-500 focus:border-grey-700 block w-full p-2.5 grey:bg-grey-700 grey:border-grey-900 grey:placeholder-grey-400 grey:text-grey focus:outline-none focus:border-2 placeholder-grey-400 focus:shadow-outline-grey" placeholder="Last Name" required=""/>
                      
                  </div>

                  <div className="" >
                      <label htmlFor="teacherId" className="block mb-2 text-sm font-medium text-grey-700 dark:text-grey-600">Teacher's Id</label>
                      <input value={teacherId} onChange={e=>setTeacherId(e.target.value)} type="text" name="userId" id="userId" className={`bg-white-900 border text-gray-600 md:text-md rounded-lg ${idAlreadyExist?'focus:ring-red-500 border-red-500 focus:border-red-700 red:border-red-900':"focus:ring-grey-500 border-gray-500 grey:border-grey-900 focus:border-grey-700"}  block w-full p-2.5 grey:bg-grey-700  grey:placeholder-grey-400 grey:text-grey focus:outline-none  focus:border-2 placeholder-grey-400 focus:shadow-outline-grey`} placeholder="eg. TCH/0136" required=""/>
                      
                  </div>
                  <div className="" >
                      <label htmlFor="subject" className="block mb-2 text-sm font-medium text-grey-700 dark:text-grey-600">Subject / Course</label>
                      <select
        id="dropdown1"
        name="dropdown1"
        
        value={subject}
        onChange={e=>setSubject(e.target.value)}
        
        className="block w-full min-w-150  mt-1 py-2  px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      >
        {
          allCourses.map(course=>( <option key={course} value={course}>{course} </option>

          ))
        }
        
      </select>
                  </div>
                  
                    <div className="relative">

                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-grey-700 dark:text-grey">Password</label>
                      <input value={password} onChange={e=>setPassword(e.target.value)} type={'text'} name="password" id="password" placeholder="••••••••" className="bg-white-900 border border-gray-500 text-gray-600 md:text-md rounded-lg focus:ring-grey-500 focus:border-grey-600 block w-full p-2.5 grey:bg-grey-700 grey:border-grey-900 gray:placeholder-gray-400 gray:text-gray focus:outline-none focus:border-2 placeholder-gray-400 focus:shadow-outline-gray" required=""/>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pt-6">
    
  </div>
                  </div>
                  
                
                  <button type="button" onClick={registerTeacher}  className="w-full text-white bg-gray-900 hover:bg-grey-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-md px-5 h-16 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Register Teacher</button>
                  
              </form>
              <p className={success?"text-green-500":"text-red-500"} >{message}</p>
          </div>
      </div>
  </div>
  <div className=" mb-4 mt-2 flex pt-10 flex-col lg:px-16 w-full gap-2 lg:mb-0 lg:mt-0  round lg:items-center md:items-center sm:items-center ">
  
  <div className="flex flex-row items-center justify-between font-bold bg-gray-100 border rounded-t py-2 mb-0 w-full  px-12">
  <div className="flex flex-col  w-full justify-center items-start">
  <p className="text-gray-900">Teacher</p>
          </div>
           
          <div className="flex flex-col  w-full justify-center items-center">
  <p className="text-gray-900">Teacher Id</p>
          </div>
          <div className="flex flex-col  w-full justify-center items-center">
  <p className="text-gray-900">Course</p>
          </div>
            </div>
        <ul className=" lg:mx-8 py-2.5   w-full flex flex-col gap-4">
  {teachers.length === 0 ? (message) :
    teachers.map((teacher) => (
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        key={teacher.id}
        className="p-4 font-normal hover:text-24 hover:bg-gray-100 border-1 border border-gray-300 rounded"
      >
        <a href='admin/home' className="flex flex-row items-center justify-evenly  px-8">
          <div className="flex flex-col  w-full justify-center items-start">
          {teacher.fName + " " + teacher.lName}
          </div>
          <div className="flex flex-col  w-full justify-center items-center" >
          <p className="text-12">{teacher.id}</p>
            </div>
            <div className="flex flex-col  w-full justify-center items-center">
            <p className="text-12 ">{teacher.subject}</p>
            </div>
          
        </a>
      </Typography>
    ))
  }
</ul>
    </div>
  </div>
}
export default Register