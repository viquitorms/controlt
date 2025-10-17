import './App.css'
import Login from './pages/Login.page'
import { Navigate, Route, Routes } from 'react-router-dom'
import Inbox from './pages/Inbox.page'
import MainLayout from './layouts/Main.layout'
import Users from './pages/user/Users.page'
import Settings from './pages/Settings.page'
import References from './pages/References.page'
import ProtectedRoute from './components/ProtectedRoute.component'
import Projects from './pages/project/Projects.page'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/caixadeentrada' element={<ProtectedRoute><MainLayout><Inbox /></MainLayout></ProtectedRoute>} />
      <Route path='/usuarios' element={<ProtectedRoute><MainLayout><Users /></MainLayout></ProtectedRoute>} />
      <Route path='/projetos' element={<ProtectedRoute><MainLayout><Projects /></MainLayout></ProtectedRoute>} />
      <Route path='/configuracoes' element={<ProtectedRoute><MainLayout><Settings /></MainLayout></ProtectedRoute>} />
      <Route path='/referencias' element={<ProtectedRoute><MainLayout><References /></MainLayout></ProtectedRoute>} />
      <Route path='*' element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
