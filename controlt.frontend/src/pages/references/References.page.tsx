import { useEffect, useState } from "react";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import {
    Box,
    Button,
    IconButton,
    Stack,
    TextField,
    Typography,
    Popover,
    Chip,
} from "@mui/material";
import { useBackdrop } from "../../contexts/Backdrop.context";
import { useSnackbar } from "../../contexts/Snackbar.context";
import { itemService } from "../../services/item.service";
import type { ItemListResponse } from "../../dtos/item/Item.res.dto";
import { Delete, Edit, Update, FilterList, Clear, CheckCircle, PlayArrow } from "@mui/icons-material";
import { useAuth } from "../../contexts/Auth.context";
import { StatusItemEnum } from "../../enums/StatusItem.enum";
import type { UserListResponse } from "../../dtos/user/User.res.dto";
import type { ProjectListResponse } from "../../dtos/project/Project.res.dto";
import type { StatusItemResponse } from "../../dtos/statusItem/StatusItem.res.dto";
import { userService } from "../../services/user.service";
import { projectService } from "../../services/project.service";
import { statusItemService } from "../../services/statusItem.service";
import type { ItemUpdateRequest, ItemUpdateStatusRequest } from "../../dtos/item/Item.req.dto";
import ReferencesModal from "./References.modal";
import { useNavigate } from "react-router-dom";

interface IFilter {
    title: string;
    description: string;
    priority: string;
}

