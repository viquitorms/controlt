import { Button, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import DataGrid from "../../components/DataGrid.component";
import { PersonAdd } from "@mui/icons-material";
import CreateUserModal from "./CreateUser.modal";
import { useSnackbar } from "../../contexts/Snackbar.context";
import { profileService } from "../../services/profile.service";
import { useBackdrop } from "../../contexts/Backdrop.context";
import type { Profile } from "../../dtos/Profile.entity";
import { userService } from "../../services/user.service";
import type { UserFindByIdResponse, UserListResponse } from "../../dtos/user/User.res.dto";
import type { UserCreateRequest, UserUpdateRequest } from "../../dtos/user/User.req.dto";
import UpdateUserModal from "./UpdateUser.modal";

export default function Users() {
    const { showSnackbar } = useSnackbar();
    const { showBackdrop, hideBackdrop } = useBackdrop();

    const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
    const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState(false);
    const [userList, setUserList] = useState<UserListResponse[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserFindByIdResponse | null>(null);
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
            showBackdrop();
            const response = await profileService.getList();
            setProfiles(response);
        } catch (error: any) {
            const message = error.response?.data?.message || 'Erro ao carregar perfis';
            showSnackbar(message, 5000, 'error');
            throw error;
        }
        finally {
            hideBackdrop();
        }
    }

    async function getUsers() {
        try {
            showBackdrop();
            const list = await userService.list();
            setUserList(list)
        } catch (error: any) {
            const message = error.response?.data?.message || 'Erro ao carregar usuários';
            showSnackbar(message, 5000, 'error');
            throw error;
        }
        finally {
            hideBackdrop();
        }
    }

    async function getUserById(id: number) {
        try {
            showBackdrop();
            const user = await userService.findById(id);
            setSelectedUser(user)
        } catch (error: any) {
            const message = error.response?.data?.message || 'Erro ao carregar usuários';
            showSnackbar(message, 5000, 'error');
            throw error;
        }
        finally {
            hideBackdrop();
        }
    }

    async function updateUser(data: UserUpdateRequest) {
        try {
            showBackdrop()
            await userService.update(data);
            await getUsers();
        } catch (error: any) {
            throw error
        } finally {
            hideBackdrop();
        }
    }

    async function createUser(data: UserCreateRequest) {
        try {
            showBackdrop();
            await userService.create(data);
            await getUsers();
        } catch (error: any) {
            throw error
        } finally {
            hideBackdrop();
        }
    }

    const handleEdit = async (user: UserListResponse) => {
        await getUserById(user.id);
        setIsUpdateUserModalOpen(true);
    };

    const handleDelete = (user: UserListResponse) => {
        setUserList(prevList => prevList.filter(u => u.id !== user.id));
        showSnackbar(`Usuário ${user.name} removido!`, 5000, 'success');
    };

    return (
        <Stack spacing={2}>
            <Typography variant={'h5'}>Usuários</Typography>

            <Stack direction={'row'} justifyContent={'space-between'}>
                <Button
                    variant="outlined"
                    startIcon={<PersonAdd />}
                    onClick={() => setIsCreateUserModalOpen(true)}
                >
                    Adicionar
                </Button>
            </Stack>

            <DataGrid
                data={userList}
                rowKey={(row) => row.id}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <CreateUserModal
                open={isCreateUserModalOpen}
                onClose={() => setIsCreateUserModalOpen(false)}
                onSave={createUser}
                profiles={profiles}
            />

            <UpdateUserModal
                open={isUpdateUserModalOpen}
                user={selectedUser}
                onClose={() => setIsUpdateUserModalOpen(false)}
                onSave={updateUser}
                profiles={profiles}
            />
        </Stack>
    );
}