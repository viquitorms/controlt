import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Toolbar, Typography } from '@mui/material';
import { Home, Settings, ExitToApp, TableChartRounded, Groups, Person } from '@mui/icons-material';
import SourceIcon from '@mui/icons-material/Source';
import { useNavigate } from 'react-router-dom';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import { authService } from '../services/auth.service';

const drawerWidth = 240;

export default function Sidebar() {
    const navigate = useNavigate();

    const navigationList = [
        { text: 'Caixa de Entrada', icon: <Home />, path: '/caixadeentrada' },
        { text: 'Projetos', icon: <TableChartRounded />, path: '/projetos' },
        { text: 'Referências', icon: <SourceIcon />, path: '/referencias' },
        { text: 'Termos', icon: <SpellcheckIcon />, path: '/termos' },
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