import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

interface Column {
    key: string;
    label: string;
    align?: 'left' | 'right' | 'center';
    format?: (value: any) => string;
}

interface IDataGrid<T> {
    columns: Column[];
    data: T[];
    getRowKey: (row: T) => string | number;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
}

export default function DataGrid<T extends Record<string, any>>({
    columns,
    data,
    getRowKey,
    onEdit,
    onDelete
}: IDataGrid<T>) {

    const formatValue = (value: any, format?: (value: any) => string) => {
        if (format) return format(value);
        if (value instanceof Date) return value.toLocaleDateString('pt-BR');
        if (value === null || value === undefined) return '-';
        return String(value);
    };

    const hasActions = onEdit || onDelete;

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell key={column.key} align={column.align || 'left'}>
                                {column.label}
                            </TableCell>
                        ))}
                        {hasActions && <TableCell align="center">Ações</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row) => (
                        <TableRow
                            key={getRowKey(row)}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            {columns.map((column) => (
                                <TableCell key={column.key} align={column.align || 'left'}>
                                    {formatValue(row[column.key], column.format)}
                                </TableCell>
                            ))}
                            {hasActions && (
                                <TableCell align="center">
                                    {onEdit && (
                                        <IconButton
                                            color="primary"
                                            onClick={() => onEdit(row)}
                                            size="small"
                                        >
                                            <Edit />
                                        </IconButton>
                                    )}
                                    {onDelete && (
                                        <IconButton
                                            color="error"
                                            onClick={() => onDelete(row)}
                                            size="small"
                                        >
                                            <Delete />
                                        </IconButton>
                                    )}
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}