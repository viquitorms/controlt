import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

interface Column {
    key: string;
    label: string;
    format?: (value: any, row?: any) => string;
}

interface DataGridProps<T extends Record<string, any>> {
    columns?: Column[];  // opcional
    data: T[];
    rowKey: (row: T) => string | number;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    excludeColumns?: string[];
    columnLabels?: Record<string, string>;
}

export default function DataGrid<T extends Record<string, any>>({
    columns,
    data,
    rowKey: rowKey,
    onEdit,
    onDelete,
    excludeColumns = [],
    columnLabels = {}
}: DataGridProps<T>) {

    const autoGenerateColumns = (): Column[] => {
        if (data.length === 0) return [];

        const keys = Object.keys(data[0]).filter(key => !excludeColumns.includes(key));

        return keys.map(key => ({
            key,
            label: columnLabels[key] || formatLabel(key),
            format: (value: any) => formatValue(key, value)
        }));
    };

    const formatLabel = (key: string): string => {
        return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const formatValue = (key: string, value: any): string => {
        if (value == null) return '-';

        if (key.includes('date') || key.includes('_at')) {
            return new Date(value).toLocaleDateString('pt-BR');
        }

        if (typeof value === 'boolean') {
            return value ? 'Sim' : 'Não';
        }

        if (typeof value === 'object') {
            return value.name || value.title || JSON.stringify(value);
        }

        return String(value);
    };

    const finalColumns = columns || autoGenerateColumns();

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        {finalColumns.map((column) => (
                            <TableCell key={column.key}>
                                <strong>{column.label}</strong>
                            </TableCell>
                        ))}
                        {(onEdit || onDelete) && (
                            <TableCell align="right">
                                <strong>Ações</strong>
                            </TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={finalColumns.length + 1} align="center">
                                Nenhum registro encontrado
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((row) => (
                            <TableRow key={rowKey(row)} hover>
                                {finalColumns.map((column) => (
                                    <TableCell key={column.key}>
                                        {column.format
                                            ? column.format(row[column.key], row)
                                            : row[column.key] ?? '-'
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