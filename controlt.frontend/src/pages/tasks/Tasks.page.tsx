import { Button, Stack, Typography } from "@mui/material";
import CTDataGrid from "../../components/ui/organisms/data grid/CTDataGrid.component";
import TaskEditModal from "./Tasks.modal";
import { useTasksController } from "./Tasks.controller";
import type { Task } from "../../dtos/task/task.res.dto";
import { useNavigate } from "react-router-dom";
import CTDialog from "../../components/ui/organisms/dialog/CTDialog.component";

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
        editDialogOpen,
        editTask,
        users,
        projects,
        handleEdit,
        handleSaveEdit,
        setEditDialogOpen,
        refresh,
        status,
        isEditable,
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

    return (
        <Stack spacing={2}>
            <CTDataGrid
                rows={tasks}
                columns={columns}
                refresh={refresh}
                cursor="pointer"
                NoRowsOverlay={NoRowsOverlay}
                onRowDoubleClick={(params) => {
                    if (isEditable) {
                        const task = params.row as Task;
                        handleEdit(task);
                    }
                }}
            />

            <TaskEditModal
                open={editDialogOpen}
                task={editTask}
                users={users}
                projects={projects}
                status={status!}
                onClose={() => setEditDialogOpen(false)}
                onSave={handleSaveEdit}
            />
        </Stack>
    );
}