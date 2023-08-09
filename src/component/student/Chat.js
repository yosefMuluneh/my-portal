import { useEffect } from "react"
import { useLoginContext } from "../../context"

const Chat = ()=>{
    const { setLogin } = useLoginContext()

    useEffect(()=>{
        setLogin(true)
    },[])
    return <h1>Chat Room</h1>
} 
export default Chat