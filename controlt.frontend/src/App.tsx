import './App.css'
import Login from './pages/Login'
import { Route, Routes } from 'react-router-dom'
import Inbox from './pages/Inbox'
import MainLayout from './layouts/MainLayout'
import Users from './pages/Users'
import Projects from './pages/Projects'
import Settings from './pages/Settings'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/caixadeentrada' element={<MainLayout><Inbox /></MainLayout>} />
      <Route path='/usuarios' element={<MainLayout><Users /></MainLayout>} />
      <Route path='/projetos' element={<MainLayout><Projects /></MainLayout>} />
      <Route path='/configuracoes' element={<MainLayout><Settings /></MainLayout>} />
    </Routes>
  )
}

export default App
