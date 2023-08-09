import { useEffect,useState } from "react"
import { useLoginContext } from "../../context"
import { IoIosArrowDropdown,IoIosArrowDropup } from "react-icons/io"
import { Typography } from "@material-tailwind/react"
import Cookies from "js-cookie"

const AssignTeacher = () =>{
    const {setLogin} = useLoginContext()
    const [success,setSuccess]=useState(true)
    const [classes,setClasses] = useState([])
    const [teachers,setTeachers]=useState([])
    const [dropped,setDropped]=useState()
    const [message,setMessage] = useState()
    const [allIds,setAllIds] = useState()
    const [selectedOption1, setSelectedOption1] = useState('Select a Teacher');
    const [courseTeacher,setCourseTeacher] = useState([])
    const [selectedOnes,setSelectedOnes]=useState({})
    
    const handleOption1Change = (event,thecourse,clsId) =>{
      console.log("to be assigned", event.target.value)
      const tempoArray = courseTeacher
      tempoArray.push(event.target.value)
      setCourseTeacher(tempoArray)
      console.log("arrays of course-teacher",courseTeacher)
      let holder = selectedOnes
      holder[thecourse+clsId]=event.target.value
      setSelectedOnes(holder)
      console.log("selected ones",selectedOnes)
      setSelectedOption1(event.target.value);

    }
    const assignTeachers = async(theClassId)=>{
      const token = Cookies.get("token")
      console.log("check working", courseTeacher)
      console.log("check working", theClassId)

      function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
      const assign = await fetch(`http://localhost:3030/admin/assign-teachers/${theClassId}`,{
            method:"post",
            credentials:"include",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            },
            body:JSON.stringify({
              assignedTeachers:courseTeacher
            })

        })

        const data = await assign.json()
        if(assign.status ===200){
          setSuccess(true)
          setMessage(data.message)
          getAllClasses()
        getAllTeachers()
          await sleep(2000)
          setMessage("")
        }else{setSuccess(false)
        setMessage(data.message)
        getAllClasses()
        getAllTeachers()
        setCourseTeacher([])}
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
              const parsedStu = holdAllStu.map(stu=>JSON.parse(stu))
              console.log("parsed ones",parsedStu)
              const toBeConcat = parsedStu.map(single=>Object.keys(single))
              const concated = [].concat(...toBeConcat)
              setAllIds(concated)
              console.log("all my ids",allIds)
          }else{
            setSuccess(false)
              setMessage(data.message)
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
          }else{
              setSuccess(false)
              setMessage(data.message)
          }
      }
      
      
      
      useEffect(()=>{
          setLogin(true)
          getAllTeachers()
          getAllClasses()
      },[setLogin])
    
    return <div>
      <ul className="my-4 mx-8 p-2.5  flex flex-col gap-4 lg:mx-32 ">
        <h3 className="text-2xl lg:pl-16">Classes</h3>
        {classes.length === 0 ? (
  message
) : (
  classes.map((each) => (
    <Typography
      as="li"
      key={each.id}
      variant="small"
      color="blue-gray"
      className="p-4 pb-6 font-normal lg:mx-16 hover:text-24 hover:bg-gray-100 border-1 border border-gray-300 rounded"
    >
      <div onClick={(e) => dropped === each.id ? setDropped(null):setDropped(each.id)} className="flex relative flex-row items-center justify-space-between gap-6">
      <div>
          <p>{each.id.substring(0, each.id.length - 2)}</p>
          <p className="text-12">class Id - {each.id}</p>
        </div>
        <div className="absolute right-4 flex flex-row gap-4">
           
          {dropped === each.id ? (
            <IoIosArrowDropup size={24} className="cursor-pointer" onClick={(e) => setDropped(null)} />
          ) : (
            <IoIosArrowDropdown size={24} onClick={(e) => setDropped(each.id)} />
          )}
        </div>
      </div>
      {
        dropped === each.id ? <div className="px-8 my-4">
            <div className="bg-gray-300 h-0.5 w-full"></div>
            <div>
                
            </div>
            <h3 className="mb-4 text-gray-900 text-lg">Courses</h3>
            <div className="z-10">
              {
                JSON.parse(each.courses).map(thecourse=>(
                  <div key={thecourse} className="mb-4">
<label htmlFor="dropdown1" className="block  flex flex-row items-center gap-1  text-gray-700">
       <p className="text-xl sm:text-sm text-gray-900  font-bold ">{thecourse}</p>
       <div className="my-container  mx-0 gap-2">
        <div className="flex items-start  mx-0 ">
        name -- {JSON.parse(each.teacher)[thecourse]?.toString().split(",")[0].substring(1)}
        </div>
        <div>
        Id -- {JSON.parse(each.teacher)[thecourse]?.toString().split(",")[1].slice(0,-1)}
          </div>  
      </div>
      </label>
      <select
        id={thecourse}
        name={thecourse}
        key={thecourse}
        value={selectedOption1}
        onChange={(e)=>{handleOption1Change(e,thecourse,each.id);e.preventDefault()}}
        
        className="block w-full min-w-150  mt-1 py-2 pb-4 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-600 focus:border-gray-600 sm:text-sm"
      >
        <option  value={selectedOption1}>{ selectedOnes[thecourse+each.id] ? selectedOnes[thecourse+each.id]?.split("[")[1].split(",")[0]:JSON.parse(each.teacher)[thecourse]?JSON.parse(each.teacher)[thecourse]?.toString().split(",")[0].substring(1):"Select a teacher below"}</option>
        {
          teachers.map(teacher=>(
            teacher.subject === thecourse ? <option key={teacher.id} value={`{ "${thecourse}":"[${teacher.fName} ${teacher.lName},${teacher.id}]" }`}>{teacher.fName} {teacher.lName}</option>:""

          ))
        }
        
      </select>
                  </div>
                ))
              }
      
      </div>
      <button type="button" onClick={()=>assignTeachers(each.id)}  className="w-full text-white bg-gray-900 hover:bg-grey-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Assign Teachers</button>
            <p className={success?"text-green-500 pt-4":"text-red-500 pt-4"}>{message}</p>
            </div>:<div></div>
      }
    </Typography>
  ))
)}
</ul>
    </div>
    
}
export default AssignTeacher


