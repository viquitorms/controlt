import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import type { Item } from "../../dtos/item/Item.res.dto";
import { Box, IconButton } from "@mui/material";
import { AutoMode } from "@mui/icons-material";

export interface InboxGridColumnsOptions {
    handleOpenWizard: (item: Item) => void;
};

export function InboxGridColumns(options: InboxGridColumnsOptions): GridColDef<Item>[] {
    const { handleOpenWizard } = options;
    return [
        {
            field: 'id',
            headerName: 'ID',
            width: 80,
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
            renderCell: (params: GridRenderCellParams<Item>) => {
                return <span>{new Date(params.row.created_date).toLocaleDateString()}</span>
            },
        },
        {
            field: 'created_by',
            headerName: 'Criado por',
            width: 150,
            renderCell: (params: GridRenderCellParams<Item>) => {
                return <span>{params.row.created_by?.name}</span>
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
            width: 80,
            renderCell: (params: GridRenderCellParams<Item>) => (
                <Box>
                    <IconButton
                        color="primary"
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleOpenWizard(params.row);
                        }}
                        title="Processar item"
                    >
                        <AutoMode fontSize="small" />
                    </IconButton>
                </Box>
            ),
        },
    ];
}