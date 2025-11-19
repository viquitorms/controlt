import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { IconButton, Stack, Tooltip } from "@mui/material";
import { Edit, Delete, PlayArrow, Pause, CheckCircle } from "@mui/icons-material";
import type { Task } from "../../dtos/task/task.res.dto";

export interface TaskColumnOptions {
    handleEdit: (task: Task) => void;
    handleDelete: (task: Task) => void;
    handleStart: (task: Task) => void;
    handlePause: (task: Task) => void;
    handleFinish: (task: Task) => void;
}
export const baseColumns: GridColDef<Task>[] = [
    {
        field: "id",
        headerName: "ID",
        width: 80
    },
    {
        field: "priority",
        headerName: "Prioridade",
        width: 120,
        renderCell: (params: GridRenderCellParams<Task>) => {
            return (<span>{params.row.priority?.name ?? "-"}</span>);
        },
    },
    {
        field: "title",
        headerName: "Título",
        flex: 1
    },
    {
        field: "description",
        headerName: "Descrição",
        flex: 1,
        sortable: false,
        filterable: false,
    },
];

export function createTaskColumns(statusName: string, options: TaskColumnOptions): GridColDef<Task>[] {
    const { handleEdit, handleDelete, handleStart, handlePause, handleFinish } = options;

    const actionsColumn: GridColDef<Task> = {
        field: "actions",
        type: "actions",
        headerName: "Ações",
        width: 180,
        align: "center",
        headerAlign: "center",
        sortable: false,
        disableColumnMenu: true,
        renderCell: (params: GridRenderCellParams<Task>) => (
            <Stack direction="row" spacing={1}>

                {(statusName === "Próxima Ação" || statusName === "Em Andamento") && (
                    <Tooltip title="Iniciar / Retomar">
                        <IconButton color="success" size="small" onClick={() => handleStart(params.row)}>
                            <PlayArrow fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}

                {statusName === "Em Andamento" && (
                    <>
                        <Tooltip title="Pausar">
                            <IconButton color="warning" size="small" onClick={() => handlePause(params.row)}>
                                <Pause fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Concluir">
                            <IconButton color="success" size="small" onClick={() => handleFinish(params.row)}>
                                <CheckCircle fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </>
                )}

                {/* Botões Padrão */}
                <Tooltip title="Editar">
                    <IconButton color="primary" size="small" onClick={() => handleEdit(params.row)}>
                        <Edit fontSize="small" />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Deletar">
                    <IconButton color="error" size="small" onClick={() => handleDelete(params.row)}>
                        <Delete fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Stack>
        ),
    };

    let extraColumns: GridColDef<Task>[] = [];

    switch (statusName) {

        case "Algum Dia":
            extraColumns = [
                {
                    field: "project",
                    type: "string",
                    headerName: "Projeto",
                    width: 150,
                    renderCell: (params: GridRenderCellParams<Task>) => {
                        return (
                            <span>
                                {params?.row?.project?.title ?? "-"}
                            </span>
                        );
                    },
                },
                {
                    field: "created_date",
                    headerName: "Criação",
                    type: "string",
                    width: 140,
                    renderCell: (params: GridRenderCellParams<Task>) => {
                        return (
                            <span>
                                {new Date(params.row.created_date).toLocaleDateString()}
                            </span>
                        );
                    },
                },
                actionsColumn,
            ];
            break;

        case "Concluída":
            extraColumns = [
                {
                    field: "project",
                    type: "string",
                    headerName: "Projeto",
                    width: 150,
                    renderCell: (params: GridRenderCellParams<Task>) => {
                        return (
                            <span>
                                {params?.row?.project?.title ?? "-"}
                            </span>
                        );
                    },
                },
                {
                    field: "created_date",
                    headerName: "Criação",
                    type: "string",
                    width: 140,
                    renderCell: (params: GridRenderCellParams<Task>) => {
                        return (
                            <span>
                                {
                                    params.row.created_date &&
                                    new Date(params.row.created_date).toLocaleDateString()
                                }
                                {
                                    params.row.created_date === null && "-"
                                }
                            </span>
                        );
                    },
                },
                {
                    field: "started_at",
                    headerName: "Início",
                    type: "string",
                    width: 140,
                    renderCell: (params: GridRenderCellParams<Task>) => {
                        return (
                            <span>
                                {
                                    params.row.started_at &&
                                    new Date(params.row.started_at).toLocaleDateString()
                                }
                                {
                                    params.row.started_at === null && "-"
                                }
                            </span>
                        );
                    },
                },
                {
                    field: "completed_at",
                    headerName: "Conclusão",
                    type: "string",
                    width: 140,
                    renderCell: (params: GridRenderCellParams<Task>) => {
                        return (
                            <span>
                                {
                                    params.row.completed_at &&
                                    new Date(params.row.completed_at).toLocaleDateString()
                                }
                                {
                                    params.row.completed_at === null && "-"
                                }
                            </span>
                        );
                    },
                },
            ];
            break;


        default:
            extraColumns = [actionsColumn];
            break;
    }

    return [...baseColumns, ...extraColumns];
}