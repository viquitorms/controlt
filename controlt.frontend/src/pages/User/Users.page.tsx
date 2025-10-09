import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import DataGrid from "../../components/DataGrid.component";
import { PersonAdd } from "@mui/icons-material";
import AddUserModal from "./AddUser.modal";
import type { User } from "../../entities/User.entity";
import { useSnackbar } from "../../contexts/Snackbar.context";

export default function Users() {
    const { showSnackbar } = useSnackbar();
    const [openModal, setOpenModal] = useState(false)
    const [userList, setUserList] = useState<User[]>([])

    const columns: Array<{ key: keyof User; label: string; align?: 'left' | 'right' | 'center' }> = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Nome' },
        { key: 'email', label: 'Email' },
        { key: 'profile_id', label: 'Perfil' },
        { key: 'created_date', label: 'Data de Criação' },
    ];

    const handleAddUser = (user: Omit<User, 'id' | 'profile'>) => {
        try {
            const newUser: User = {
                ...user,
                id: userList.length + 1
            }

            setUserList(prevList => [...prevList, newUser])
            console.log('Usuários:', newUser);

            showSnackbar(`Usuário ${newUser.name} adicionado!`, 5000, 'success')
        } catch (error) {
            showSnackbar(`${error}`, 5000, 'error')
        }

    }

    return (
        <Stack spacing={2}>
            <Typography variant={'h5'}>Usuários</Typography>

            <Stack direction={'row'} justifyContent={'space-between'}>
                <Button
                    variant="outlined"
                    startIcon={<PersonAdd />}
                    onClick={() => setOpenModal(true)}
                >
                    Adicionar
                </Button>
            </Stack>

            <DataGrid
                columns={columns}
                data={userList}
                getRowKey={(row) => row.id}
            />

            <AddUserModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSave={handleAddUser}
            />
        </Stack>
    );
}