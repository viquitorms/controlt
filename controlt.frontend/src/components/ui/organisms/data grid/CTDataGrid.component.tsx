import { Update } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import type { JSXElementConstructor } from "react";

interface IDataGrid {
    rows: any[];
    columns: GridColDef<any>[];
    refresh?: () => Promise<void>;
    NoRowsOverlay?: JSXElementConstructor<React.HTMLAttributes<HTMLDivElement>>;
    cursor?: string;
    onRowDoubleClick?: (params: any) => void;
}

export default function CTDataGrid({
    rows,
    columns,
    refresh,
    NoRowsOverlay,
    cursor,
    onRowDoubleClick,
}: IDataGrid) {

    function getNoRowsOverlay() {
        return (
            NoRowsOverlay ? <NoRowsOverlay /> : <></>
        )
    }

    async function handleRefresh() {
        if (refresh) {
            await refresh();
        }
    }

    return (
        <Stack spacing={2}>

            <Stack direction="row" spacing={1} alignItems="center">
                {
                    refresh &&
                    <Stack direction={'row'} spacing={1}>
                        <Button
                            variant="outlined"
                            startIcon={<Update />}
                            onClick={handleRefresh}
                        >
                            Atualizar
                        </Button>
                    </Stack>
                }
                <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto !important' }}>
                    {rows.length} {rows.length === 1 ? 'item' : 'itens'}
                </Typography>
            </Stack>

            <DataGrid
                rows={rows || []}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                }}
                pageSizeOptions={[5, 10, 25, 50]}
                disableRowSelectionOnClick
                disableColumnResize
                onRowDoubleClick={onRowDoubleClick}
                resizeThrottleMs={1000}
                sx={{
                    '& .MuiDataGrid-row:hover': {
                        backgroundColor: 'action.hover',
                    },
                    cursor: cursor || 'default',
                }}
                slots={{
                    noRowsOverlay: getNoRowsOverlay
                }}
            />
        </Stack>

    )
}