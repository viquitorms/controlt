import { useCallback, useEffect, useState } from "react";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import {
    Box,
    Button,
    IconButton,
    Stack,
    TextField,
    Typography,
    Popover
} from "@mui/material";
import { useBackdrop } from "../../contexts/Backdrop.context";
import { useSnackbar } from "../../contexts/Snackbar.context";
import { itemService } from "../../services/item.service";
import type { ItemListResponse } from "../../dtos/item/Item.res.dto";
import { Update, FilterList, Clear, AutoMode } from "@mui/icons-material";
import ProcessItem, { type IConvertToProject } from "./ProcessItem.modal";
import { type IProcessedItem } from "./ProcessItem.modal";
import { StatusItemEnum } from "../../enums/StatusItem.enum";
import ItemStatusChip from "../../components/features/chip/ItemStatusChip.component";
import type { IFilter } from "./interfaces/Filter.inbox.interface";
import { useNavigate } from "react-router-dom";
import { type UserListResponse } from "../../dtos/user/User.res.dto";
import { userService } from "../../services/user.service";
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import PopoverFilter from "../../components/features/popover/PopoverFilter.component";

export default function Inbox() {
    const { showBackdrop, hideBackdrop } = useBackdrop();
    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [itemsList, setItemsList] = useState<ItemListResponse[]>([]);
    const [filteredItems, setFilteredItems] = useState<ItemListResponse[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [selectedItem, setSelectedItem] = useState<ItemListResponse | null>(null);
    const [usersList, setUsersList] = useState<UserListResponse[]>([]);
    const [modalOpen, setProcessModalOpen] = useState(false);
    const [capturedDate, setCapturedDate] = useState<Dayjs | null>(dayjs(''));

    const [filters, setFilters] = useState<IFilter>({
        title: "",
        description: "",
        captured_date: null,
    });

    useEffect(() => {
        onInitialized();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, itemsList]);

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
            const items = await itemService.list({ status_id: StatusItemEnum.Inbox });
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
            const users = await userService.list();
            setUsersList(users);
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao carregar usuários';
            showSnackbar(message, 5000, 'error');
        } finally {
            hideBackdrop();
        }
    }

    {/** Aplica os filtros selecionados no popover */ }
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

        if (filters.captured_date) {
            const filterDate = dayjs(filters.captured_date);

            filtered = filtered.filter((item) => {
                const itemDate = dayjs(item.created_date);
                return itemDate.isSame(filterDate, 'day');
            });
        }

        setFilteredItems(filtered);
    }

    {/** Atualiza os dados */ }
    const handleUpdate = useCallback(async () => {
        try {
            await getItems();
            showSnackbar("Itens atualizados com sucesso", 3000, 'success');
        } catch {
            return;
        }
    }, [getItems, showSnackbar]);

    {/** Abre o wizard de processamento */ }
    const handleOpenWizard = (row: ItemListResponse) => {
        setSelectedItem(row);
        setProcessModalOpen(true);
    };

    {/** Abre o filtro */ }
    const handleOpenFilter = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    {/** Fecha o filtro */ }
    const handleCloseFilter = () => {
        setAnchorEl(null);
    };

    const openFilter = Boolean(anchorEl);

    const activeFiltersCount = [
        filters.title,
        filters.description,
        filters.captured_date
    ].filter(Boolean).length;

    const hasActiveFilters = activeFiltersCount > 0;

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
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (params) => <ItemStatusChip statusId={params.row.status_id} />
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
            align: "center",
            headerAlign: "center",
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params: GridRenderCellParams<ItemListResponse>) => (
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

    const handleProcessItem = async (data: IProcessedItem) => {
        if (!selectedItem) return;

        try {
            showBackdrop();

            await itemService.processItem({
                id: selectedItem.id,
                is_actionable: data.is_actionable,
                status_id: data.status_id,
                due_date: data.due_date,
                userAssigned_id: data.userAssigned_id,
                priority: data.priority,
            });

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

    const handleConvertToProject = async (projectData: IConvertToProject) => {
        if (!selectedItem) return;

        try {
            showBackdrop();

            await itemService.convertToProject({
                id: selectedItem.id,
                title: projectData.title,
                description: projectData.description,
                status: projectData.status,
            });

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

            {/** Filtro */}
            <PopoverFilter anchorEl={anchorEl} open={openFilter} onClose={handleCloseFilter} onApply={applyFilters} />

            {/** DataGrid */}
            <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={filteredItems || []}
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