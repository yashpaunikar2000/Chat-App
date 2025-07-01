import React, { useContext } from 'react'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import { Navigate, Route, Routes } from 'react-router-dom'
import {Toaster} from 'react-hot-toast'
import { Authcontext } from '../context/AuthContext'
const App = () => {
  const {authUser} = useContext(Authcontext)
  return (
    <div className="bg-[url('/bg.jpg')] bg-contain">
      <Toaster />
      <Routes>
        <Route path='/' element={authUser ? <HomePage />:<Navigate to="/login"/>}/>
        <Route path='/login' element={!authUser ? <LoginPage />:<Navigate to="/"/>}/>
        <Route path='/profile' element={authUser ? <ProfilePage />:<Navigate to="/login"/>}/>
      </Routes>
    </div>
  )
}

export default App