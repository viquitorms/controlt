import { Button, Stack, Typography } from "@mui/material";
import CTDataGrid from "../../components/ui/organisms/data grid/CTDataGrid.component";
import TaskEditModal from "./Tasks.modal";
import { useTasksController } from "./Tasks.controller";
import type { Task } from "../../dtos/task/task.res.dto";
import { useNavigate } from "react-router-dom";
import CTDialog from "../../components/ui/organisms/dialog/CTDialog.component";
import { Done, DoneAll } from "@mui/icons-material";
import { EnumActionableType, EnumActionableTypeName } from "../../enums/ActionableType.enum";

interface TasksPageProps {
    statusName: string;
}

export default function TasksPage({ statusName }: TasksPageProps) {

    // Quando um página chama esta página, ela pode passar um statusName para filtrar as tarefas exibidas
    const controller = useTasksController(statusName);
    const navigate = useNavigate();

    // Resgata as propriedades e métodos do controller
    const {
        tasks,
        columns,
        users,
        projects,
        status,
        refresh,

        // Edição
        isEditable,
        editDialogOpen,
        editTask,
        handleEdit,
        handleSaveEdit,
        setEditDialogOpen,

        // Finalização
        confirmFinishDialogOpen,
        setConfirmFinishDialogOpen,
        handleConfirmFinishTask,
        taskToFinish,

        // Arquivamento
        confirmArchiveDialogOpen,
        setConfirmArchiveDialogOpen,
        handleConfirmArchiveTask,
        taskToArchive,

        handleRowSelectionModelChange,
        selectedTasks,

        isMultipleSelectActive
    } = controller;

    function NoRowsOverlay() {
        return (
            <Stack height="100%" alignItems="center" justifyContent="center" spacing={1}>
                <Typography>Nenhum item para exibir.</Typography>
                <Button variant="contained" onClick={() => navigate("/captura")}>
                    Capturar Itens
                </Button>
            </Stack>
        );
    }

    /**
     * Renderiza as ações disponíveis acima da DataGrid
     * @returns 
     */
    const renderActions = () => {
        if (status?.name === EnumActionableTypeName[EnumActionableType.EmAndamento]) {
            return (
                <Stack direction="row" spacing={1}>
                    {
                        selectedTasks.length > 0 && (
                            <Button variant={"contained"} color="success" onClick={() => setConfirmFinishDialogOpen(true)} startIcon={selectedTasks.length > 1 ? <DoneAll /> : <Done />}>
                                {selectedTasks.length} {selectedTasks.length === 1 ? 'finalizar tarefa' : 'finalizar tarefas'}
                            </Button>
                        )
                    }
                </Stack>
            )
        }
    }

    /**
     * Renderiza o conteúdo do dialog de confirmação de finalização de tarefa
     * @returns 
     */
    const renderConfirmFinishDialogContent = () => {
        if (selectedTasks.length > 1) {
            return (
                <Stack spacing={1}>
                    <Typography>
                        Tem certeza que deseja finalizar as tarefas selecionadas
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Esta ação irá parar os cronômetros ativos e mover as tarefas para concluídas.
                    </Typography>
                </Stack>
            )
        }
        else {
            return (
                <Stack spacing={1}>
                    <Typography>
                        Tem certeza que deseja finalizar a tarefa
                        {taskToFinish ? <strong> "{taskToFinish.title}"</strong> : " selecionada"}?
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Esta ação irá parar o cronômetro ativo e mover a tarefa para concluída.
                    </Typography>
                </Stack>
            )
        }
    }

    function getFinishDialogTitle() {
        if (selectedTasks.length > 1) {
            return "Concluir Tarefas";
        }
        return "Concluir Tarefa";
    }

    return (
        <Stack spacing={2}>

            {/**
             * Data Grid de Tarefas
             */}
            <CTDataGrid
                rows={tasks}
                columns={columns}
                refresh={refresh}
                cursor="pointer"
                actions={renderActions()}
                checkboxSelection={isMultipleSelectActive()}
                disableRowSelectionOnClick={true}
                onRowSelectionModelChange={(selection) => { handleRowSelectionModelChange(selection) }}
                NoRowsOverlay={NoRowsOverlay}
                onRowDoubleClick={(params) => {
                    if (isEditable) {
                        const task = params.row as Task;
                        handleEdit(task);
                    }
                }}
            />

            {/**
             * Modal de edição de tarefa
             */}
            <TaskEditModal
                open={editDialogOpen}
                task={editTask}
                users={users}
                projects={projects}
                status={status!}
                onClose={() => setEditDialogOpen(false)}
                onSave={handleSaveEdit}
            />

            {/**
             * Dialogs de confirmação único
             */}
            <CTDialog
                open={confirmFinishDialogOpen}
                title={getFinishDialogTitle()}
                onClose={() => setConfirmFinishDialogOpen(false)}
                onConfirm={handleConfirmFinishTask}
                confirmText="Sim, concluir"
                cancelText="Cancelar"
                maxWidth="sm"
            >
                {
                    renderConfirmFinishDialogContent()
                }
            </CTDialog>

            {/**
             * Dialog de confirmação de arquivamento
             */}
            <CTDialog
                open={confirmArchiveDialogOpen}
                title="Arquivar Tarefa"
                onClose={() => setConfirmArchiveDialogOpen(false)}
                onConfirm={handleConfirmArchiveTask}
                confirmText="Sim, arquivar"
                cancelText="Cancelar"
                maxWidth="sm"
            >
                <Stack spacing={1}>
                    <Typography>
                        Tem certeza que deseja arquivar a tarefa
                        {taskToArchive ? <strong> "{taskToArchive.title}"</strong> : " selecionada"}?
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Esta ação fará com que a tarefa não apareça mais nas listas ativas.
                    </Typography>
                </Stack>
            </CTDialog>
        </Stack >
    );
}