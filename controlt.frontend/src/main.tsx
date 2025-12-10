import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './config/Dayjs.config.tsx';

import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from './contexts/Snackbar.context.tsx';
import { BackdropProvider } from './contexts/Backdrop.context.tsx';
import { AuthProvider } from './contexts/Auth.context.tsx';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { InitializeProvider } from './contexts/Initialized.context.tsx';
import { theme } from './styles/theme.style.tsx';


import { ThemeProvider } from '@mui/material/styles';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'pt-br'}>
        <ThemeProvider theme={theme}>
          <InitializeProvider autoLoad={false}>
            <SnackbarProvider>
              <BackdropProvider>
                <AuthProvider>
                  <App />
                </AuthProvider>
              </BackdropProvider>
            </SnackbarProvider>
          </InitializeProvider>
        </ThemeProvider>
      </LocalizationProvider>
    </BrowserRouter>
  </StrictMode>
)
