import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#266b95',
        },
        secondary: {
            main: '#da744c',
        },
        warning: {
            main: '#e8882a',
        },
        error: {
            main: '#e44343',
        },
        info: {
            main: '#0288d1',
        },
        success: {
            main: '#42a245',
        },
    },
    typography: {
        fontFamily: 'Comme',
    },
});