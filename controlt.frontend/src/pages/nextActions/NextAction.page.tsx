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
import { Delete, Edit, Update, FilterList, Clear, CheckCircle, PlayArrow, Stop } from "@mui/icons-material";
import { useAuth } from "../../contexts/Auth.context";
import { StatusItemEnum } from "../../enums/StatusItem.enum";
import type { UserListResponse } from "../../dtos/user/User.res.dto";
import type { ProjectListResponse } from "../../dtos/project/Project.res.dto";
import type { StatusItemResponse } from "../../dtos/statusItem/StatusItem.res.dto";
import { userService } from "../../services/user.service";
import { projectService } from "../../services/project.service";
import { statusItemService } from "../../services/statusItem.service";
import type { ItemUpdateRequest, ItemUpdateStatusRequest } from "../../dtos/item/Item.req.dto";
import NextActionsModal from "./NextAction.modal";
import { useNavigate } from "react-router-dom";
import { recordedTimeService } from "../../services/recordedTime.service";

interface IFilter {
    title: string;
    description: string;
    priority: string;
}

export default function NextActions() {
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

    const [activeTrackingId, setActiveTrackingId] = useState<number | null>(null);

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
                getActiveTimer(),
            ]);
        } catch {
            return;
        }
    }

    async function getItems() {
        try {
            showBackdrop();
            const items = await itemService.findAll({
                status_id: StatusItemEnum.ProximaAcao,
                user_id: user?.id
            });
            setItemsList(items);
            setFilteredItems(items);
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao carregar próximas ações';
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

    async function getActiveTimer() {
        try {
            const activeTimer = await recordedTimeService.getActiveTracking();
            if (activeTimer) {
                setActiveTrackingId(activeTimer.itemId);
            }
        } catch (error: any) {
            console.error('Erro ao buscar timer ativo', error);
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

    const handleStartTracking = async (itemId: number) => {
        try {
            await recordedTimeService.startTracking(itemId);
            setActiveTrackingId(itemId);
            showSnackbar('Rastreamento de tempo iniciado!', 5000, 'success');
        } catch (error) {
            showSnackbar('Falha ao iniciar rastreamento.', 5000, 'error');
            console.error(error);
        }
    };

    const handleStopTracking = async (itemId: number) => {
        try {
            await recordedTimeService.stopTracking(itemId);
            setActiveTrackingId(null);
            showSnackbar('Rastreamento de tempo parado!', 5000, 'info');
            await getItems();
        } catch (error) {
            showSnackbar('Falha ao parar rastreamento.', 5000, 'error');
            console.error(error);
        }
    };

    async function startItem(data: ItemListResponse) {
        try {
            showBackdrop();

            const udpateItem: ItemUpdateStatusRequest = {
                id: data.id,
                status_id: StatusItemEnum.EmAndamento
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
            field: "track",
            type: "actions",
            headerName: "Track",
            width: 80,
            align: "center",
            headerAlign: "center",
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params: GridRenderCellParams<ItemListResponse>) => {
                const itemId = params.row.id as number;
                const isThisItemActive = activeTrackingId === itemId;

                return (
                    <>
                        {isThisItemActive ? (
                            <IconButton
                                color="error"
                                size="small"
                                onClick={() => handleStopTracking(itemId)}
                                aria-label="Parar rastreamento"
                                title="Parar rastreamento"
                            >
                                <Stop fontSize="small" />
                            </IconButton>
                        ) : (
                            <IconButton
                                color="primary"
                                size="small"
                                onClick={() => handleStartTracking(itemId)}
                                aria-label="Iniciar rastreamento"
                                title="Iniciar rastreamento"
                                disabled={activeTrackingId !== null}
                            >
                                <PlayArrow fontSize="small" />
                            </IconButton>
                        )}
                    </>
                );
            },
        },
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
            field: 'priority',
            headerName: 'Prioridade',
            renderCell: (params: GridRenderCellParams<ItemListResponse>) => {
                const priority = params.row.priority || 3;
                return (
                    <Chip
                        label={getPriorityLabel(priority)}
                        size="small"
                        color={getPriorityColor(priority)}
                    />
                );
            },
        },
        {
            field: 'due_date',
            headerName: 'Prazo',
            flex: 1,
            renderCell: (params: GridRenderCellParams<ItemListResponse>) => {
                if (!params.row.due_date) {
                    return <Chip label="Sem prazo" size="small" variant="outlined" />;
                }
                const dueDate = new Date(params.row.due_date);
                const now = new Date();
                const isOverdue = dueDate < now;

                return (
                    <Chip
                        label={dueDate.toLocaleDateString('pt-BR')}
                        size="small"
                        color={isOverdue ? "error" : "default"}
                        variant={isOverdue ? "filled" : "outlined"}
                    />
                );
            },
        },
        {
            field: 'project',
            headerName: 'Projeto',
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
                        color="success"
                        size="small"
                        onClick={() => handleComplete(params.row)}
                        title="Marcar como concluída"
                    >
                        <CheckCircle fontSize="small" />
                    </IconButton>
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

                        <TextField
                            label="Prioridade"
                            variant="outlined"
                            size="small"
                            fullWidth
                            select
                            value={filters.priority}
                            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                        >
                            <option value="">Todas</option>
                            <option value="1">Alta</option>
                            <option value="2">Média-Alta</option>
                            <option value="3">Média</option>
                            <option value="4">Baixa</option>
                            <option value="5">Muito Baixa</option>
                        </TextField>

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

            <NextActionsModal
                open={editDialogOpen}
                item={itemToEdit}
                users={users}
                projects={projects}
                statuses={statuses}
                onClose={() => {
                    setEditDialogOpen(false);
                    setItemToEdit(null);
                }}
                onSave={handleSaveEdit}
            />
        </Stack>
    );
}