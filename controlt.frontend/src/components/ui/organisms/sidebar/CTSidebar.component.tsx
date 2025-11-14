import { Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Toolbar, Typography } from '@mui/material';
import { Settings, ExitToApp, TableChartRounded, Groups, Person, PlayCircleFilled, HourglassBottom, KeyboardDoubleArrowRight, CalendarToday, Inbox, DateRange, CheckCircleOutline } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import SourceIcon from '@mui/icons-material/Source';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../../services/auth.service';
import { useAuth } from '../../../../contexts/Auth.context';
import CTList from '../../molecules/CTList.molecule.component';

const drawerWidth = 240;

export default function CTSidebar() {
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
        { text: 'Concluídos', icon: <CheckCircleOutline />, path: '/concluidos' },
        { text: 'Deletados', icon: <DeleteIcon />, path: '/deletados' },
    ];

    const navigationList = [
        { text: 'Projetos', icon: <TableChartRounded />, path: '/projetos' },
        // { text: 'Termos', icon: <SpellcheckIcon />, path: '/termos' },
        { text: 'Usuários', icon: <Person />, path: '/usuarios' },
        // { text: 'Equipes', icon: <Groups />, path: '/equipes' }
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
                <Typography variant={'h6'} fontWeight={500}>ControlT</Typography>
            </Toolbar>

            <Stack display={'flex'} flexDirection={'column'} justifyContent={'space-between'} height={'100%'}>
                <Stack display={'flex'} flexDirection={'column'} gap={2}>
                    <Stack>
                        <Typography variant='caption' sx={{ marginLeft: 2 }} color={'textDisabled'}>GTD</Typography>
                        <CTList
                            type="button"
                            buttonType={actionList.map(item => ({
                                id: item.text,
                                icon: item.icon,
                                label: item.text,
                                onClick: () => handleNavigate(item),
                                dense: true,
                            }))}
                        />
                    </Stack>
                    <Divider />
                    <Stack>
                        <Typography variant='caption' sx={{ marginLeft: 2 }} color={'textDisabled'}>Organização</Typography>
                        <CTList
                            type="button"
                            buttonType={navigationList.map(item => ({
                                id: item.text,
                                icon: item.icon,
                                label: item.text,
                                onClick: () => handleNavigate(item),
                                dense: true,
                            }))}
                        />
                    </Stack>
                </Stack>

                <List>
                    <CTList
                        type="button"
                        buttonType={configurationList.map(item => ({
                            id: item.text,
                            icon: item.icon,
                            label: item.text,
                            onClick: () => handleNavigate(item),
                            dense: true,
                        }))}
                    />
                </List>
            </Stack>

        </Drawer>
    );
}