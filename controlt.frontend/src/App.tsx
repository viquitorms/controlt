import './App.css'
import Login from './pages/Login.page'
import { Route, Routes } from 'react-router-dom'
import Inbox from './pages/Inbox.page'
import MainLayout from './layouts/Main.layout'
import Users from './pages/user/Users.page'
import Settings from './pages/Settings.page'
import References from './pages/References.page'
import Projects from './pages/projects/Project.page'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/caixadeentrada' element={<MainLayout><Inbox /></MainLayout>} />
      <Route path='/usuarios' element={<MainLayout><Users /></MainLayout>} />
      <Route path='/projetos' element={<MainLayout><Projects /></MainLayout>} />
      <Route path='/configuracoes' element={<MainLayout><Settings /></MainLayout>} />
      <Route path='/referencias' element={<MainLayout><References /></MainLayout>} />
    </Routes>
  )
}

export default App
