import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, MenuItem } from "@mui/material";
import { useState } from "react";

interface AddUserModalProps {
    open: boolean;
    onClose: () => void;
}

export default function AddUserModal({ open, onClose }: AddUserModalProps) {
    const [nome, setName] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setPassword] = useState('');
    const [perfilId, setProfileId] = useState('');

    const perfis = [
        { id: 1, nome: 'Gerente' },
        { id: 2, nome: 'Colaborador' },
    ];

    const handleSave = () => {
        const novoUsuario = {
            nome,
            email,
            senha_hash: senha,
            perfil_id: perfilId,
            data_criacao: new Date()
        };

        console.log(novoUsuario);
        // TODO: Chamar API para salvar

        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Adicionar Usuário</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="Nome"
                        value={nome}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Senha"
                        type="password"
                        value={senha}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        required
                    />
                    <TextField
                        select
                        label="Perfil"
                        value={perfilId}
                        onChange={(e) => setProfileId(e.target.value)}
                        fullWidth
                        required
                    >
                        {perfis.map((perfil) => (
                            <MenuItem key={perfil.id} value={perfil.id}>
                                {perfil.nome}
                            </MenuItem>
                        ))}
                    </TextField>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSave} variant="contained">Salvar</Button>
            </DialogActions>
        </Dialog>
    );
}