import './App.css'
import Login from './pages/Login.page'
import { Navigate, Route, Routes } from 'react-router-dom'
import Inbox from './pages/inbox/Inbox.page'
import MainLayout from './layouts/Main.layout'
import Users from './pages/user/Users.page'
import Settings from './pages/Settings.page'
import ProtectedRoute from './components/ProtectedRoute.component'
import Projects from './pages/project/Projects.page'
import Teams from './pages/team/Teams.page'
import Terms from './pages/term/Terms.page'
import CaptureItem from './pages/capture/CaptureItem.page'
import Waiting from './pages/waiting/Waiting.page'
import NextActions from './pages/nextActions/NextAction.page'
import Scheduled from './pages/scheduled/Scheduled.page'
import References from './pages/references/References.page'
import Someday from './pages/someday/Someday.page'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/captura' element={<ProtectedRoute><MainLayout><CaptureItem /></MainLayout></ProtectedRoute>} />
      <Route path='/caixadeentrada' element={<ProtectedRoute><MainLayout><Inbox /></MainLayout></ProtectedRoute>} />
      <Route path='/proximasacoes' element={<ProtectedRoute><MainLayout><NextActions /></MainLayout></ProtectedRoute>} />
      <Route path='/aguardando' element={<ProtectedRoute><MainLayout><Waiting /></MainLayout></ProtectedRoute>} />
      <Route path='/agendado' element={<ProtectedRoute><MainLayout><Scheduled /></MainLayout></ProtectedRoute>} />
      <Route path='/referencias' element={<ProtectedRoute><MainLayout><References /></MainLayout></ProtectedRoute>} />
      <Route path='/algumdia' element={<ProtectedRoute><MainLayout><Someday /></MainLayout></ProtectedRoute>} />
      <Route path='/usuarios' element={<ProtectedRoute><MainLayout><Users /></MainLayout></ProtectedRoute>} />
      <Route path='/projetos' element={<ProtectedRoute><MainLayout><Projects /></MainLayout></ProtectedRoute>} />
      <Route path='/configuracoes' element={<ProtectedRoute><MainLayout><Settings /></MainLayout></ProtectedRoute>} />
      <Route path='/equipes' element={<ProtectedRoute><MainLayout><Teams /></MainLayout></ProtectedRoute>} />
      <Route path='*' element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
