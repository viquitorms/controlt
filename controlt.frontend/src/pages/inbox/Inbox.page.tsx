import { useEffect, useState } from "react";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import {
    Box,
    Button,
    Card,
    CardContent,
    IconButton,
    Stack,
    TextField,
    Typography,
    Popover,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from "@mui/material";
import { useBackdrop } from "../../contexts/Backdrop.context";
import { useSnackbar } from "../../contexts/Snackbar.context";
import { itemService } from "../../services/item.service";
import type { ItemListResponse } from "../../dtos/item/Item.res.dto";
import { Add, Delete, Edit, Update, FilterList, Clear } from "@mui/icons-material";
import { statusItemService } from "../../services/statusItem.service";
import type { StatusItemResponse } from "../../dtos/statusItem/StatusItem.res.dto";
import { projectService } from "../../services/project.service";
import type { ProjectListResponse } from "../../dtos/project/Project.res.dto";
import { useAuth } from "../../contexts/Auth.context";
import type { ItemCreateRequest } from "../../dtos/item/Item.req.dto";

interface IFilter {
    title: string;
    user: string;
    project_id: number | string;
}

interface ICreateItem {
    title: string;
    description: string;
}

export default function Inbox() {
    const { user } = useAuth();
    const { showBackdrop, hideBackdrop } = useBackdrop();
    const { showSnackbar } = useSnackbar();
    const [itemsList, setItemsList] = useState<ItemListResponse[]>([]);
    const [statusItemsList, setStatusItemsList] = useState<StatusItemResponse[]>([]);
    const [projectsList, setProjectsList] = useState<ProjectListResponse[]>([]);
    const [filteredItems, setFilteredItems] = useState<ItemListResponse[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const [newItem, setNewItem] = useState<ICreateItem>({
        title: "",
        description: ""
    });

    const [filters, setFilters] = useState<IFilter>({
        title: "",
        user: "",
        project_id: ""
    });

    useEffect(() => {
        onInitialized();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, itemsList]);

    async function onInitialized() {
        try {
            await getStatusItem();
            await getProjects();
            await getItems();
        } catch {
            return;
        }
    }

    async function getItems() {
        try {
            showBackdrop();
            const items = await itemService.list({ status_name: 'Inbox' });
            setItemsList(items);
            setFilteredItems(items);
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao carregar items';
            showSnackbar(message, 5000, 'error');
        } finally {
            hideBackdrop();
        }
    }

    async function getProjects() {
        try {
            const projects = await projectService.list();
            setProjectsList(projects);
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao carregar projetos';
            showSnackbar(message, 5000, 'error');
        }
    }

    async function getStatusItem() {
        try {
            const status = await statusItemService.list();
            setStatusItemsList(status);
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao carregar status de itens';
            showSnackbar(message, 5000, 'error');
        }
    }

    async function createItem() {
        try {
            showBackdrop();

            if (!user) {
                showSnackbar('Usuário não autenticado', 5000, 'error');
                return;
            };

            const item: ItemCreateRequest = {
                title: newItem.title,
                description: newItem.description,
                user_id: user.id,
                project_id: undefined,
                due_date: undefined,
                status_name: undefined
            }

            await itemService.create(item);

            showSnackbar('Item capturado com sucesso', 3000, 'success');
            setNewItem({ title: "", description: "" });
            await getItems();
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao criar item';
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

        if (filters.user) {
            filtered = filtered.filter((item) =>
                item.user?.name === filters.user
            );
        }

        if (filters.project_id) {
            filtered = filtered.filter((item) =>
                item.project?.id === Number(filters.project_id)
            );
        }

        setFilteredItems(filtered);
    }

    function clearFilters() {
        setFilters({
            title: "",
            user: "",
            project_id: ""
        });
        handleCloseFilter();
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

    const handleUpdate = async () => {
        try {
            await getItems();
            showSnackbar("Itens atualizados com sucesso", 3000, 'success');
        } catch {
            return;
        }
    };

    const handleEdit = (row: ItemListResponse) => {
        // navigate(`/items/edit/${row.id}`);
    };

    const handleDelete = async (data: ItemListResponse) => {
        await deleteItem(data.id);
        await getItems();
    };

    const handleOpenFilter = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseFilter = () => {
        setAnchorEl(null);
    };

    const openFilter = Boolean(anchorEl);

    const uniqueUsers = Array.from(
        new Set(itemsList.map(item => item.user?.name).filter(Boolean))
    );

    const activeFiltersCount = [
        filters.title,
        filters.user,
        filters.project_id
    ].filter(Boolean).length;

    const hasActiveFilters = activeFiltersCount > 0;

    const columns: GridColDef<ItemListResponse>[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 70
        },
        {
            field: 'title',
            headerName: 'Título',
            flex: 1,
            minWidth: 200,
        },
        {
            field: 'description',
            headerName: 'Descrição',
            flex: 1,
            minWidth: 250,
        },
        {
            field: 'user_name',
            headerName: 'Usuário',
            width: 160,
            valueGetter: (_, row) => row.user?.name || '-',
        },
        {
            field: 'project_title',
            headerName: 'Projeto',
            width: 140,
            valueGetter: (_, row) => row.project?.title || '-',
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
            field: "actions",
            type: "actions",
            headerName: "Ações",
            width: 100,
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
                        title="Processar item"
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
        <Stack spacing={3}>
            <Typography variant="h4">📥 Caixa de Entrada</Typography>

            <Card elevation={2}>
                <CardContent>
                    <Stack spacing={2}>
                        <Typography variant="h6" fontWeight="bold">
                            Capturar novo item
                        </Typography>

                        <TextField
                            label="O que está na sua mente?"
                            variant="outlined"
                            size="small"
                            fullWidth
                            required
                            value={newItem.title}
                            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                            placeholder="Digite algo que precisa fazer, lembrar ou organizar..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    createItem();
                                }
                            }}
                        />

                        <TextField
                            label="Notas adicionais (opcional)"
                            variant="outlined"
                            size="small"
                            fullWidth
                            multiline
                            rows={2}
                            value={newItem.description}
                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                            placeholder="Adicione contexto, detalhes ou observações..."
                        />

                        <Box display="flex" gap={1}>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={createItem}
                                disabled={!newItem.title.trim()}
                            >
                                Capturar
                            </Button>
                            {newItem.title && (
                                <Button
                                    variant="outlined"
                                    onClick={() => setNewItem({ title: "", description: "" })}
                                >
                                    Limpar
                                </Button>
                            )}
                        </Box>
                    </Stack>
                </CardContent>
            </Card>

            <Stack direction="row" spacing={1} alignItems="center">
                <Button
                    variant="outlined"
                    startIcon={<Update />}
                    onClick={handleUpdate}
                    size="small"
                >
                    Atualizar
                </Button>

                <Button
                    variant={hasActiveFilters ? "contained" : "outlined"}
                    startIcon={<FilterList />}
                    onClick={handleOpenFilter}
                    size="small"
                >
                    Filtrar {hasActiveFilters && `(${activeFiltersCount})`}
                </Button>

                {hasActiveFilters && (
                    <Button
                        variant="text"
                        startIcon={<Clear />}
                        onClick={clearFilters}
                        color="error"
                        size="small"
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
                <Box sx={{ p: 3, width: 400 }}>
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

                        <FormControl fullWidth size="small">
                            <InputLabel>Usuário</InputLabel>
                            <Select
                                value={filters.user}
                                label="Usuário"
                                onChange={(e) => setFilters({ ...filters, user: e.target.value })}
                            >
                                <MenuItem value="">Todos</MenuItem>
                                {uniqueUsers.map((user) => (
                                    <MenuItem key={user} value={user}>
                                        {user}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth size="small">
                            <InputLabel>Projeto</InputLabel>
                            <Select
                                value={filters.project_id}
                                label="Projeto"
                                onChange={(e) => setFilters({ ...filters, project_id: e.target.value })}
                            >
                                <MenuItem value="">Todos</MenuItem>
                                {projectsList.map((project) => (
                                    <MenuItem key={project.id} value={project.id}>
                                        {project.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

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
                    }}
                    pageSizeOptions={[5, 10, 25, 50]}
                    disableRowSelectionOnClick
                    disableColumnResize
                    sx={{
                        '& .MuiDataGrid-row:hover': {
                            backgroundColor: 'action.hover',
                        },
                    }}
                />
            </Box>
        </Stack>
    );
}