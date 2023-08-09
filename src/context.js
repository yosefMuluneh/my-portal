import { 
    useState, useContext
 } from "react";

 import { createContext } from "react";

 export const LoginContext = createContext()
 export const IdContext = createContext()
 export const AuthContext = createContext()

 export const LoginContextProvider = ({children})=>{
    const [login,setLogin] = useState(false)
    return <LoginContext.Provider value={{login,setLogin}}>
        {children}
    </LoginContext.Provider>
 }
 export const useLoginContext = ()=>{
    return useContext(LoginContext)
 }

 export const IdContextProvider = ({children})=>{
   const [userId,setId] = useState('')

   return <IdContext.Provider value={{userId, setId}}>
      {children}
   </IdContext.Provider>
 }

 export const useIdContext = ()=>{
   return useContext(IdContext)
 }

 export const AuthContextProvider = ({children})=>{
   const [auth,setAuth] = useState('')
   return <AuthContext.Provider value={{auth,setAuth}}>
      {children}
   </AuthContext.Provider>
 }

 export const useAuthContext=()=>{
   return useContext(AuthContext)
 }