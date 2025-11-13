import { Box, Stack, Typography } from '@mui/material';
import CTSidebar from '../ui/organisms/sidebar/CTSidebar.component';
import type { ReactNode } from 'react';

interface IMainLayout {
    title: string,
    description?: string,
    children: ReactNode
}

export default function MainLayout({ title, description, children }: IMainLayout) {
    return (
        <Box sx={{ display: 'flex' }}>
            <CTSidebar />
            <Stack component="main" sx={{ flexGrow: 1, p: 2 }} spacing={2}>
                <Stack>
                    <Typography variant="h5">{title}</Typography>
                    <Typography variant="body2" color="text.secondary">{description}</Typography>
                </Stack>
                {children}
            </Stack>
        </Box >
    );
}