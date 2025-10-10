import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import DataGrid from "../../components/DataGrid.component";
import { PersonAdd } from "@mui/icons-material";
import ProjectModal from "./Project.modal";
import type { User } from "../../entities/User.entity";
import { useSnackbar } from "../../contexts/Snackbar.context";

export default function Projects() {
    const { showSnackbar } = useSnackbar();
    const [openModal, setOpenModal] = useState(false);
    const [userList, setUserList] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const profileMap: Record<number, string> = {
        1: 'Gerente',
        2: 'Colaborador',
    };

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Nome' },
        { key: 'email', label: 'Email' },
        {
            key: 'profile_id',
            label: 'Perfil',
            format: (value: number) => profileMap[value] || 'Desconhecido'
        },
        {
            key: 'created_date',
            label: 'Data de Criação',
            format: (date: Date) => date.toLocaleDateString('pt-BR')
        },
    ];

    const handleAddUser = (user: Omit<User, 'id' | 'profile'>) => {
        try {
            if (selectedUser) {
                // Editar usuário existente
                const updatedUser: User = {
                    ...user,
                    id: selectedUser.id
                };

                setUserList(prevList => prevList.map(u => u.id === selectedUser.id ? updatedUser : u));
                showSnackbar(`Usuário ${updatedUser.name} atualizado!`, 5000, 'success');
                setSelectedUser(null);
            } else {
                // Adicionar novo usuário
                const newUser: User = {
                    ...user,
                    id: userList.length + 1
                };

                setUserList(prevList => [...prevList, newUser]);
                showSnackbar(`Usuário ${newUser.name} adicionado!`, 5000, 'success');
            }
        } catch (error) {
            showSnackbar(`${error}`, 5000, 'error');
        }
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setOpenModal(true);
    };

    const handleDelete = (user: User) => {
        setUserList(prevList => prevList.filter(u => u.id !== user.id));
        showSnackbar(`Usuário ${user.name} removido!`, 5000, 'success');
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedUser(null);
    };

    return (
        <Stack spacing={2}>
            <Typography variant={'h5'}>Projetos</Typography>

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
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <ProjectModal
                open={openModal}
                user={selectedUser}
                onClose={handleCloseModal}
                onSave={handleAddUser}
            />
        </Stack>
    );
}