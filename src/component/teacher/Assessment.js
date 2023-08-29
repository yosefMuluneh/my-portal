import { Button, Typography,Input } from "@material-tailwind/react"
import { useEffect,useState } from "react"
import { useLoginContext } from "../../context"
import Cookies from "js-cookie"
import {IoIosArrowDropdownCircle,IoIosArrowDropupCircle} from 'react-icons/io'
import { MdRemoveCircleOutline } from "react-icons/md"

const TeacherAssessment = () =>{
    const {setLogin} = useLoginContext()
    const [myclasses,setMyClasses] = useState([])
    const [dropped,setDropped] = useState()
    const [message,setMessage] = useState('')
    const [studentsId,setStudentsId] = useState([])
    const [students,setStudents] = useState({})
    const [assessType,setAssessType] = useState()
    const [mysubject,setMySubject] = useState()
    const [oursAssessments,setOurAssessments] = useState()
    const [totalMarks,setTotalMarks] = useState({})
    const [popup,setPopup] = useState(false)
    const [newAssess,setNewAssess] = useState('')
    const [baseMark,setBaseMark] = useState('')
    const [inputValues,setInputValues] = useState({})
    const [classId,setClassId] = useState()
    const [success,setSuccess] = useState(false)
    const [isEdit,setIsEdit] = useState(false)
    const [isRemove,setRemove] = useState(false)
    const [editValues,setEditValues] = useState({})
    const [isHundred,setIsHundred] = useState(0)
    const token = Cookies.get("token")

    const loadProfile = async()=>{
        const userId = Cookies.get("userId")
        const myId = userId.split("/")[0]+ userId.split("/")[1]
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
          setMyClasses(JSON.parse(data.user.assignedClasses))
          setMySubject(data.user.subject)
          Cookies.set("subject",mysubject)
        }else{
          setSuccess(false)
          setMessage(data.message)
        }
    }

    const eachClassStudent =async(myclass)=>{
        setStudentsId([])
        setStudents([])
        setClassId(myclass)
        console.log(classId)
        const response = await fetch(`http://localhost:3030/teacher/class-students/${myclass}`,{
            method:'get',
            credentials:"include",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        })

        const data = await response.json()
        if(response.status===200){
            const studs = data.students
            console.log(data)
            setStudents(studs)
            setStudentsId(Object.keys(studs))
        }
    }
    const loadStudentAssessment= async(myclass)=>{
        setAssessType([])
        setOurAssessments([])
        setClassId(myclass)
        console.log("to load assessments--",classId)
        const response = await fetch(`http://localhost:3030/teacher/student-assessment/${myclass}/${mysubject}`,{
            method:'get',
            credentials:"include",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        })

        const data = await response.json()
        if(response.status === 200){
            console.log("lets ahve alook",data.myassessment)

            const takeType = data.myassessment.map(each=>{
                const key = each.mycourse
                const value = Object.keys(JSON.parse(each.assessments))
                return { [key] : value}
            })
            console.log("what is take type",takeType)

            const mypoints = data.myassessment.map(each=>{
                const char = '/'
                const key = each.stuId.slice(0, 3) + char + each.stuId.slice(3);
                const value = JSON.parse(each.assessments)
                return {[key] : value}
            })
            console.log("my points are",mypoints)
            
            const ourPoints = mypoints.reduce((result,current)=>{
                return Object.assign(result,current)
            },{})

            console.log("these are our points",ourPoints)
            setOurAssessments(ourPoints)

            const intoOneObj =  takeType.reduce((result,current)=>{
                return Object.assign(result,current)
              },{})

              console.log("into one obj",intoOneObj)
            setAssessType(intoOneObj)

            const ourStudents = Object.keys(ourPoints)
             const ourMarks = ourStudents.map(eachStu=>{
              let initialPoint = 0
              let toBeHundred = 0
              const myMarks = intoOneObj[mysubject].map(eachasses=>{
                initialPoint+=JSON.parse(ourPoints[eachStu][eachasses])[0]
                toBeHundred+=JSON.parse(ourPoints[eachStu][eachasses])[1]

                
              })
              setIsHundred(toBeHundred)
              return {[eachStu]:initialPoint}
            })
            console.log("summed up marks",ourMarks)
            const ourMarksObj = ourMarks.reduce((current,result)=>{
              return Object.assign(current,result)
            },{})
            console.log("summed up marks Obj",ourMarksObj)
            setTotalMarks(ourMarksObj)

        }else{
          setSuccess(false)
            setMessage(data.message)
        }
    }

    const handleChange = (index, event) => {
      
        const newInputValues = { ...inputValues };
        newInputValues[index] = event.target.value;
        setInputValues(newInputValues);
        console.log(newInputValues)
      
  
};


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
    const submitAssessment = async()=>{
      const myname = Cookies.get("myname")
      const response = await fetch(`http://localhost:3030/teacher/submit-assessment/${classId}/${mysubject}`,{
            method:'post',
            credentials:"include",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            },
            body:JSON.stringify({
              assessname:newAssess,
              baseMark:parseInt(baseMark),
              marks:inputValues,
              students,
              myname
            })
        })

        console.log("response after submit",response)
        const data = await response.json()
        if(response.status === 201){
          setSuccess(true)
          setMessage(data.message)
          loadStudentAssessment(classId)
          await sleep(1500)
          setPopup(false)
          setMessage("")
        }
        setSuccess(false)
        setMessage(data.message)
        console.log(response.status)
        await sleep(1500)
        setMessage("")
        
    }


    const handleEditChange = (index,event,tobeEdited,myBaseMark)=>{
      const newInputValues = { ...editValues };
      const mylist = newInputValues[index] ? newInputValues[index] : {}
      mylist[tobeEdited]=[parseFloat(event.target.value),myBaseMark]
      newInputValues[index] = mylist;
      setEditValues(newInputValues);
      console.log(newInputValues)
    }

    const editAssessment =async () =>{
      const response = await fetch(`http://localhost:3030/teacher/edit-assessment/${classId}/${mysubject}`,{
            method:'put',
            credentials:"include",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            },
            body:JSON.stringify({
              editValues
            })
        })
        const data = await response.json()
        if (response.status === 201){
          setSuccess(true)
          setMessage(data.message)
          loadStudentAssessment(classId)
          await sleep(1500)
          setMessage("")
          setPopup(false)
        }
        setSuccess(false)
        setMessage(data.message)
        console.log(response.status)
        await sleep(1500)
        setMessage("")
    }

    const removeAssessment = (theassess) =>{
      console.log(theassess)
    }

    const submitMarks = async() =>{
      const response = await fetch(`http://localhost:3030/teacher/submit-marks/${classId}/${mysubject}`,{
        method:'post',
        credentials : 'include',
        headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${token}`
      },
      body:JSON.stringify({
        totalMarks
      })
      })
      const data = await response.json()
      if(response.status === 201){

      }
    }
    const addAssess = (
        <div className="fixed z-20 inset-0 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div  className="my-element  px-6 py-4 relative bg-gray-200 rounded-lg">
        <h2 className="px-4 ">Add New Assessement</h2>
        <form className="flex flex-col gap-6 px-4 py-6 md:px-10 md:py-8 ">
          <Input value={newAssess} required={true} onChange={async(e)=>{!assessType[mysubject].includes(e.target.value)?setNewAssess(e.target.value):setMessage("Assessment name already exist");setSuccess(false);setNewAssess(e.target.value); !assessType[mysubject].includes(e.target.value)?setMessage(''):setMessage("Assessment name already exist") }} variant="standard" label="Assessment" />
          <Input value={baseMark} required={true} onChange={e=>{ parseFloat(e.target.value)+parseFloat(isHundred) <= 100.0 ? setBaseMark(e.target.value):setMessage("The total base mark can not be more than 100");setBaseMark(e.target.value); parseFloat(e.target.value) + parseFloat(isHundred) <= 100 ? setMessage(''):parseFloat(e.target.value) + parseFloat(isHundred) > 100 ? setMessage("The totla base mark can not be more than 100") : setMessage("Base mark for the assessment should be known");
          }} variant="standard" label="Base mark"  />
        <div>
        {
                studentsId.map(eachId=>(
                    <div key={eachId} className="flex flex-row  px-4 py-2 bg-gray-300 my-1">
                        <div className="flex  flex-row gap-3 items-center">
                        <p className="w-36">{students[eachId]}</p>
                        <p className="w-36">{eachId}</p>
                        
                        </div>
                        <div className="flex flex-row gap-3 items-center justify-between">
                    	<Input disabled={parseFloat(baseMark) + parseFloat(isHundred) > 100.0 ? true : false}  onChange={e=>{parseFloat(e.target.value) <= baseMark ? handleChange(eachId,e) : setMessage("mark can not be more than base mark");setSuccess(false)}} key={eachId} variant="outlined" label="mark" color="gray"  className="bg-white-900 border border-gray-500 text-gray-600 md:text-md rounded-lg focus:ring-gray-500 focus:border-gray-500 block p-2.5 gray:bg-gray-500 gray:border-gray-500 gray:placeholder-gray-400 gray:text-gray focus:outline-none focus:border-2 placeholder-gray-400 focus:shadow-outline-gray"></Input>
                       </div>
                    </div>
                ))}
        </div>
          <div className="flex flex-row gap-6  lg:px-32 items-center justify-center">
            <Button variant="filled"  className="border-2 w-64   border-gray-700 text-gray-700 bg-gray-900 hover:border-transparent text-white"  onClick={submitAssessment} size="lg">Submit</Button>
            <Button variant="outlined" color="red"  className="hover:bg-red-900 hover:border-transparent hover:text-white"  onClick={()=>setPopup(false)} size="lg">cancel</Button>
          
          </div>
          
            <div>
              <p className={success ? "text-green-500" : "text-red-500"}>{message}</p>
            </div>
          
        </form>
      </div>
    </div>
    )

    const editPop = (
      <div className="fixed z-20 inset-0 overflow-y-auto overflow-x-auto md:px-16 sm:px-4  bg-gray-500 bg-opacity-75 flex items-center justify-center">
<div  className=" py-4 relative bg-gray-200 overflow-x-auto rounded-lg">
        <h2 className="px-4 ">{isRemove ? "Remove Assessment" : "Edit Assessment"}</h2>
        
        <form className="flex flex-col gap-6 px-4 py-6 items-start md:px-10 md:py-8 md:items-left w-full">
      
      {
        studentsId.length === 0 ? <p>No students</p> : 
        <div className="overflow-x-auto max-w-screen">
            <div className="flex flex-row  px-4 py-3 rounded-t font-bold bg-gray-400 max-w-screen whitespace-no-wrap"> 
            <div className="flex  flex-row gap-3 items-center">
            <h3 className="w-36">Student Name</h3>
                <h3 className="w-36">Student Id</h3>
                
               </div> 
               <div className="inherit">
                {
                <div className="flex flex-row gap-3  sm:mx-0 items-center justify-between whitespace-no-wrap">
                    {
              assessType[mysubject] ?  assessType[mysubject].map(eachasses=>(
                <div key={eachasses} className="flex flex-col  ">
                  <h3 className="w-20"  >{eachasses} </h3>
                  {isRemove ? <MdRemoveCircleOutline color="red" size="md" onClick={e=>removeAssessment(eachasses)} ></MdRemoveCircleOutline> :""}
                </div>
                

    
   )):""}</div>}
            </div>
            </div>
            {
        studentsId.map(eachId=>(
            <div key={eachId} className="flex flex-row  px-4 py-2 bg-gray-300 my-1 ">
                <div className="flex  flex-row gap-3 items-center">
                <p className="w-36">{students[eachId]}</p>
                <p className="w-36">{eachId}</p>
                
                </div>
                <div className="flex flex-row gap-3 items-center justify-between">

                {
               assessType[mysubject] ? assessType[mysubject].map(eachasses=>(
                <div >
                <input disabled={isRemove} onChange={e=>{handleEditChange(eachId,e,eachasses,oursAssessments[eachId][eachasses]?JSON.parse(oursAssessments[eachId][eachasses])[1]:"")}} className="w-20 border-2 border-gray-200 focus:border-gray-400 focus:outline-none px-4 py-2 rounded" label="new mark"  variant="standard" key={eachasses} placeholder={oursAssessments[eachId][eachasses]?JSON.parse(oursAssessments[eachId][eachasses])[0]:""}></input> 
                  </div>
   )):""
   }</div>
            </div>
        ))}
        </div>
    }
    <div className="flex flex-row gap-4">
    <Button onClick={editAssessment} className="w-64 bg-gray-900" >Confirm and Submit</Button>
    <Button className="w-64 hover:bg-red-900 hover:text-white" color="red" variant="outlined" onClick={()=>{setPopup(false);setIsEdit(false)}} size="lg">cancel</Button>
    </div>
    <div>
              <p className={success ? "text-green-500" : "text-red-500"}>{message}</p>
            </div>
    </form>
    
    </div>
    </div>
    )


    useEffect(()=>{
        loadProfile()
        setLogin(true)
    },[setLogin])


    return (
        <div className="w-full lg:px-16">
            {
            popup ? (<div >
                {isEdit ? editPop : addAssess}
            </div>):(<div></div>)}
        <ul className="my-4  p-2.5 flex flex-col gap-4 w-full mx-auto max-w-screen-xl py-2 px-4 lg:px-0 lg:py-4 ">
        <h3 className="text-2xl lg:pl-32">My Classes</h3>
        {myclasses?.length === 0 ? (
  message
) : (
  myclasses?.map((eachclass) => (
    <Typography
      as="li"
      key={eachclass}
      color="blue-gray"
      className="p-4 font-normal  lg:pl-16 hover:text-24 hover:bg-gray-100 border-1 border border-gray-300 rounded"
    >
      <div onClick={(e) => {dropped === eachclass ? setDropped(null):setDropped(eachclass);setClassId(eachclass);eachClassStudent(eachclass);loadStudentAssessment(eachclass)}}>
          <h1 className="font-bold text-gray-900 text-2xl">{eachclass.slice(0,-2)}</h1>
          <div ></div>
        </div>
      <div className=" relative">
        
        <div className="absolute right-4  bottom-2 ">
            
          {dropped === eachclass ? (
            <IoIosArrowDropupCircle size={24} onClick={(e) => {setDropped(null);}} />
          ) : (
            <IoIosArrowDropdownCircle size={24} onClick={(e) =>{ 
                setDropped(eachclass);
                setClassId(eachclass);
                eachClassStudent(eachclass);

                loadStudentAssessment(eachclass);
                }} />
          )}
        </div>
      </div>
      {
        dropped === eachclass ? <div className="w-full max-w-screen my-4 ">
            <div className="flex relative mb-2 pb-2 overflow-x-auto flex-row items-start gap-14 lg:gap-24 md:gap-24  mb-2">
            <h3 className="sm:mt-6  text-gray-900 text-lg font-bold">Students</h3>
            <div className="flex flex-row gap-3 flex-row mr-2">
            <Button onClick={()=>setPopup(true)} size="sm" color="gray" className="bg-blue-gray-700 hover:bg-blue-gray-900 lg:w-32 md:w-32 sm:w-20 "><span>Add New</span> <span className="font-bold lg:text-2xl text-xl"> +</span>  </Button>
            <Button onClick={()=>{setPopup(true);setIsEdit(true)}} size="sm" variant="outlined" color="orange" className="hover:bg-orange-700 lg:w-32 md:w-32 w-20 hover:text-white border border:bg-gray-900"><span>Edit</span> </Button>
            <Button onClick={()=>{setPopup(true);setIsEdit(true);setRemove(true)}} size="sm" variant="outlined" color="red" className="hover:bg-red-700 lg:w-32 md:w-32 w-20  hover:text-white border border:bg-gray-900"><span>Remove</span> </Button>
            <Button onClick={submitMarks} size="sm" variant="outlined" color="green" className="hover:bg-green-700 lg:w-32 md:w-32 w-20  hover:text-white border border:bg-gray-900"><span>Submit Marks</span> </Button>
            
            </div>
            </div>
            {
                studentsId.length === 0 ? <p>No students</p> : 
                <div className="overflow-x-auto  flex flex-col items-start">
                    <div className="flex flex-row items-start px-4 py-3 rounded-t font-bold bg-gray-300 "> 
                    <div className="flex  flex-row gap-3 items-start">
                    <h3 className="w-36">Student Name</h3>
                        <h3 className="w-36">Student Id</h3>
                        
                       </div> 
                       <div className="">
                        {
                        <div className="flex flex-row gap-3  sm:mx-0 items-start justify-between">
                            {
                      assessType[mysubject] ?  assessType[mysubject].map(eachasses=>(
                        <h3 className="w-20"  key={eachasses}>{eachasses} </h3> 

            
           )):""}<h3 className="ml-5">Total</h3></div>}
                    </div>
                    </div>
                    {
                studentsId.map(eachId=>(
                    <div key={eachId} className="flex flex-row  px-4 py-2 bg-gray-200 my-1 ">
                        <div className="flex  flex-row gap-3 items-center">
                        <p className="w-36">{students[eachId]}</p>
                        <p className="w-36">{eachId}</p>
                        
                        </div>
                        <div className="flex flex-row gap-3 items-center justify-between">

                        {
                       assessType[mysubject] ? assessType[mysubject].map(eachasses=>(
                        <h3 className="w-20 " key={eachasses+eachId}>{ oursAssessments[eachId][eachasses]?JSON.parse(oursAssessments[eachId][eachasses])[0]:""}</h3> 
            
           )):""
           }<h3 className="ml-7 mr-3">{totalMarks[eachId]}</h3></div>
                    </div>
                ))}
                </div>
            }
            </div>:<div></div>
      }
    </Typography>
  ))
  
)}

</ul>
</div>
    )
}

export default TeacherAssessment