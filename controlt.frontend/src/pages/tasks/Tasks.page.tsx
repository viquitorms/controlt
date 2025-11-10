import { Button, Stack, Typography } from "@mui/material";
import CTDataGrid from "../../components/ui/CTDataGrid.component";
import TaskEditModal from "./Tasks.modal";
import { useTasksController } from "./Tasks.controller";
import type { Task } from "../../dtos/task/task.res.dto";
import { useNavigate } from "react-router-dom";

interface TasksPageProps {
    statusName: string;
    onRowDoubleClick?: (task: Task) => void;
}

export default function TasksPage({ statusName, onRowDoubleClick }: TasksPageProps) {
    const controller = useTasksController(statusName);
    const navigate = useNavigate();

    const {
        tasks,
        columns,
        editDialogOpen,
        taskToEdit,
        users,
        projects,
        handleEdit,
        handleSaveEdit,
        setEditDialogOpen,
        refresh,
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
                    const t = params.row as Task;
                    if (onRowDoubleClick) return onRowDoubleClick(t);
                    handleEdit(t);
                }}
            />

            <TaskEditModal
                open={editDialogOpen}
                task={taskToEdit}
                users={users}
                projects={projects}
                onClose={() => setEditDialogOpen(false)}
                onSave={handleSaveEdit}
            />
        </Stack>
    );
}