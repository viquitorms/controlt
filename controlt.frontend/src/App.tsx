import './App.css'
import Login from './pages/Login.page'
import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './components/layouts/CTMain.layout'
import Users from './pages/user/Users.page'
import Settings from './pages/Settings.page'
import CTProtectedRoute from './components/ui/CTProtectedRoute.component'
import Projects from './pages/project/Projects.page'
// import Teams from './pages/team/Teams.page'
import CaptureItem from './pages/capture/CaptureItem.page'
import Waiting from './pages/waiting/Waiting.page'
import NextActions from './pages/nextActions/NextAction.page'
import Scheduled from './pages/scheduled/Scheduled.page'
import References from './pages/references/References.page'
import Someday from './pages/someday/Someday.page'
import Finished from './pages/finished/Finished.page'
import Archived from './pages/archived/Archived.page'
import Doing from './pages/doing/Doing.page'
import LeadTimePage from './pages/dashboard/LeadTime.page'
import ConclusionRatePage from './pages/dashboard/ConclusionRate.page'

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

        <Route path='/emandamento' element={
          <MainLayout title='Em Andamento' description='Tarefas que estão sendo trabalhadas no momento'>
            <Doing />
          </MainLayout>
        }
        />

        <Route path='/proximasacoes' element={
          <MainLayout title='Próximas Ações' description='Tarefas e Itens que você deve executar quando possível'>
            <NextActions />
          </MainLayout>
        }
        />

        <Route path='/aguardando' element={
          <MainLayout title='Aguardando' description='Tarefas que foram delegados e estão aguardandno retorno'>
            <Waiting />
          </MainLayout>
        }
        />

        <Route path='/agendado' element={
          <MainLayout title='Agendado' description='Tarefas que você deve agendou para uma data específica'>
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
          <MainLayout title='Algum dia talvez' description='Tarefas que não possuem prioridades e que serão feitas algum dia ou talvez não serão feitas'>
            <Someday />
          </MainLayout>
        }
        />

        <Route path='/concluidos' element={
          <MainLayout title='Concluídos' description='Tarefas que foram concluídos'>
            <Finished />
          </MainLayout>
        }
        />

        <Route path='/arquivadas' element={
          <MainLayout title='Arquivadas' description='Tarefas e Itens que foram arquivadas'>
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

        {/* <Route path='/equipes' element={
          <MainLayout title='Equipes' >
            <Teams />
          </MainLayout>
        }
        /> */}

        <Route path='/metricas/lead-time' element={
          <MainLayout title='Lead Time' description='Monitoramento de Lead Time e eficiência do processo'>
            <LeadTimePage />
          </MainLayout>
        }
        />

        <Route path='/metricas/taxa-conclusao' element={
          <MainLayout title='Taxa de Conclusão' description='Confiabilidade do planeamento (PPC)'>
            <ConclusionRatePage />
          </MainLayout>
        }
        />

      </Route>

      <Route path='*' element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
