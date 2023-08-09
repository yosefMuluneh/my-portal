import { useEffect } from "react"
import { useLoginContext } from "../../context"
import { useState } from "react"
import { IoIosArrowDropdownCircle,IoIosArrowDropupCircle } from "react-icons/io"
import { Typography } from "@material-tailwind/react"
import Cookies from "js-cookie"
const Assessement = () =>{
    const token = Cookies.get("token")
    const myId = Cookies.get("userId")
    const {setLogin}=useLoginContext()
    const [assessments,setAssessment]=useState([])
    const [assessType,setAssessType] = useState()
    const [message,setMessage] = useState('')
    const [dropped,setDropped] = useState()

    const loadMyAssessment= async()=>{
        const userId = myId.split("/")[0]+ myId.split("/")[1]

        const response = await fetch(`http://localhost:3030/student/my-assessment/${userId}`,{
            method:'get',
            credentials:"include",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        })

        const data = await response.json()
        if(response.status === 200){
            setAssessment(data.myassessment)
            const takeType = data.myassessment.map(each=>{
                const key = each.mycourse
                const value = Object.keys(JSON.parse(each.assessments))
                return { [key] : value}
            })
            const intoOneObj =  takeType.reduce((result,current)=>{
                return Object.assign(result,current)
              },{})
            setAssessType(intoOneObj)
        }else{
            setMessage(data.message)
        }
    }
    useEffect(()=>{
        setLogin(true)
        loadMyAssessment()
    },[setLogin])
    return <div>
    <ul className="my-4 mx-8 p-2.5  flex flex-col gap-4 lg:mx-32 ">
      <h3 className="text-2xl lg:pl-16">Courses</h3>
      {assessments?.length === 0 ? (
message
) : (
assessments?.map((assessment) => (
  <Typography
    as="li"
    key={assessment.mycourse}
    variant="small"
    color="blue-gray"
    onClick={(e) => dropped === assessment?.mycourse ?setDropped(null): setDropped(assessment?.mycourse)}
    className="p-4 pb-6 font-normal lg:mx-16 hover:text-24 hover:bg-gray-100 border-1 border border-gray-300 rounded"
  >
    <div className="flex relative flex-row items-center justify-space-between gap-6">
    <div className="flex flex-row justify-between">
        <p className="text-xl text-gray-800 font-bold">{assessment?.mycourse} </p>
        
      </div>
      <div className="absolute right-4 flex flex-row items-center gap-4">
        <p className="text-xl text-gray-800 font-bold">{assessment?.myteacher}</p>
         
        {dropped === assessment?.mycourse ? (
          <IoIosArrowDropupCircle size={24} onClick={(e) => setDropped(null)} />
        ) : (
          <IoIosArrowDropdownCircle size={24} onClick={(e) => setDropped(assessment?.mycourse)} />
        )}
      </div>
    </div>
    {
      dropped === assessment?.mycourse ? <div className="px-8 my-4">
          <div className="h-2 w-full "></div>
          <div className="flex flex-row items-row justify-center">
          <h3 className="mb-4 text-gray-900 text-lg">Assessements</h3>

          </div>
          <div className="z-10 lg:px-16 text-gry flex flex-col ">
          <div className="flex flex-row items-center justify-between bg-gray-400 border rounded-t  py-2 gap-24 lg:px-16 md:px-16">
            <p className="text-gray-900">Type</p>
            <p className="text-gray-900 ">Base Mark</p>
            <p className="text-gray-900">My Mark</p></div>
           { assessType[assessment?.mycourse].map(eachasses=>(
          <div className="flex flex-row  items-center justify-between py-2 bg-gray-200 my-1 hover:bg-gray-300 gap-24 lg:px-16 md:px-16">
            <p className="font-bold mr-0  flex items-center justify-center">{eachasses} </p> 
            <p> {JSON.parse(assessment?.assessments)[eachasses][1]}</p>
             <p > {JSON.parse(assessment?.assessments)[eachasses][0]}</p>
             </div> 
           ))}
    
    </div>
          <p className="text-red-500 pt-4">{message}</p>
          </div>:<div></div>
    }
  </Typography>
))
)}
</ul>
  </div>
  
}
export default Assessement