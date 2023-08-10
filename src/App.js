import Home from './component/admin/Home';
import Nav from './component/Nav';
import Login from './Login';
import News from './component/student/News';
import Chat from './component/student/Chat';
import ChatClass from './component/teacher/Chat';
import Register from './component/admin/Register';
import AssignTeacher from './component/admin/AssignTeacher'
import './App.css';
import { useLoginContext } from './context';
import { BrowserRouter, Routes,Route,useLocation} from 'react-router-dom';
import { useState } from 'react';
import RegisterStudent from './component/admin/RegisterStudent';
import { useEffect } from 'react';
import Assessement from './component/student/Assessment';
import Grade from './component/student/Grade';
import withAuth from './authorize';
import TeacherAssessment from './component/teacher/Assessment';
import GradeSubmit from './component/teacher/GradeSubmit';

function App() {
  const [auth,setAuth]=useState('')
  const {login} = useLoginContext()
 // const {userId} = useIdContext()
 
  return (
    <div>
      

    {console.log('login app',login)}
    <BrowserRouter>
    {login && <Nav/>}

    <Routes>
        <Route path="/" element={<Login setAuth={setAuth} auth={auth}></Login>}  ></Route>
        <Route path="admin/home" element={<Home/>} ></Route>
        <Route path='/register-student' element={<RegisterStudent/>}></Route>
        <Route path='/register-teacher' element={<Register/>}></Route>
        <Route path='/assign-teacher' element={<AssignTeacher/>}></Route>
        <Route path="/home" element={<News/>} ></Route>
        <Route path='/my-assessment' element={<Assessement/>}></Route>
        <Route path="/my-grade" element={<Grade/>}></Route>
        <Route path='/student-chat' element={<Chat/>}></Route>
        <Route path="/assess-students" element={<TeacherAssessment/>}></Route>
        <Route path="/chat-classes" element={<ChatClass/>}></Route>
        <Route path="/submit-grade" element={<GradeSubmit/>}></Route>

    </Routes>
    </BrowserRouter>
    </div>
      
    
  );
}

export default App;