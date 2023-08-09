import { Textarea,Input,Button,Typography } from "@material-tailwind/react";
import { useState,useEffect } from "react";
import { useLoginContext } from "../../context";
import { FiEdit } from 'react-icons/fi';
import {MdDelete} from 'react-icons/md'
import { IoIosArrowDown,IoIosArrowUp } from "react-icons/io";
import {AiOutlineCloseCircle} from 'react-icons/ai'
import Cookies from "js-cookie";


const Home = () =>{
    const {setLogin}=useLoginContext()
    const [title,setTitle] = useState()
    const [description,setDescritption] = useState()
    const [empty, setEmpty] = useState(false)
    const [message,setMessage] = useState()
    const [success,setSeuccess] = useState()
    const [news,setNews] = useState()
    const [allNews,setAllNews] = useState([])
    const [formattedDate,setFormattedDate] =useState()
    const [dropped,setDropped] = useState(false)
    const [toBeEditedNews,setToBeEditedNews] = useState()
    const [isUpdate,setIsUpdate] = useState(true)
    const [popup,setPopup] = useState(false)
    const [editedtitle,setEditedTitle] = useState("")
    const [editedDescr,setEditedDesc] = useState("")
    const token = Cookies.get("token")
    

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }


    const handleClick = async()=>{
        setEmpty(false)
        setMessage('')
        const news = await fetch("http://localhost:3030/admin/post",{
            method:"post",
            credentials:"include",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            },
            body:JSON.stringify({
                title,
                description
            })

        })
        const data = await news.json()
        if(news.status === 401){
           setMessage(data.message) 
           setEmpty(true)
           await sleep(2500)
           setEmpty(false)
        }else{
            setSeuccess(data.message)
            getNews()
            setEmpty(true)
            await sleep(2500)
            setEmpty(false)
        }
        setTitle('')
        setDescritption('')
    }


    const getNews = async()=>{
        const response = await fetch("http://localhost:3030/admin/news",{
            method:'get',
            credentials:"include",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        })
        const data = await response.json()
        if (response.status === 401){
            setMessage(data.message)
        }else if(response.status === 201){
            console.log(data.news)
            setNews(data.news[data.news.length-1])
            const theNews = data.news
            setAllNews(theNews.reverse())
            const dateString = news?.updatedAt.toString();
            console.log("update string",dateString)
            const dateParts = dateString.split('T');
            const date = new Date(`${dateParts[0]} ${dateParts[1].substring(0, 8)}`);
            let formattedDate = `${date.toLocaleDateString('en-GB')} ${date.toLocaleTimeString('en-GB')}`;
            setFormattedDate(formattedDate)
        }
        
    }
    function formatDate(updatedAt){
        const dateParts = updatedAt.split('T');
            const date = new Date(`${dateParts[0]} ${dateParts[1].substring(0, 8)}`);
            let formattedUpDate = `${date.toLocaleDateString('en-GB')} ${date.toLocaleTimeString('en-GB')}`;
            return formattedUpDate
    }
    const handleEdit = async ()=>{
        const newsId = toBeEditedNews.id
        const response = await fetch(`http://localhost:3030/admin/edit-news/${newsId}`,{
            method:'put',
            credentials:"include",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            },
            body:JSON.stringify({
                editedtitle,
                editedDescr
            })
        })
        const data = await response.json()
        console.log("update message",data.message)

        if (response.status === 500){
            setMessage(data.message)
            await sleep(1500)
            setMessage("")
        }else{
        setMessage(data.message)
        await sleep(1500)
        setMessage("")
        setPopup(false)
        getNews()

        }
    }
    const handledelete = async ()=>{
        const newsId = toBeEditedNews.id
        const response = await fetch(`http://localhost:3030/admin/delete-news/${newsId}`,{
            method:'delete',
            credentials:"include",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            },
        })
        const data = await response.json()
        console.log("delete message",data.message)
        if (response.status === 500){
            setMessage(data.message)
            await sleep(1500)
            setMessage("")
            
        }else{
        setMessage(data.message)
        await sleep(1500)
        setMessage("")
        setPopup(false)
        getNews()

        }
    }
    const editPopUp = (
        <div onClick={()=>setPopup(false)} className="fixed z-20 inset-0 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div  className="my-element w-full px-6 py-4 relative bg-gray-200 rounded-lg">
        <h2 className="px-4 ">{isUpdate ? 'Edit' : "Delete"} News or Announcement</h2>
        <AiOutlineCloseCircle className="absolute right-6 top-6 cursor-pointer" size={24} onClick={()=>setPopup(false)} color="red"></AiOutlineCloseCircle>
        <form className="flex flex-col gap-6 px-4 py-6 md:px-10 md:py-8 md:items-left w-full">
          <Input value={editedtitle} onChange={e=>setEditedTitle(e.target.value)} variant="standard" label="Title" />
          <Textarea value={editedDescr} rows={7} onChange={e=>setEditedDesc(e.target.value)} variant="outlined" label="Description" className="bg-white h-48" />
          <div className="flex flex-row w-full  lg:px-32 items-center justify-center">
            <Button variant="outlined"  className="border-2 w-full  border-gray-700 text-gray-700 hover:bg-gray-900 hover:border-transparent hover:text-white"  onClick={isUpdate ? handleEdit : handledelete} size="lg">{isUpdate ? 'Edit' : "Delete"}</Button>
          
          </div>
          
            <div>
              <p className="text-green-500">{message}</p>
            </div>
          
        </form>
      </div>
    </div>
    )

    useEffect(()=>{
        getNews()
        setLogin(true)
    },[setLogin])

    return <div>
        {
            popup ? (<div >
                {editPopUp}
            </div>):(<div></div>)}
        <div>
        <div className="flex my-container px-8 w-full justify-center">
        <div className="my-4  p-2.5  w-full my-element border-2 border-gray-300 bg-gray-200 rounded">
        <h2 className="px-4">Post News or Announcement</h2>
            <form className="flex flex-col px-10 md:items-left gap-6  flex-1 w-full">
                <Input value={title} onChange={e=>setTitle(e.target.value)} variant="standard" label="Title" />
                <Textarea value={description} onChange={e=>setDescritption(e.target.value)} variant="outlined" label="Description" className="bg-white h-48" />
                <div>
                <Button variant="outlined" className="border-2 border-gray-700 text-gray-700 hover:bg-gray-900 hover:border-transparent hover:text-white"  onClick={handleClick} size="md">Post</Button>
                </div>
                    {
                        empty &&<div>
                                    <p className="text-red-500">{message}</p>
                                    <p className="text-green-500">{success}</p>
                                </div> 
                    }
            </form>
        
    </div>
    <div className="relative flex flex-col gap-2 pb-10 pr-10 px-6 bg-grey-100 my-4 my-element w-full border border-grey-200 rounded-lg shadow dark:bg-gray-800 dark:border-blue-700 py-4">
        <h3>Latest news</h3>
        <div className="px-6">
            <div className="flex space-between">
                <h5 className="flex-1 w-64 mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{news?.title}</h5>
                <p className="dark:text-gray-400 text-gray-500">{news?.postedBy}</p>
            </div>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{news?.description}</p>
            <div className="flex mt-16 gap-6  pt-12 left-8">
                <FiEdit size={24} className="text-grey-400 cursor-pointer"
                    onClick={()=>{setToBeEditedNews(news);setIsUpdate(true);setPopup(true);setEditedTitle(news?.title);setEditedDesc(news?.description)}}></FiEdit>
                <MdDelete size={24} className="text-grey-400 cursor-pointer"
                    onClick={()=>{setIsUpdate(false);setToBeEditedNews(news);setPopup(true);setEditedTitle(news?.title);setEditedDesc(news?.description)}}></MdDelete>
            </div>
            <p className="absolute bottom-8 right-8 pt-10">{formattedDate}</p>
                    
                </div>
                </div>
            
            
    </div>
    <ul className="my-4 mx-8 p-2.5 flex flex-col gap-4 lg:mx-32 ">
        <h3 className="text-2xl">Notices</h3>
        {allNews.length === 0 ? (
  message
) : (
  allNews.map((each) => (
    <Typography
      as="li"
      key={each.id}
      variant="small"
      color="blue-gray"
      onClick={dropped == each.id ? ()=> setDropped(null) : ()=>setDropped(each.id)}
      className="p-4 font-normal hover:text-24 hover:bg-gray-200 border-1 border border-gray-300 rounded"
    >
      <div className="flex relative flex-row items-center justify-space-between gap-6">
        <div>
          <p className="text-bold text-gray-900 text-xl">{each.title}</p>
          <p className="text-12">{formatDate(each.updatedAt)}</p>
        </div>
        <div className="absolute right-8 flex flex-row gap-4">
            <p>{each.postedBy}</p>
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
            <div>
                
            </div>
            <h3 className="mb-4 text-gray-900 text-lg">Description</h3>
            <p>{each.description}</p>
            <div className="flex mt-16 gap-6  pt-12 left-8">
                <FiEdit size={24} className="text-grey-400 cursor-pointer"
                    onClick={()=>{setToBeEditedNews(each);setIsUpdate(true);setPopup(true);setEditedTitle(each.title);setEditedDesc(each.description)}}></FiEdit>
                <MdDelete size={24} className="text-grey-400 cursor-pointer"
                    onClick={()=>{setToBeEditedNews(each);setIsUpdate(false);setPopup(true);setEditedTitle(each.title);setEditedDesc(each.description)}}></MdDelete>
            </div>
            </div>:<div></div>
      }
    </Typography>
  ))
)}
</ul>
</div>
    </div>
}
export default Home





