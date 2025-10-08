import { Button, Stack, TextField } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../contexts/Snackbar.context';

export default function Login() {
    const navigate = useNavigate();
    const { showSnackbar, hideSnackbar } = useSnackbar();

    const [login, setLogin] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errorLogin, setErrorLogin] = React.useState(false);
    const [errorPassword, setErrorPassword] = React.useState(false);

    const helperTextLogin = errorLogin ? 'Por favor, insira seu login' : '';
    const helperTextPassword = errorPassword ? 'Por favor, insira sua senha' : '';

    function handleLogin() {
        try {
            if (login && password) {

                // TODO: Implement actual authentication logic here

                if (login === 'admin' && password === 'admin') {
                    console.log('Logging in with', { login, password });
                    hideSnackbar();
                    navigate('/caixadeentrada');
                }
                else {
                    showSnackbar("Login ou senha incorretos.", 5000, 'error');
                }

            }
            if (!login) setErrorLogin(true);
            else setErrorLogin(false);

            if (!password) setErrorPassword(true);
            else setErrorPassword(false);

        } catch (error) {
            showSnackbar("Erro ao realizar login. Tente novamente mais tarde.", 5000, 'error');
        }
    }

    return (
        <Stack spacing={1} sx={{ width: '300px' }} margin={'auto'} height={'98vh'} justifyContent={'center'}>
            <TextField value={login} label="Login" type='text' variant="outlined" onChange={(e) => setLogin(e.target.value)} error={errorLogin} helperText={helperTextLogin} />
            <TextField value={password} label="Senha" type='password' variant="outlined" onChange={(e) => setPassword(e.target.value)} error={errorPassword} helperText={helperTextPassword} />
            <Button variant="contained" onClick={handleLogin}>Entrar</Button>
        </Stack>
    );
}