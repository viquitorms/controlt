import { Button, Stack, TextField } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();

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
                console.log('Logging in with', { login, password });
                navigate('/caixadeentrada');
            }
            if (!login) setErrorLogin(true);
            else setErrorLogin(false);

            if (!password) setErrorPassword(true);
            else setErrorPassword(false);

        } catch (error) {
            alert('Login failed. Please try again.');
        }

    }

    return (
        <Stack spacing={1} sx={{ width: '300px' }} margin={'auto'} height={'98vh'} justifyContent={'center'}>
            <TextField value={login} label="Login" variant="outlined" onChange={(e) => setLogin(e.target.value)} error={errorLogin} helperText={helperTextLogin} />
            <TextField value={password} label="Senha" variant="outlined" onChange={(e) => setPassword(e.target.value)} error={errorPassword} helperText={helperTextPassword} />
            <Button variant="contained" onClick={handleLogin}>Entrar</Button>
        </Stack>
    );
}