export default function References() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showBackdrop, hideBackdrop } = useBackdrop();
    const { showSnackbar } = useSnackbar();
    const [itemsList, setItemsList] = useState<ItemListResponse[]>([]);
    const [filteredItems, setFilteredItems] = useState<ItemListResponse[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<ItemListResponse | null>(null);
    const [users, setUsers] = useState<UserListResponse[]>([]);
    const [projects, setProjects] = useState<ProjectListResponse[]>([]);
    const [statuses, setStatuses] = useState<StatusItemResponse[]>([]);

    const [filters, setFilters] = useState<IFilter>({
        title: "",
        description: "",
        priority: "",
    });

    useEffect(() => {
        onInitialized();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, itemsList]);

    async function onInitialized() {
        try {
            await Promise.all([
                getItems(),
                getUsers(),
                getProjects(),
                getStatuses(),
            ]);
        } catch {
            return;
        }
    }

    async function getItems() {
        try {
            showBackdrop();
            const items = await itemService.list({
                status_id: StatusItemEnum.Referencia,
                user_id: user?.id
            });
            setItemsList(items);
            setFilteredItems(items);
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao carregar referências';
            showSnackbar(message, 5000, 'error');
        } finally {
            hideBackdrop();
        }
    }

    async function getUsers() {
        try {
            const users = await userService.list();
            setUsers(users);
        } catch (error: any) {
            console.error('Erro ao carregar usuários');
        }
    }

    async function getProjects() {
        try {
            const projects = await projectService.list();
            setProjects(projects);
        } catch (error: any) {
            console.error('Erro ao carregar projetos');
        }
    }

    async function getStatuses() {
        try {
            const statuses = await statusItemService.list();
            setStatuses(statuses);
        } catch (error: any) {
            console.error('Erro ao carregar status');
        }
    }

    async function deleteItem(id: number) {
        try {
            showBackdrop();
            await itemService.delete(id);
            showSnackbar('Item deletado com sucesso', 5000, 'success');
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao deletar item';
            showSnackbar(message, 5000, 'error');
        } finally {
            hideBackdrop();
        }
    }

    async function completeItem(id: number) {
        try {
            showBackdrop();
            await itemService.completeItem(id);
            showSnackbar('Item marcado como concluído!', 5000, 'success');
            await getItems();
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao concluir item';
            showSnackbar(message, 5000, 'error');
        } finally {
            hideBackdrop();
        }
    }

    async function startItem(data: ItemListResponse) {
        try {
            showBackdrop();

            const udpateItem: ItemUpdateStatusRequest = {
                id: data.id,
                status_id: data.status_id
            }

            await itemService.updateStatus(udpateItem);
            showSnackbar('Item iniciado!', 5000, 'success');
            await getItems();
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao iniciar item';
            showSnackbar(message, 5000, 'error');
        } finally {
            hideBackdrop();
        }
    }

    function applyFilters() {
        let filtered = [...itemsList];

        if (filters.title.trim()) {
            filtered = filtered.filter((item) =>
                item.title.toLowerCase().includes(filters.title.toLowerCase())
            );
        }

        if (filters.description) {
            filtered = filtered.filter((item) =>
                item.description?.toLowerCase().includes(filters.description.toLowerCase())
            );
        }

        if (filters.priority) {
            filtered = filtered.filter((item) =>
                item.priority === Number(filters.priority)
            );
        }

        setFilteredItems(filtered);
    }

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

    function clearFilters() {
        setFilters({
            title: "",
            description: "",
            priority: "",
        });
        handleCloseFilter();
    }

    const handleUpdate = async () => {
        try {
            await getItems();
            showSnackbar("Itens atualizados com sucesso", 3000, 'success');
        } catch {
            return;
        }
    };

    const handleEdit = (row: ItemListResponse) => {
        setItemToEdit(row);
        setEditDialogOpen(true);
    };

    const handleDelete = async (data: ItemListResponse) => {
        await deleteItem(data.id);
        await getItems();
    };

    const handleComplete = async (data: ItemListResponse) => {
        await completeItem(data.id);
    };

    const handleStart = async (data: ItemListResponse) => {
        await startItem(data);
    };

    const handleOpenFilter = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseFilter = () => {
        setAnchorEl(null);
    };

    const handleSaveEdit = async (data: ItemUpdateRequest) => {
        try {
            showBackdrop();
            await itemService.update(data);
            showSnackbar('Item atualizado com sucesso!', 5000, 'success');
            setEditDialogOpen(false);
            setItemToEdit(null);
            await getItems();
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao atualizar item';
            showSnackbar(message, 5000, 'error');
        } finally {
            hideBackdrop();
        }
    };

    const openFilter = Boolean(anchorEl);

    const activeFiltersCount = [
        filters.title,
        filters.description,
        filters.priority,
    ].filter(Boolean).length;

    const hasActiveFilters = activeFiltersCount > 0;

    const getPriorityColor = (priority: number) => {
        switch (priority) {
            case 1: return "error";
            case 2: return "warning";
            case 3: return "info";
            case 4: return "default";
            case 5: return "default";
            default: return "default";
        }
    };

    const getPriorityLabel = (priority: number) => {
        switch (priority) {
            case 1: return "Alta";
            case 2: return "Média-Alta";
            case 3: return "Média";
            case 4: return "Baixa";
            case 5: return "Muito Baixa";
            default: return "Não definida";
        }
    };

    const columns: GridColDef<ItemListResponse>[] = [
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
            field: 'description',
            headerName: 'Descrição',
            flex: 1,
        },
        {
            field: 'project',
            headerName: 'Projeto',
            flex: 1,
            renderCell: (params: GridRenderCellParams<ItemListResponse>) => {
                if (!params.row.project) return '-';
                return (
                    <Chip
                        label={params.row.project.title}
                        size="small"
                        color="primary"
                        variant="outlined"
                    />
                );
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
            renderCell: (params: GridRenderCellParams<ItemListResponse>) => (
                <Stack direction="row" spacing={1}>
                    <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(params.row)}
                        title="Editar item"
                    >
                        <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(params.row)}
                        title="Deletar item"
                    >
                        <Delete fontSize="small" />
                    </IconButton>
                </Stack>
            ),
        },
    ];

    return (
        <Stack spacing={2}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack>
                    <Typography variant="h5">Referências</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Referências e conteúdos capturados que servem de constulta
                    </Typography>
                </Stack>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
                <Button
                    variant="outlined"
                    startIcon={<Update />}
                    onClick={handleUpdate}
                >
                    Atualizar
                </Button>

                <Button
                    variant={hasActiveFilters ? "contained" : "outlined"}
                    startIcon={<FilterList />}
                    onClick={handleOpenFilter}
                >
                    Filtrar {hasActiveFilters && `(${activeFiltersCount})`}
                </Button>

                {hasActiveFilters && (
                    <Button
                        variant="text"
                        startIcon={<Clear />}
                        onClick={clearFilters}
                        color="error"
                    >
                        Limpar
                    </Button>
                )}

                <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto !important' }}>
                    {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'itens'}
                </Typography>
            </Stack>

            <Popover
                open={openFilter}
                anchorEl={anchorEl}
                onClose={handleCloseFilter}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <Box sx={{ p: 2, minWidth: 300 }}>
                    <Stack spacing={2}>
                        <Typography variant="h6">Filtros</Typography>

                        <TextField
                            label="Título"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={filters.title}
                            onChange={(e) => setFilters({ ...filters, title: e.target.value })}
                            placeholder="Buscar por título..."
                        />

                        <TextField
                            label="Descrição"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={filters.description}
                            onChange={(e) => setFilters({ ...filters, description: e.target.value })}
                            placeholder="Buscar por descrição..."
                        />

                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Button onClick={clearFilters} color="inherit">
                                Limpar
                            </Button>
                            <Button onClick={handleCloseFilter} variant="contained">
                                Aplicar
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Popover>

            <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={filteredItems}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                        sorting: {
                            sortModel: [{ field: 'priority', sort: 'asc' }],
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

            <ReferencesModal
                open={editDialogOpen}
                item={itemToEdit}
                projects={projects}
                onClose={() => {
                    setEditDialogOpen(false);
                    setItemToEdit(null);
                }}
                onSave={handleSaveEdit}
            />
        </Stack>
    );
}