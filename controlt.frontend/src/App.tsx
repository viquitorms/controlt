import './App.css'
import Login from './pages/Login.page'
import { Navigate, Route, Routes } from 'react-router-dom'
import Inbox from './pages/inbox/Inbox.page'
import MainLayout from './components/layouts/Main.layout'
import Users from './pages/user/Users.page'
import Settings from './pages/Settings.page'
import CTProtectedRoute from './components/ui/CTProtectedRoute.component'
import Projects from './pages/project/Projects.page'
import Teams from './pages/team/Teams.page'
import CaptureItem from './pages/capture/CaptureItem.page'
import Waiting from './pages/waiting/Waiting.page'
import NextActions from './pages/nextActions/NextAction.page'
import Scheduled from './pages/scheduled/Scheduled.page'
import References from './pages/references/References.page'
import Someday from './pages/someday/Someday.page'
import Finished from './pages/finished/Finished.page'
import Archived from './pages/archived/Archived.page'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Login />} />

      <Route element={<CTProtectedRoute />}>
        <Route path='/captura' element={
          <MainLayout title='Capturar Itens' description='Capture itens e tarefas'>
            <CaptureItem />
          </MainLayout>
        }
        />

        <Route path='/caixadeentrada' element={
          <MainLayout title='Caixa de Entrada' description='Todos os items que você capturou e precisam ser processados'>
            <Inbox />
          </MainLayout>
        }
        />

        <Route path='/proximasacoes' element={
          <MainLayout title='Próximas Ações' description='Itens que você deve executar quando possível'>
            <NextActions />
          </MainLayout>
        }
        />

        <Route path='/aguardando' element={
          <MainLayout title='Aguardando' description='Itens que foram delegados e estão aguardandno retorno'>
            <Waiting />
          </MainLayout>
        }
        />

        <Route path='/agendado' element={
          <MainLayout title='Agendado' description='Itens que você deve agendou para uma data específica'>
            <Scheduled />
          </MainLayout>
        }
        />

        <Route path='/referencias' element={
          <MainLayout title='Referências' description='Referências e conteúdos capturados que servem de constulta'>
            <References />
          </MainLayout>
        }
        />

        <Route path='/algumdia' element={
          <MainLayout title='Algum dia talvez' description='Itens que não possuem prioridades e que serão feitas algum dia ou talvez não serão feitas'>
            <Someday />
          </MainLayout>
        }
        />

        <Route path='/concluidos' element={
          <MainLayout title='Concluídos' description='Itens que foram concluídos'>
            <Finished />
          </MainLayout>
        }
        />

        <Route path='/deletados' element={
          <MainLayout title='Deletados' description='Itens que foram deletados'>
            <Archived />
          </MainLayout>
        }
        />

        <Route path='/usuarios' element={
          <MainLayout title='Usuários'>
            <Users />
          </MainLayout>
        }
        />

        <Route path='/projetos' element={
          <MainLayout title='Projetos'>
            <Projects />
          </MainLayout>
        }
        />

        <Route path='/configuracoes' element={
          <MainLayout title='Configurações'>
            <Settings />
          </MainLayout>
        }
        />

        <Route path='/equipes' element={
          <MainLayout title='Equipes' >
            <Teams />
          </MainLayout>
        }
        />
      </Route>

      <Route path='*' element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
