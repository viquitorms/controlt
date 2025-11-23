import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { Edit, Delete, PlayArrow, Pause, CheckCircle } from "@mui/icons-material";
import type { Task } from "../../dtos/task/task.res.dto";
import type { StatusTask } from "../../dtos/statusTask/statusTask.res.dto";
import { EnumNonActionableType, EnumNonActionableTypeName } from "../../enums/NonActionableType.enum";
import { EnumActionableType, EnumActionableTypeName } from "../../enums/ActionableType.enum";

export interface TaskColumnOptions {
    handleEdit: (task: Task) => void;
    handleDelete: (task: Task) => void;
    handleStart: (task: Task) => void;
    handlePause: (task: Task) => void;
    handleFinish: (task: Task) => void;
    handleArchive: (task: Task) => void;
    activeTaskId: number | null;
    getStatus: (statusName: string) => StatusTask | undefined;
    showSnackbar: (message: string, duration?: number, severity?: "info" | "success" | "warning" | "error") => void;
}

/**
 * Função que cria as colunas da tabela de tarefas com base no statusName e nas funções de manipulação.
 */
export function createTaskColumns(statusName: string, options: TaskColumnOptions): GridColDef<Task>[] {
    // const { showSnackbar } = useSnackbar();
    // const { getStatus } = useInitialize();

    const status = options.getStatus(statusName);
    var taskColumns: GridColDef<Task>[] = [];
    var actionColumn: GridColDef<Task> | undefined;

    if (!status) {
        options.showSnackbar(`Status "${statusName}" não encontrado. Verifique a configuração da página.`, 8000, "error");
        return [];
    }

    taskColumns = status.is_actionable ? createActionableTasksColumns(status) : createNonActionableTasksColumns(status);

    if (!taskColumns) {
        options.showSnackbar(`Nenhuma coluna definida para o status "${statusName}". Verifique a configuração da página.`, 8000, "warning");
        return [];
    }

    actionColumn = createActionColumn(status, options);

    if (!actionColumn) {
        return [...baseColumns, ...taskColumns];
    }

    return [...baseColumns, ...taskColumns, actionColumn];
}

/**
 * Colunas base comuns a todas as tabelas de tarefas
 */
