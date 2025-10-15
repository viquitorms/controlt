import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

interface Column {
    key: string;
    label: string;
    format?: (value: any) => string;
}

interface DataGridProps<T extends Record<string, any>> {  // ← CORREÇÃO AQUI
    columns: Column[];
    data: T[];
    getRowKey: (row: T) => string | number;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
}

export default function DataGrid<T extends Record<string, any>>({  // ← E AQUI
    columns,
    data,
    getRowKey,
    onEdit,
    onDelete
}: DataGridProps<T>) {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell key={column.key}>{column.label}</TableCell>
                        ))}
                        {(onEdit || onDelete) && (
                            <TableCell align="right">Ações</TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length + 1} align="center">
                                Nenhum registro encontrado
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((row) => (
                            <TableRow key={getRowKey(row)} hover>
                                {columns.map((column) => (
                                    <TableCell key={column.key}>
                                        {column.format
                                            ? column.format(row[column.key])
                                            : row[column.key]
                                        }
                                    </TableCell>
                                ))}
                                {(onEdit || onDelete) && (
                                    <TableCell align="right">
                                        {onEdit && (
                                            <IconButton
                                                size="small"
                                                onClick={() => onEdit(row)}
                                                color="primary"
                                            >
                                                <Edit />
                                            </IconButton>
                                        )}
                                        {onDelete && (
                                            <IconButton
                                                size="small"
                                                onClick={() => onDelete(row)}
                                                color="error"
                                            >
                                                <Delete />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}