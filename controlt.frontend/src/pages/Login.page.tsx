import { Button, Stack, TextField } from '@mui/material';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../contexts/Snackbar.context';
import { authService } from '../services/auth.service';
import { useBackdrop } from '../contexts/Backdrop.context';
import type { LoginRequest } from '../dtos/auth/Auth.req.dto';
import { useAuth } from '../contexts/Auth.context';
import { useInitialize } from '../contexts/Initialized.context';

export default function Login() {
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const { showBackdrop, hideBackdrop } = useBackdrop();
    const { setUser } = useAuth();
    const { refresh } = useInitialize();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);

    const helperTextEmail = errorEmail ? 'Por favor, insira seu email' : '';
    const helperTextPassword = errorPassword ? 'Por favor, insira sua senha' : '';

    async function handleLogin(e: FormEvent) {
        e.preventDefault();

        setErrorEmail(false);
        setErrorPassword(false);

        if (!email) {
            setErrorEmail(true);
        }
        if (!password) {
            setErrorPassword(true);
        }

        if (!email || !password) {
            showSnackbar('Preencha todos os campos', 3000, 'warning');
            return;
        }

        showBackdrop();

        try {
            const data: LoginRequest = {
                email,
                password
            };

            await authService.login(data);
            const authUser = await authService.getCurrentUser();

            if (authUser) {
                setUser(authUser);
                showSnackbar('Login realizado com sucesso!', 2000, 'success');
                await refresh();
                navigate('/captura');
            } else {
                throw new Error('Erro ao recuperar dados do usuário');
            }
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao realizar login';
            showSnackbar(message, 5000, 'error');
        } finally {
            hideBackdrop();
        }
    }

    return (
        <Stack
            spacing={1}
            sx={{ width: '300px' }}
            margin="auto"
            height="98vh"
            justifyContent="center"
        >
            <TextField
                value={email}
                onFocus={() => setErrorEmail(false)}
                label="Email"
                type="email"
                variant="outlined"
                onChange={(e) => setEmail(e.target.value)}
                error={errorEmail}
                helperText={helperTextEmail}
                autoFocus
            />
            <TextField
                value={password}
                onFocus={() => setErrorPassword(false)}
                label="Senha"
                type="password"
                variant="outlined"
                onChange={(e) => setPassword(e.target.value)}
                error={errorPassword}
                helperText={helperTextPassword}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleLogin(e);
                    }
                }}
            />
            <Button variant="contained" onClick={handleLogin}>
                Entrar
            </Button>
        </Stack>
    );
}