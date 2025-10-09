import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, MenuItem } from "@mui/material";
import { useState } from "react";
import type { User } from "../../entities/User.entity";

interface IAddUserModal {
    open: boolean;
    onClose: () => void;
    onSave: (user: Omit<User, 'id' | 'profile'>) => void;
}

export default function AddUserModal({ open, onClose, onSave }: IAddUserModal) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profileId, setProfileId] = useState<number>(0);

    const profiles = [
        { id: 1, nome: 'Gerente' },
        { id: 2, nome: 'Colaborador' },
    ];

    // Clear state
    const clear = () => {
        setName('')
        setEmail('')
        setPassword('')
        setProfileId(0)
    }

    const handleSave = () => {
        const user: Omit<User, 'id' | 'profile'> = {
            name,
            email: email || undefined,
            password,
            profile_id: profileId,
            created_date: new Date()
        }

        onSave(user)
        onClose();
        clear();

        // TODO: Chamar API para salvar

    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Adicionar Usuário</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="Nome"
                        value={name}
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        required
                    />
                    <TextField
                        select
                        label="Perfil"
                        value={profileId}
                        onChange={(e) => setProfileId(Number(e.target.value))}
                        fullWidth
                        required
                    >
                        {profiles.map((profile) => (
                            <MenuItem key={profile.id} value={profile.id}>
                                {profile.nome}
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