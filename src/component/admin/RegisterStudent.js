import { useEffect } from "react"
import { useLoginContext } from "../../context"
import { useState } from "react"
import { NavLink} from "react-router-dom"
import { Typography } from "@material-tailwind/react"
import {IoIosArrowDown,IoIosArrowUp} from 'react-icons/io'
import Cookies from "js-cookie"

const RegisterStudent = () =>{
    const {setLogin}=useLoginContext()
    const [classes,setClasses] = useState([])
    const [fName,setFName]=useState()
    const [lName,setLName]=useState()
    const [studentId,setStudentId]=useState()
    const [password,setPassword] = useState()
    const [classSection,setClassSection] = useState()
    const [message,setMessage] = useState()
    const [success,setSuccess] = useState(false)
    const [allIds,setAllIds] = useState([])
    const [idAlreadyExist,setIdAlreadyExist]=useState(false)
    const [dropped,setDropped] = useState(false)

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
    const registerStudent = async()=>{
    const token = Cookies.get("token")
    if(!allIds.includes(studentId)){
        const response = await fetch("http://localhost:3030/admin/new-student",{
            method:"post",
            credentials:"include",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            },
            body:JSON.stringify({
                studentId,
                fName,
                lName,
                classSection,
                password

            })

        })
        const data = await response.json()
        if(response.status===201){
            setSuccess(true)
            setMessage(data.message)
            getAllClasses()
        }else{
        setMessage(data.message)
    }
}else{
    setIdAlreadyExist(true)
    setMessage("Id already exists")
    await sleep(2000)
    setIdAlreadyExist(false)
    setMessage("")
}
}

    const getAllClasses = async() =>{
    const token = Cookies.get("token")

        const response = await fetch("http://localhost:3030/admin/all-classes",{
            method:'get',
            credentials:"include",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        })
        const data =await response.json()
        if(response.status===201){
            setClasses(data.classes)
            const holdAllStu = data.classes.map(each=>(each.students))
            console.log("holding ",holdAllStu)
            const parsedStu = holdAllStu.map(stu=>JSON.parse(stu))
            console.log("parsed ones",parsedStu)
            const toBeConcat = parsedStu.map(single=>Object.keys(single))
            const concated = [].concat(...toBeConcat)
            setAllIds(concated)
            console.log("all my ids",allIds)
        }else{
            setMessage(data.message)
        }
    }
    
        
    
    useEffect(()=>{
        setLogin(true)
        getAllClasses()
    },[setLogin])
    return <div className="flex flex-row  my-container w-full justify-center px-8 ">
    <div className="mb-4 pb-8 mt-2 flex pt-10 flex-col w-full gap-2 lg:mb-0 lg:mt-0  round lg:items-center md:items-center sm:items-center ">
      <NavLink to="home" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="w-8 h-8 mr-2 color:gray-900" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo"/>
          <h1 className="text-gray-900">Kingdom School Portal</h1>   
      </NavLink>
      <div className="w-full bg-gray-100 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-grey-700 dark:border-grey-700">
          <div className="px-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-grey-700 md:text-xl dark:text-white">
                  Register a Student
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
                      <label htmlFor="studentId" className="block mb-2 text-sm font-medium text-grey-700 dark:text-grey-600">Student's Id</label>
                      <input value={studentId} onChange={e=>setStudentId(e.target.value)} type="text" name="userId" id="userId" className={`bg-white-900 border text-gray-600 md:text-md rounded-lg ${idAlreadyExist?'focus:ring-red-500 border-red-500 focus:border-red-700 red:border-red-900':"focus:ring-grey-500 border-gray-500 grey:border-grey-900 focus:border-grey-700"}  block w-full p-2.5 grey:bg-grey-700  grey:placeholder-grey-400 grey:text-grey focus:outline-none  focus:border-2 placeholder-grey-400 focus:shadow-outline-grey`} placeholder="XXX/####" required=""/>
                      
                  </div>
                  <div className="" >
                      <label htmlFor="classSection" className="block mb-2 text-sm font-medium text-grey-700 dark:text-grey-600">Class & section</label>
                      <select
        id="dropdown1"
        name="dropdown1"
        value={classSection}
        onChange={e=>setClassSection(e.target.value)}
        
        className="block w-full min-w-150  mt-1 py-2  px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      >
        {
          classes.map(eachclass=>(<option key={eachclass.id} value={eachclass.id}>{eachclass.id.substring(0, eachclass.id.length - 2)}</option>

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
                  
                
                  <button type="button" onClick={registerStudent}  className="w-full text-white bg-gray-900 hover:bg-grey-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-md px-5 h-16 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Register Student</button>
                  
              </form>
              <p className={success?"text-green-500":"text-red-500"} >{message}</p>
          </div>
      </div>
  </div>
  <div className=" mb-4 mt-2 flex pt-10 flex-col w-full gap-2 lg:mb-0 lg:mt-0  round lg:items-center md:items-center sm:items-center ">
  
        <h3  className="text-gray-700 text-2xl">
          Classes
        </h3>
        <ul className="my-4 lg:mx-8 p-2.5  w-full flex flex-col gap-4">
        {classes.length === 0 ? (
  message
) : (
  classes.map((each) => (
    <Typography
      as="li"
      key={each.id}
      onClick={e=>{dropped===each.id ? setDropped(null):setDropped(each.id)}}
      variant="small"
      color="blue-gray"
      className="p-4 font-normal hover:text-24 hover:bg-gray-100 border-1 border border-gray-300 rounded"
    >
      <div className="flex relative flex-row items-center justify-space-between gap-6">
        <div>
          <p>{each.id.substring(0, each.id.length - 2)}</p>
          <p className="text-12">class Id - {each.id}</p>
        </div>
        <div className="absolute right-4">
          {dropped === each.id ? (
            <IoIosArrowUp size={18} onClick={(e) => setDropped(null)} />
          ) : (
            <IoIosArrowDown size={18} onClick={(e) => setDropped(each.id)} />
          )}
        </div>
      </div>
      {
        dropped === each.id ? <div className="px-8 my-4">
            <div className="bg-gray-300 h-0.5 w-full"></div>
            <h3 className="mb-4">Students</h3>
            {Object.keys(JSON.parse(each.students)).map(every=>(<p>{JSON.parse(each.students)[every]} -- {every} </p>))}</div>:<div></div>
      }
    </Typography>
  ))
)}
</ul>
    </div>
  </div>
}
export default RegisterStudent