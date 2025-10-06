import { Box } from '@mui/material';
import Sidebar from '../components/Sidebar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                {children}
            </Box>
        </Box>
    );
}