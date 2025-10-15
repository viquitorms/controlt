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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SnackbarProvider>
        <BackdropProvider>
          <App />
        </BackdropProvider>
      </SnackbarProvider>
    </BrowserRouter>
  </StrictMode>,
)
