import { useEffect, useState } from "react";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import {
    Box,
    Button,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import { useBackdrop } from "../../contexts/Backdrop.context";
import { useSnackbar } from "../../contexts/Snackbar.context";
import { itemService } from "../../services/item.service";
import type { Item } from "../../dtos/item/Item.res.dto";
import { Update, AutoMode } from "@mui/icons-material";
import ProcessItem from "./ProcessItem.modal";
import { useNavigate } from "react-router-dom";
import { type User } from "../../dtos/user/User.res.dto";
import { userService } from "../../services/user.service";
import type { CreateTaskDto } from "../../dtos/task/task.req.dto";
import type { CreateProjectDto } from "../../dtos/project/Project.req.dto";
import { taskService } from "../../services/task.service";
import { projectService } from "../../services/project.service";

export default function Inbox() {
    const { showBackdrop, hideBackdrop } = useBackdrop();
    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [itemsList, setItemsList] = useState<Item[]>([]);
    const [filteredItems, setFilteredItems] = useState<Item[]>([]);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [usersList, setUsersList] = useState<User[]>([]);
    const [modalOpen, setProcessModalOpen] = useState(false);

    useEffect(() => {
        onInitialized();
    }, []);

    {/** Inicializa a página */ }
    async function onInitialized() {
        try {
            await getItems();
            await getUsers();
        } catch {
            return;
        }
    }

    {/** Carrega a lista de itens */ }
    async function getItems() {
        try {
            showBackdrop();
            const items = await itemService.findAll({ is_processed: false });
            setItemsList(items);
            setFilteredItems(items);
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao carregar items';
            showSnackbar(message, 5000, 'error');
        } finally {
            hideBackdrop();
        }
    }

    {/** Carrega a lista de usuários */ }
    async function getUsers() {
        try {
            showBackdrop();
            const users = await userService.findAll();
            setUsersList(users);
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao carregar usuários';
            showSnackbar(message, 5000, 'error');
        } finally {
            hideBackdrop();
        }
    }

    {/** Atualiza os dados */ }
    const handleUpdate = async () => {
        try {
            await getItems();
            showSnackbar("Itens atualizados com sucesso", 3000, 'success');
        } catch {
            return;
        }
    };

    {/** Abre o wizard de processamento */ }
    const handleOpenWizard = (row: Item) => {
        setSelectedItem(row);
        setProcessModalOpen(true);
    };

    const columns: GridColDef<Item>[] = [
        {
            field: 'id',
            headerName: 'ID',
        },
        {
            field: 'title',
            headerName: 'Título',
            flex: 1,
        },
        {
            field: 'note',
            headerName: 'Nota',
            flex: 1,
        },
        {
            field: 'created_date',
            headerName: 'Capturado em',
            width: 130,
            valueFormatter: (value) => {
                return new Date(value as string).toLocaleDateString('pt-BR');
            },
        },
        {
            field: 'created_by',
            headerName: 'Criado por',
            width: 150,
            valueFormatter: (value) => {
                const user = value as { id: number; name: string; };
                return user?.name || '—';
            },
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Ações",
            align: "center",
            headerAlign: "center",
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params: GridRenderCellParams<Item>) => (
                <Stack direction="row" spacing={1}>
                    <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleOpenWizard(params.row)}
                        title="Processar item"
                    >
                        <AutoMode fontSize="small" />
                    </IconButton>
                </Stack>
            ),
        },
    ];

    const handleProcessItem = async (data: CreateTaskDto) => {
        if (!selectedItem) return;

        try {
            showBackdrop();

            await taskService.create({
                item_id: selectedItem.id,
                title: data.title,
                description: data.description,
                due_date: data.due_date ? new Date(data.due_date).toISOString() : undefined,
                priority_id: data.priority_id,
                project_id: data.project_id,
                status_id: data.status_id,
                created_by_id: data.created_by_id,
                assigned_to_id: data.assigned_to_id
            });

            await itemService.update(selectedItem.id, { is_processed: true });

            showSnackbar('Item processado com sucesso!', 5000, 'success');
            setProcessModalOpen(false);
            setSelectedItem(null);
            await getItems();
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao processar item';
            showSnackbar(message, 5000, 'error');
        } finally {
            hideBackdrop();
        }
    };

    const handleConvertToProject = async (projectData: CreateProjectDto) => {
        if (!selectedItem) return;

        try {
            showBackdrop();

            await projectService.create({
                title: projectData.title,
                description: projectData.description,
                status_id: projectData.status_id,
            });

            await itemService.update(selectedItem.id, { is_processed: true });

            showSnackbar('Item convertido em projeto com sucesso!', 5000, 'success');
            setProcessModalOpen(false);
            setSelectedItem(null);
            await getItems();
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao converter em projeto';
            showSnackbar(message, 5000, 'error');
        } finally {
            hideBackdrop();
        }
    };

    {/** Renderização de mensagem quando não houver items no grid*/ }
    function CustomNoRowsOverlay() {
        return (
            <Stack height="100%" alignItems="center" justifyContent="center" spacing={1}>
                <Typography>Nenhum item para exibir.</Typography>
                <Button
                    variant="contained"
                    onClick={() => navigate('/captura')}
                >
                    Capturar Itens
                </Button>
            </Stack>
        );
    }

    return (
        <Stack spacing={2}>

            {/** Toolbar */}
            <Stack direction="row" spacing={1} alignItems="center">

                <Button
                    variant="outlined"
                    startIcon={<Update />}
                    onClick={handleUpdate}
                >
                    Atualizar
                </Button>

                <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto !important' }}>
                    {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'itens'}
                </Typography>
            </Stack>

            {/** DataGrid */}
            <Box sx={{ height: '80vh', width: '100%' }}>
                <DataGrid
                    rows={itemsList || []}
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

            </Box>

            {/** Wizard */}
            <ProcessItem
                open={modalOpen}
                item={selectedItem}
                onClose={() => {
                    setProcessModalOpen(false);
                    setSelectedItem(null);
                }}
                onProcess={handleProcessItem}
                onConvertToProject={handleConvertToProject}
                users={usersList}
            />
        </Stack>
    );
}