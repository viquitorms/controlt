import { Button, Stack, Typography } from "@mui/material";
import UpdateIcon from '@mui/icons-material/Update';
import { useEffect, useState } from "react";
import DataGrid from "../../components/ui/DataGrid.component";
import { Add } from "@mui/icons-material";
import CreateUserModal from "./CreateUser.modal";
import { useSnackbar } from "../../contexts/Snackbar.context";
import { profileService } from "../../services/profile.service";
import { useBackdrop } from "../../contexts/Backdrop.context";
import type { Profile } from "../../dtos/Profile.entity";
import { userService } from "../../services/user.service";
import type { UserFindByIdResponse, UserListResponse } from "../../dtos/user/User.res.dto";
import type { UserCreateRequest, UserUpdateRequest } from "../../dtos/user/User.req.dto";
import UpdateUserModal from "./UpdateUser.modal";
import { useAuth } from "../../contexts/Auth.context";

export default function Users() {
    const { showSnackbar } = useSnackbar();
    const { showBackdrop, hideBackdrop } = useBackdrop();
    const { isManager } = useAuth();

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
            const message = error.response?.data?.error || 'Erro ao carregar perfis';
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
            const message = error.response?.data?.error || 'Erro ao carregar usuários';
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
            const message = error.response?.data?.error || 'Erro ao carregar usuários';
            showSnackbar(message, 5000, 'error');
            throw error;
        }
        finally {
            hideBackdrop();
        }
    }

    async function updateUser(data: UserUpdateRequest): Promise<boolean> {
        try {
            showBackdrop()
            const user = await userService.update(data);
            await getUsers();
            showSnackbar(`Usuário ${user.name} editado com sucesso`, 5000, 'success')
            return true;
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao editar usuário';
            showSnackbar(message, 5000, 'error');
            return false;
        } finally {
            hideBackdrop();
        }
    }

    async function createUser(data: UserCreateRequest): Promise<boolean> {
        try {
            showBackdrop();
            await userService.create(data);
            await getUsers();
            showSnackbar(`Usuário ${data.name} criado com sucesso`, 5000, 'success')
            return true;
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao criar usuário';
            showSnackbar(message, 5000, 'error');
            return false;
        } finally {
            hideBackdrop();
        }
    }

    async function deleteUser(id: number, name: string) {
        try {
            showBackdrop();
            await userService.delete(id);
            await getUsers();
            showSnackbar(`O usuário ${name} foi deletado`, 5000, 'info');
        }
        catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao deletar usuário';
            showSnackbar(message, 5000, 'error');
            throw error;
        }
        finally {
            hideBackdrop();
        }
    }


    const handleCreate = async () => {
        if (isManager) {
            setIsCreateUserModalOpen(true);
        }
        else {
            showSnackbar('Seu usuário não tem permissão para criar usuários', 5000, 'warning')
        }
    };

    const handleEdit = async (user: UserListResponse) => {
        if (isManager) {
            await getUserById(user.id);
            setIsUpdateUserModalOpen(true);
        }
        else {
            showSnackbar('Seu usuário não tem permissão para editar usuários', 5000, 'warning')
        }
    };

    const handleDelete = async (user: UserListResponse) => {
        await deleteUser(user.id, user.name);
    };

    const handleUpdateList = async () => {
        await getUsers();
        showSnackbar('Lista de usuários atualizada', 5000, 'success')
    }

    return (
        <Stack spacing={2}>

            <Stack direction={'row'} spacing={1}>
                <Button
                    variant="outlined"
                    startIcon={<UpdateIcon />}
                    onClick={handleUpdateList}
                >
                    Atualizar
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleCreate}
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