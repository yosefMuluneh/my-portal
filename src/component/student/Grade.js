import { useEffect } from "react"
import { useLoginContext } from "../../context"


const Grade = () =>{

    const { setLogin } = useLoginContext()

    useEffect(()=>{
        setLogin(true)
    },[])
    return <div>
        News
    </div>
}
export default Grade