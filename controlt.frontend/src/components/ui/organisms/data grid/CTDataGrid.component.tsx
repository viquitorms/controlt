import { Update } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import { DataGrid, type GridColDef, type GridRowSelectionModel } from "@mui/x-data-grid";
import type { JSXElementConstructor, ReactNode } from "react";

interface IDataGrid {
    rows: any[];
    columns: GridColDef<any>[];
    refresh?: () => Promise<void>;
    NoRowsOverlay?: JSXElementConstructor<React.HTMLAttributes<HTMLDivElement>>;
    cursor?: string;
    onRowDoubleClick?: (params: any) => void;
    checkboxSelection?: boolean;
    disableRowSelectionOnClick?: boolean;
    onRowSelectionModelChange?: (rowSelectionModel: GridRowSelectionModel) => void;
    actions?: ReactNode;
}

export default function CTDataGrid({
    rows,
    columns,
    refresh,
    NoRowsOverlay,
    cursor,
    onRowDoubleClick,
    checkboxSelection,
    disableRowSelectionOnClick,
    onRowSelectionModelChange,
    actions
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
                <Stack direction="row" spacing={3} alignItems="center">
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
                    {
                        actions
                    }
                </Stack>

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
                checkboxSelection={checkboxSelection}
                disableRowSelectionOnClick={disableRowSelectionOnClick}
                onRowSelectionModelChange={onRowSelectionModelChange}
                pageSizeOptions={[5, 10, 25, 50]}
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