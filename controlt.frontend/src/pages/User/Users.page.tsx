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
import UpdateUserModal from "./UpdateUser.modal";
import { useAuth } from "../../contexts/Auth.context";
import type { User } from "../../dtos/user/User.res.dto";
import { useInitialize } from "../../contexts/Initialized.context";
import type { CreateUserDto, UpdateUserDto } from "../../dtos/user/User.req.dto";

export default function Users() {
    const { showSnackbar } = useSnackbar();
    const { showBackdrop, hideBackdrop } = useBackdrop();
    const { profiles } = useInitialize();
    const { isManager } = useAuth();

    const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
    const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState(false);
    const [userList, setUserList] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        onInitialize();
    }, []);

    async function onInitialize() {
        showBackdrop();
        try {
            await getUsers();
        } catch (error) {
            showSnackbar('Erro ao carregar dados', 5000, 'error');
        } finally {
            hideBackdrop();
        }
    }

    async function getUsers() {
        try {
            showBackdrop();
            const list = await userService.findAll();
            setUserList(list)
        } catch (error: any) {
            const message = error.response?.data?.messages || 'Erro ao carregar usuários';
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
            const message = error.response?.data?.messages || 'Erro ao carregar usuários';
            showSnackbar(message, 5000, 'error');
            throw error;
        }
        finally {
            hideBackdrop();
        }
    }

    async function updateUser(data: UpdateUserDto): Promise<boolean> {
        try {
            showBackdrop()

            if (!selectedUser) {
                showSnackbar('Nenhum usuário selecionado para edição', 5000, 'error');
                return false;
            }

            const user = await userService.update(selectedUser.id, data);
            await getUsers();
            showSnackbar(`Usuário ${user.name} editado com sucesso`, 5000, 'success')
            return true;
        } catch (error: any) {
            const message = error.response?.data?.messages || 'Erro ao editar usuário';
            showSnackbar(message, 5000, 'error');
            return false;
        } finally {
            hideBackdrop();
        }
    }

    async function createUser(data: CreateUserDto): Promise<boolean> {
        try {
            showBackdrop();
            await userService.create(data);
            await getUsers();
            showSnackbar(`Usuário ${data.name} criado com sucesso`, 5000, 'success')
            return true;
        } catch (error: any) {
            const message = error.response?.data?.messages || 'Erro ao criar usuário';
            showSnackbar(message, 5000, 'error');
            return false;
        } finally {
            hideBackdrop();
        }
    }

    async function deleteUser(id: number, name: string) {
        try {
            showBackdrop();
            await userService.remove(id);
            await getUsers();
            showSnackbar(`O usuário ${name} foi deletado`, 5000, 'info');
        }
        catch (error: any) {
            const message = error.response?.data?.messages || 'Erro ao deletar usuário';
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

    const handleEdit = async (user: User) => {
        if (isManager) {
            await getUserById(user.id);
            setIsUpdateUserModalOpen(true);
        }
        else {
            showSnackbar('Seu usuário não tem permissão para editar usuários', 5000, 'warning')
        }
    };

    const handleDelete = async (user: User) => {
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