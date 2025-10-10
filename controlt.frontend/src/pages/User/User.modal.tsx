import { TextField, Stack, MenuItem } from "@mui/material";
import { useState, useEffect } from "react";
import type { User } from "../../entities/User.entity";
import Dialog from "../../components/Dialog.component";


interface IAddUserModal {
    open: boolean;
    user?: User | null;
    onClose: () => void;
    onSave: (user: Omit<User, 'id' | 'profile'>) => void;
}

export default function AddUserModal({ open, user, onClose, onSave }: IAddUserModal) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');
    const [profileId, setProfileId] = useState<number>(0);

    const profiles = [
        { id: 1, name: 'Gerente' },
        { id: 2, name: 'Colaborador' },
    ];

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email || '');
            setPassword(user.password);
            setProfileId(user.profile_id);
        } else {
            clear();
        }
    }, [user]);

    const clear = () => {
        setName('');
        setEmail('');
        setPassword('');
        setProfileId(0);
    };

    const isValid = () => {
        return name.trim() !== '' &&
            email.trim() !== '' &&
            password.trim() !== '' &&
            profileId !== 0;
    };

    const handleSave = () => {
        if (!isValid()) return;

        const userData: Omit<User, 'id' | 'profile'> = {
            name,
            email: email || undefined,
            password,
            profile_id: profileId,
            created_date: user?.created_date || new Date()
        };

        onSave(userData);
        onClose();
        clear();
    };

    return (
        <Dialog
            open={open}
            title={user ? 'Editar Usuário' : 'Adicionar Usuário'}
            onClose={onClose}
            onConfirm={handleSave}
            confirmText={user ? 'Atualizar' : 'Salvar'}
            confirmDisabled={!isValid()}
        >
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
                            {profile.name}
                        </MenuItem>
                    ))}
                </TextField>
            </Stack>
        </Dialog>
    );
}