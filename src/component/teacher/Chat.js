import { useEffect } from "react"
import { useLoginContext } from "../../context"

const ChatClass = ()=>{
    const {setLogin} = useLoginContext()

    useEffect(()=>{
        setLogin(true)
    },[setLogin])
    return <h1>Chat Room is COMING SOON ....</h1>
} 
export default ChatClass