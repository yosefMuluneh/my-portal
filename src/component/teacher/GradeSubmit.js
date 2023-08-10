import { useEffect } from "react"
import { useLoginContext } from "../../context"

const GradeSubmit = ()=>{
    const {setLogin} = useLoginContext()

    useEffect(()=>{
        setLogin(true)
    },[setLogin])
    return <h1>Submit Grade is COMING SOON ....</h1>
} 
export default GradeSubmit