export const baseColumns: GridColDef<Task>[] = [
    {
        field: "id",
        headerName: "ID",
        width: 80
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

/**
 * Cria as colunas específicas para tarefas não acionáveis com base no status.
 */
function createNonActionableTasksColumns(status: StatusTask): GridColDef<Task>[] {
    switch (status.name) {
        case EnumNonActionableTypeName[EnumNonActionableType.Concluida]:
            return [
                {
                    field: "priority",
                    type: "string",
                    headerName: "Prioridade",
                    width: 120,
                    renderCell: (params: GridRenderCellParams<Task>) => {
                        return (
                            <span>{params?.row?.priority?.name ?? "-"}</span>
                        );
                    },
                },
                {
                    field: "project",
                    type: "string",
                    headerName: "Projeto",
                    width: 150,
                    renderCell: (params: GridRenderCellParams<Task>) => {
                        return (
                            <span>{params?.row?.project?.title ?? "-"}</span>
                        );
                    },
                },
                {
                    field: "due_date",
                    type: "string",
                    headerName: "Data de Vencimento",
                    width: 150,
                    renderCell: (params: GridRenderCellParams<Task>) => {
                        return (
                            <span>{params?.row?.due_date ? new Date(params?.row?.due_date).toLocaleString() : "-"}</span>
                        )
                    },
                },
                {
                    field: "started_at",
                    type: "string",
                    headerName: "Iniciada em",
                    width: 150,
                    renderCell: (params: GridRenderCellParams<Task>) => {
                        return (
                            <span>{params?.row?.started_at ? new Date(params?.row?.started_at).toLocaleString() : "-"}</span>
                        )
                    },
                },
                {
                    field: "completed_at",
                    type: "string",
                    headerName: "Concluída em",
                    width: 150,
                    renderCell: (params: GridRenderCellParams<Task>) => {
                        return (
                            <span>{params?.row?.completed_at ? new Date(params?.row?.completed_at).toLocaleString() : "-"}</span>
                        )
                    }
                },
                {
                    field: "assigned_to",
                    type: "string",
                    headerName: "Responsável",
                    width: 150,
                    renderCell: (params: GridRenderCellParams<Task>) => {
                        return (
                            <span>{params?.row?.assigned_to?.name ?? "-"}</span>
                        );
                    },
                }
            ];
        case EnumNonActionableTypeName[EnumNonActionableType.AlgumDia]:
            return [
                {
                    field: "project",
                    type: "string",
                    headerName: "Projeto",
                    width: 150,
                    renderCell: (params: GridRenderCellParams<Task>) => {
                        return (
                            <span>{params?.row?.project?.title ?? "-"}</span>
                        );
                    },
                },
            ];
        case EnumNonActionableTypeName[EnumNonActionableType.Referencia]:
        case EnumNonActionableTypeName[EnumNonActionableType.Arquivada]:
            return [
                {
                    field: "created_by",
                    type: "string",
                    headerName: "Criado por",
                    width: 150,
                    renderCell: (params: GridRenderCellParams<Task>) => {
                        return (
                            <span>{params?.row?.created_by?.name ?? "-"}</span>
                        );
                    }
                },
                {
                    field: "created_date",
                    type: "string",
                    headerName: "Data de Criação",
                    width: 150,
                    renderCell: (params: GridRenderCellParams<Task>) => {
                        return (
                            <span>{params?.row?.created_date ? new Date(params?.row?.created_date).toLocaleString() : "-"}</span>
                        )
                    },
                }
            ];
        default:
            return [];
    }
}

/**
 * Cria as colunas específicas para tarefas acionáveis com base no status.
 */
function createActionableTasksColumns(status: StatusTask): GridColDef<Task>[] {
    switch (status.name) {
        case EnumActionableTypeName[EnumActionableType.EmAndamento]:
            return [
                {
                    field: "priority",
                    type: "string",
                    headerName: "Prioridade",
                    width: 120,
                    renderCell: (params: GridRenderCellParams<Task>) => {
                        return (
                            <span>{params?.row?.priority?.name ?? "-"}</span>
                        );
                    },
                },
                {
                    field: "project",
                    type: "string",
                    headerName: "Projeto",
                    width: 150,
                    renderCell: (params: GridRenderCellParams<Task>) => {
                        return (
                            <span>{params?.row?.project?.title ?? "-"}</span>
                        );
                    },
                },
                {
                    field: "due_date",
                    type: "string",
                    headerName: "Data de Vencimento",
                    width: 150,
                    renderCell: (params: GridRenderCellParams<Task>) => {
                        return (
                            <span>{params?.row?.due_date ? new Date(params?.row?.due_date).toLocaleString() : "-"}</span>
                        )
                    },
                },
                {
                    field: "created_date",
                    type: "string",
                    headerName: "Data de Criação",
                    width: 150,
                    renderCell: (params: GridRenderCellParams<Task>) => {
                        return (
                            <span>{params?.row?.created_date ? new Date(params?.row?.created_date).toLocaleString() : "-"}</span>
                        )
                    }
                },
                {
                    field: "started_at",
                    type: "string",
                    headerName: "Iniciada em",
                    width: 150,
                    renderCell: (params: GridRenderCellParams<Task>) => {
                        return (
                            <span>{params?.row?.started_at ? new Date(params?.row?.started_at).toLocaleString() : "-"}</span>
                        )
                    },
                },
                {
                    field: "assigned_to",
                    type: "string",
                    headerName: "Responsável",
                    width: 150,
                    renderCell: (params: GridRenderCellParams<Task>) => {
                        return (
                            <span>{params?.row?.assigned_to?.name ?? "-"}</span>
                        );
                    },
                }
            ];
        case EnumActionableTypeName[EnumActionableType.ProximaAcao]:
        case EnumActionableTypeName[EnumActionableType.Agendada]:
        case EnumActionableTypeName[EnumActionableType.Aguardando]:
            return [
                {
                    field: "priority",
                    type: "string",
                    headerName: "Prioridade",
                    width: 120,
                    renderCell: (params: GridRenderCellParams<Task>) => {
                        return (
                            <span>{params?.row?.priority?.name ?? "-"}</span>
                        );
                    },
                },
                {
                    field: "project",
                    type: "string",
                    headerName: "Projeto",
                    width: 150,
                    renderCell: (params: GridRenderCellParams<Task>) => {
                        return (
                            <span>{params?.row?.project?.title ?? "-"}</span>
                        );
                    },
                },
                {
                    field: "due_date",
                    type: "string",
                    headerName: "Data de Vencimento",
                    width: 150,
                    renderCell: (params: GridRenderCellParams<Task>) => {
                        return (
                            <span>{params?.row?.due_date ? new Date(params?.row?.due_date).toLocaleString() : "-"}</span>
                        )
                    },
                },
                {
                    field: "assigned_to",
                    type: "string",
                    headerName: "Responsável",
                    width: 150,
                    renderCell: (params: GridRenderCellParams<Task>) => {
                        return (
                            <span>{params?.row?.assigned_to?.name ?? "-"}</span>
                        );
                    },
                }
            ];
        default:
            return [];
    }
}

/**
 * Cria a coluna de ações com base no status da tarefa.
 */
function createActionColumn(status: StatusTask, options: TaskColumnOptions): GridColDef<Task> | undefined {
    switch (status.name) {
        case EnumNonActionableTypeName[EnumNonActionableType.Concluida]:
        case EnumNonActionableTypeName[EnumNonActionableType.Arquivada]:
            return undefined;
        default:
            return {
                field: "actions",
                type: "actions",
                headerName: "Ações",
                width: 180,
                align: "center",
                headerAlign: "center",
                sortable: false,
                disableColumnMenu: true,
                renderCell: (params: GridRenderCellParams<Task>) => {
                    return renderActionsCell(params, status, options);
                },
            };
    }
}

/**
 * Função que renderiza a célula de ações com base no status da tarefa.
 */
function renderActionsCell(
    params: GridRenderCellParams<Task>,
    status: StatusTask,
    options: TaskColumnOptions
) {
    const task: Task = params.row;
    const isRunning = task.id === options.activeTaskId;

    return (
        <Stack direction="row" spacing={1}>

            {
                status.is_actionable && !isRunning && (
                    <Tooltip title="Iniciar contagem de tempo">
                        <IconButton color="success" size="small" onClick={() => options.handleStart(task)}>
                            <PlayArrow fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}

            {
                status.name === EnumActionableTypeName[EnumActionableType.EmAndamento] && isRunning && (
                    <Tooltip title="Pausar contagem de tempo">
                        <IconButton color="warning" size="small" onClick={() => options.handlePause(task)}>
                            <Pause fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}

            {
                status.is_actionable && (
                    <>
                        <Tooltip title="Concluir">
                            <IconButton color="success" size="small" onClick={() => options.handleFinish(task)}>
                                <CheckCircle fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </>
                )}

            {
                (
                    status.name === EnumActionableTypeName[EnumActionableType.EmAndamento] ||
                    status.name === EnumActionableTypeName[EnumActionableType.ProximaAcao] ||
                    status.name === EnumActionableTypeName[EnumActionableType.Agendada] ||
                    status.name === EnumActionableTypeName[EnumActionableType.Aguardando]) && (
                    <Tooltip title="Editar">
                        <IconButton color="primary" size="small" onClick={() => options.handleEdit(task)}>
                            <Edit fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )
            }

            {
                status.name !== EnumNonActionableTypeName[EnumNonActionableType.Arquivada] && (
                    <Tooltip title="Deletar">
                        <IconButton color="error" size="small" onClick={() => options.handleArchive(task)}>
                            <Delete fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}

        </Stack>
    );
}