import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from './contexts/Snackbar.context.tsx';
import { BackdropProvider } from './contexts/Backdrop.context.tsx';
import { AuthProvider } from './contexts/Auth.context.tsx';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { InitializeProvider } from './contexts/Initialized.context.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'pt-br'}>
        <InitializeProvider autoLoad={false}>
          <SnackbarProvider>
            <BackdropProvider>
              <AuthProvider>
                <App />
              </AuthProvider>
            </BackdropProvider>
          </SnackbarProvider>
        </InitializeProvider>
      </LocalizationProvider>
    </BrowserRouter>
  </StrictMode>
)
