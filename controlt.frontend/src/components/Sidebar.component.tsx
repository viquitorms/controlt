import { Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Toolbar, Typography } from '@mui/material';
import { Settings, ExitToApp, TableChartRounded, Groups, Person, PlayCircleFilled, HourglassBottom, KeyboardDoubleArrowRight, CalendarToday, Inbox, DateRange } from '@mui/icons-material';
import SourceIcon from '@mui/icons-material/Source';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useAuth } from '../contexts/Auth.context';

const drawerWidth = 240;

export default function Sidebar() {
    const navigate = useNavigate();
    const { isManager } = useAuth();

    const actionList = [
        { text: 'Iniciar Captura', icon: <PlayCircleFilled />, path: '/captura' },
        { text: 'Caixa de Entrada', icon: <Inbox />, path: '/caixadeentrada' },
        { text: 'Aguardando', icon: <HourglassBottom />, path: '/aguardando' },
        { text: 'Agendado', icon: <CalendarToday />, path: '/agendado' },
        { text: 'Próximas Ações', icon: <KeyboardDoubleArrowRight />, path: '/proximasacoes' },
        { text: 'Algum dia talvez', icon: <DateRange />, path: '/algumdia' },
        { text: 'Referências', icon: <SourceIcon />, path: '/referencias' },
    ];

    const navigationList = [
        { text: 'Projetos', icon: <TableChartRounded />, path: '/projetos' },
        // { text: 'Termos', icon: <SpellcheckIcon />, path: '/termos' },
        { text: 'Usuários', icon: <Person />, path: '/usuarios' },
        { text: 'Equipes', icon: <Groups />, path: '/equipes' }
    ];

    const configurationList = [
        { text: 'Configurações', icon: <Settings />, path: '/configuracoes' },
        { text: 'Sair', icon: <ExitToApp />, action: Logout },
    ];

    const handleNavigate = (item: any) => {
        if (item.path) navigate(item.path);
        if (item.action) item.action();
    }

    async function Logout() {
        await authService.logout();
        navigate('/login');
    }

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
        >
            <Toolbar>
                <Typography variant={'h5'} fontWeight={500}>ControlT</Typography>
            </Toolbar>

            <Stack display={'flex'} flexDirection={'column'} justifyContent={'space-between'} height={'100%'}>
                <Stack display={'flex'} flexDirection={'column'} gap={2}>
                    <Stack>
                        <Typography variant='caption' sx={{ marginLeft: 2 }} color={'textDisabled'}>GTD</Typography>
                        <List>
                            {actionList.map((item) => (
                                <ListItem key={item.text} disablePadding>
                                    <ListItemButton onClick={() => handleNavigate(item)}>
                                        <ListItemIcon>{item.icon}</ListItemIcon>
                                        <ListItemText primary={item.text} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Stack>

                    {
                        isManager &&
                        <>
                            <Divider />

                            <Stack>
                                <Typography variant='caption' sx={{ marginLeft: 2 }} color={'textDisabled'}>Organização</Typography>
                                <List>
                                    {navigationList.map((item) => (
                                        <ListItem key={item.text} disablePadding>
                                            <ListItemButton onClick={() => handleNavigate(item)}>
                                                <ListItemIcon>{item.icon}</ListItemIcon>
                                                <ListItemText primary={item.text} />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </Stack>
                        </>
                    }


                </Stack>

                <List>
                    {configurationList.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton onClick={() => handleNavigate(item)}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Stack>
        </Drawer>
    );
}