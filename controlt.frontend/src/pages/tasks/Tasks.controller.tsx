import { useCallback, useEffect, useMemo, useState } from "react";
import type { GridColDef } from "@mui/x-data-grid";
import { useBackdrop } from "../../contexts/Backdrop.context";
import { useSnackbar } from "../../contexts/Snackbar.context";
import { taskService } from "../../services/task.service";
import { userService } from "../../services/user.service";
import { projectService } from "../../services/project.service";
import { useAuth } from "../../contexts/Auth.context";
import type { Task } from "../../dtos/task/task.res.dto";
import type { User } from "../../dtos/user/User.res.dto";
import type { Project } from "../../dtos/project/Project.res.dto";
import { useInitialize } from "../../contexts/Initialized.context";
import { createTaskColumns } from "./Tasks.columns";
import type { UpdateTaskDto } from "../../dtos/task/task.req.dto";


export function useTasksController(statusName: string) {
    const { user } = useAuth();
    const { showBackdrop, hideBackdrop } = useBackdrop();
    const { showSnackbar } = useSnackbar();
    const { statusTasks, refresh: refreshInit } = useInitialize();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

    useEffect(() => {
        if (statusTasks.length === 0) refreshInit();
        loadInitialData();
    }, [statusName]);

    async function loadInitialData() {
        await Promise.all([
            loadUsers(),
            loadProjects(),
            loadTasks()
        ]);
    }

    async function loadUsers() {
        try {
            const list = await userService.findAll();
            setUsers(list);
        } catch (e) {
            console.error("Erro ao carregar usuários", e);
        }
    }

    async function loadProjects() {
        try {
            const list = await projectService.findAll();
            setProjects(list);
        } catch (e) {
            console.error("Erro ao carregar projetos", e);
        }
    }

    async function loadTasks() {
        try {
            showBackdrop();
            const statusId = statusTasks.find((s) => s.name === statusName)?.id;
            const list = await taskService.findAll({ status_id: statusId, assigned_to_id: user?.id });
            setTasks(list);
        } catch (error: any) {
            const message = error?.response?.data?.error || "Erro ao carregar tarefas";
            showSnackbar(message, 5000, "error");
        } finally {
            hideBackdrop();
        }
    }

    const handleUpdate = useCallback(async () => {
        await loadTasks();
    }, [statusName]);

    const handleDelete = useCallback(
        async (task: Task) => {
            try {
                showBackdrop();
                await taskService.remove(task.id);
                showSnackbar("Tarefa deletada!", 3000, "info");
                await loadTasks();
            } catch (error: any) {
                const message = error?.response?.data?.error || "Erro ao deletar tarefa";
                showSnackbar(message, 5000, "error");
            } finally {
                hideBackdrop();
            }
        },
        [statusName]
    );

    const handleEdit = useCallback((task: Task) => {
        setTaskToEdit(task);
        setEditDialogOpen(true);
    }, []);

    const handleSaveEdit = useCallback(
        async (data: Partial<Task>) => {
            try {
                showBackdrop();

                const updatedTask: UpdateTaskDto = {
                    title: data.title!,
                    description: data.description || "",
                    due_date: data.due_date || null || undefined,
                    priority_id: data.priority_id || undefined,
                    project_id: data.project_id || undefined,
                    status_id: data.status_id!,
                    assigned_to_id: data.assigned_to_id || undefined,
                }

                await taskService.update(data.id!, updatedTask);
                showSnackbar("Tarefa atualizada com sucesso!", 5000, "success");
                setEditDialogOpen(false);
                setTaskToEdit(null);
                await loadTasks();
            } catch (error: any) {
                const message = error?.response?.data?.error || "Erro ao atualizar tarefa";
                showSnackbar(message, 5000, "error");
            } finally {
                hideBackdrop();
            }
        },
        [statusName]
    );

    const columns: GridColDef<Task>[] = useMemo(() => {
        return createTaskColumns(
            statusName, { handleEdit, handleDelete }
        );
    }, [statusName, handleEdit, handleDelete]);

    return {
        // data
        tasks,
        users,
        projects,

        // columns
        columns,

        // modal
        editDialogOpen,
        setEditDialogOpen,
        taskToEdit,
        handleEdit,
        handleSaveEdit,

        // actions
        handleDelete,
        handleUpdate,

        // refresh
        refresh: loadTasks,
    };
}