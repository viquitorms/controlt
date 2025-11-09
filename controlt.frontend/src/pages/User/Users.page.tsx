import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import UpdateIcon from '@mui/icons-material/Update';
import { useEffect, useState } from "react";
import { Add, Delete, Edit } from "@mui/icons-material";
import CreateUserModal from "./CreateUser.modal";
import { useSnackbar } from "../../contexts/Snackbar.context";
import { useBackdrop } from "../../contexts/Backdrop.context";
import { userService } from "../../services/user.service";
import UpdateUserModal from "./UpdateUser.modal";
import { useAuth } from "../../contexts/Auth.context";
import type { User } from "../../dtos/user/User.res.dto";
import { useInitialize } from "../../contexts/Initialized.context";
import type { CreateUserDto, UpdateUserDto } from "../../dtos/user/User.req.dto";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";

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
            setSelectedUser(user)
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

    {/** Renderização de mensagem quando não houver items no grid*/ }
    function CustomNoRowsOverlay() {
        return (
            <Stack height="100%" alignItems="center" justifyContent="center" spacing={1}>
                <Typography>Nenhum item para exibir.</Typography>
            </Stack>
        );
    }

    const columns: GridColDef<User>[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 80
        },
        {
            field: 'name',
            headerName: 'Nome',
            flex: 1
        },
        {
            field: 'email',
            headerName: 'E-mail',
            flex: 1
        },
        {
            field: 'profile',
            headerName: 'Perfil',
            flex: 1,
            renderCell: (params: GridRenderCellParams<User>) => (
                <span>{params.row.profile.name}</span>
            )
        },
        {
            field: 'actions',
            headerName: 'Ações',
            width: 120,
            sortable: false,
            filterable: false,
            renderCell: (params: GridRenderCellParams<User>) => (
                <Box>
                    <IconButton size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(params.row);
                        }}
                    >
                        <Edit />
                    </IconButton>
                    <IconButton size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(params.row);
                        }}
                    >
                        <Delete />
                    </IconButton>
                </Box>
            )
        }
    ];

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
                rows={userList || []}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                }}
                pageSizeOptions={[5, 10, 25, 50]}
                disableRowSelectionOnClick
                disableColumnResize
                resizeThrottleMs={1000}
                sx={{
                    '& .MuiDataGrid-row:hover': {
                        backgroundColor: 'action.hover',
                    },
                }}
                slots={{
                    noRowsOverlay: CustomNoRowsOverlay
                }}
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