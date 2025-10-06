import './App.css'
import Login from './pages/Login'
import { Route, Routes } from 'react-router-dom'
import Inbox from './pages/Inbox'
import MainLayout from './layouts/MainLayout'
function App() {

  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/caixadeentrada' element={<MainLayout><Inbox /></MainLayout>} />
    </Routes>
  )
}

export default App
