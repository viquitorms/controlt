import { Button, Stack, TextField } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../contexts/Snackbar.context';
import { authService } from '../services/auth.service';
import { useBackdrop } from '../contexts/Backdrop.context';
import type { LoginRequest } from '../dtos/auth/Auth.req.dto';

export default function Login() {
    const navigate = useNavigate();
    const { showSnackbar, hideSnackbar } = useSnackbar();
    const { showBackdrop, hideBackdrop } = useBackdrop();

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errorLogin, setErrorEmail] = React.useState(false);
    const [errorPassword, setErrorPassword] = React.useState(false);

    const helperTextLogin = errorLogin ? 'Por favor, insira seu login' : '';
    const helperTextPassword = errorPassword ? 'Por favor, insira sua senha' : '';

    async function handleLogin() {
        try {
            showBackdrop();

            if (email && password) {

                const data: LoginRequest = {
                    email: email,
                    password: password
                }

                var user = await authService.login(data);

                if (user.token) {
                    hideSnackbar();
                    navigate('/caixadeentrada');
                }
            }

            if (!email) setErrorEmail(true);
            else setErrorEmail(false);

            if (!password) setErrorPassword(true);
            else setErrorPassword(false);

        } catch (error: any) {
            const message = error.response?.data?.error;
            showSnackbar(message, 5000, 'error');
        }
        finally {
            hideBackdrop();
        }
    }

    return (
        <Stack spacing={1} sx={{ width: '300px' }} margin={'auto'} height={'98vh'} justifyContent={'center'}>
            <TextField value={email} onInput={() => setErrorEmail(false)} label="Login" type='text' variant="outlined" onChange={(e) => setEmail(e.target.value)} error={errorLogin} helperText={helperTextLogin} />
            <TextField value={password} onInput={() => setErrorPassword(false)} label="Senha" type='password' variant="outlined" onChange={(e) => setPassword(e.target.value)} error={errorPassword} helperText={helperTextPassword} />
            <Button variant="contained" onClick={handleLogin}>Entrar</Button>
        </Stack>
    );
}