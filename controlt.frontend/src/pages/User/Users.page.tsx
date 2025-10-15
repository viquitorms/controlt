import { Button, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import DataGrid from "../../components/DataGrid.component";
import { PersonAdd } from "@mui/icons-material";
import AddUserModal from "./User.modal";
import { useSnackbar } from "../../contexts/Snackbar.context";
import { profileService } from "../../services/profile.service";
import { useBackdrop } from "../../contexts/Backdrop.context";
import type { Profile } from "../../dtos/Profile.entity";
import type { RegisterRequest } from "../../dtos/auth/Auth.req.dto";
import { authService } from "../../services/auth.service";
import { userService } from "../../services/user.service";
import type { UserListResponse } from "../../dtos/user/User.res.dto";
import type { User } from "../../models/Models.model";

export default function Users() {
    const { showSnackbar } = useSnackbar();
    const { showBackdrop, hideBackdrop } = useBackdrop();

    const [openModal, setOpenModal] = useState(false);
    const [userList, setUserList] = useState<UserListResponse[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserListResponse | null>(null);
    const [profileMap, setProfileMap] = useState<{ [key: number]: string }>({});
    const [profiles, setProfiles] = useState<Profile[]>([]);

    useEffect(() => {
        onInitialize();
    }, []);

    async function onInitialize() {
        showBackdrop();
        try {
            await getProfiles();
            await getUsers();
        } catch (error) {
            showSnackbar('Erro ao carregar dados', 5000, 'error');
        } finally {
            hideBackdrop();
        }
    }

    async function getProfiles() {
        try {
            const response = await profileService.getList();
            const newProfileMap: { [key: number]: string } = {};
            response.forEach((profile: Profile) => {
                newProfileMap[profile.id] = profile.name;
            });

            setProfileMap(newProfileMap);
            setProfiles(response);
        } catch (error: any) {
            const message = error.response?.data?.message || 'Erro ao carregar perfis';
            showSnackbar(message, 5000, 'error');
            throw error;
        }
    }

    async function getUsers() {
        try {
            const list = await userService.list();
            setUserList(list)
        } catch (error: any) {
            const message = error.response?.data?.message || 'Erro ao carregar usuários';
            showSnackbar(message, 5000, 'error');
            throw error;
        }
    }

    async function registerUser(data: RegisterRequest) {
        try {
            await authService.register(data);
            var userList = await userService.list();
            setUserList(userList);
        } catch (error: any) {
            throw error
        }
    }

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
            format: (date: Date) => new Date(date).toLocaleDateString('pt-BR')
        },
    ];

    const handleAddUser = async (user: Omit<User, 'id' | 'profile'>) => {
        try {
            showBackdrop();

            if (selectedUser) {
                const updatedUser: UserListResponse = {
                    ...user,
                    id: selectedUser.id
                };

                setUserList(prevList => prevList.map(u => u.id === selectedUser.id ? updatedUser : u));
                showSnackbar(`Usuário ${updatedUser.name} atualizado!`, 5000, 'success');
                setSelectedUser(null);
            } else {
                const newUser: RegisterRequest = {
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    profile_id: user.profile_id
                };

                await registerUser(newUser);
                await getUsers();
                showSnackbar(`Usuário ${newUser.name} adicionado!`, 5000, 'success');
            }
        } catch (error: any) {
            const message = error.response?.data?.error;
            showSnackbar(message, 5000, 'error');
        }
        finally {
            hideBackdrop();
        }
    };

    const handleEdit = (user: UserListResponse) => {
        setSelectedUser(user);
        setOpenModal(true);
    };

    const handleDelete = (user: UserListResponse) => {
        setUserList(prevList => prevList.filter(u => u.id !== user.id));
        showSnackbar(`Usuário ${user.name} removido!`, 5000, 'success');
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedUser(null);
    };

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
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <AddUserModal
                open={openModal}
                user={selectedUser}
                onClose={handleCloseModal}
                onSave={handleAddUser}
                profiles={profiles} // <- CORRIGIDO
            />
        </Stack>
    );
}