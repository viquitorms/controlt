import { useCallback, useEffect, useMemo, useState } from "react";
import type { GridColDef } from "@mui/x-data-grid";
import { useBackdrop } from "../../contexts/Backdrop.context";
import { useSnackbar } from "../../contexts/Snackbar.context";
import { taskService } from "../../services/task.service";
import { userService } from "../../services/user.service";
import { projectService } from "../../services/project.service";
import type { Task } from "../../dtos/task/task.res.dto";
import type { User } from "../../dtos/user/User.res.dto";
import type { Project } from "../../dtos/project/Project.res.dto";
import { useInitialize } from "../../contexts/Initialized.context";
import { createTaskColumns } from "./Tasks.columns";
import type { UpdateTaskDto } from "../../dtos/task/task.req.dto";
import { recordedTimeService } from "../../services/recordedTime.service";
import { EnumNonActionableType, EnumNonActionableTypeName } from "../../enums/NonActionableType.enum";
import { EnumActionableType, EnumActionableTypeName } from "../../enums/ActionableType.enum";
import type { StatusTask } from "../../dtos/statusTask/statusTask.res.dto";


export function useTasksController(statusName: string) {
    const { showBackdrop, hideBackdrop } = useBackdrop();
    const { showSnackbar } = useSnackbar();
    const { refresh, getStatus } = useInitialize();
    const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editTask, setTaskToEdit] = useState<Task | null>(null);
    const [status, setStatus] = useState<StatusTask>();
    const [isEditable, setIsEditable] = useState<Boolean>(false);

    /**
     * Efeito para carregar os dados iniciais quando o statusName mudar
     */
    useEffect(() => {
        onInititalized();
        setStatus(getStatus(statusName));
    }, [statusName]);

    /**
     * Inicializa os dados necessários para a página
     */
    async function onInititalized() {
        await Promise.all([
            refresh(),
            loadUsers(),
            loadProjects(),
            loadTasks(),
            checkActiveTimer(),
            setEditable(),
        ]);
    }

    /**
     * Verifica se há um timer ativo e atualiza o estado activeTaskId
     */
    async function checkActiveTimer() {
        try {
            const activeTimer = await recordedTimeService.getActiveTimer();
            if (activeTimer && activeTimer.task_id) {
                setActiveTaskId(activeTimer.task_id);
            } else {
                setActiveTaskId(null);
            }
        } catch (error) {
            console.error("Erro ao verificar timer ativo", error);
        }
    }

    /**
     * Carrega os usuários do sistema
     */
    async function loadUsers() {
        try {
            const list = await userService.findAll();
            setUsers(list);
        } catch (e) {
            console.error("Erro ao carregar usuários", e);
        }
    }

    /**
     * Carrega os projetos do sistema
     */
    async function loadProjects() {
        try {
            const list = await projectService.findAll();
            setProjects(list);
        } catch (e) {
            console.error("Erro ao carregar projetos", e);
        }
    }

    /**
     * Carrega as tarefas com base no statusName fornecido
     */
    async function loadTasks() {
        try {
            showBackdrop();
            const status = getStatus(statusName);
            // TODO: Tratar cada status de forma diferente, se necessário
            const list = await taskService.findAll({ status_id: status?.id });
            setTasks(list);
        } catch (error: any) {
            const message = error?.response?.data?.error || "Erro ao carregar tarefas";
            showSnackbar(message, 5000, "error");
        } finally {
            hideBackdrop();
        }
    }

    /**
     * Atualiza a lista de tarefas baseado no statusName fornecido
     * O useCallback é usado para memorar a função. Isso significa que o React não vai recriar essa função toda vez que o componente for renderizado.
     * Ele só vai recriar se alguma das dependências mudar (neste caso, statusName).
     */
    const handleUpdate = useCallback(async () => {
        await loadTasks();
        await checkActiveTimer();
    }, [statusName]);

    const handleDelete = useCallback(
        async (task: Task) => {
            try {
                showBackdrop();

                await taskService.update(task.id, { status_id: getStatus(EnumActionableTypeName[EnumNonActionableType.Arquivada])?.id! });
                await loadTasks();
                await checkActiveTimer();

                showSnackbar("Tarefa deletada!", 3000, "info");
            } catch (error: any) {
                const message = error?.response?.data?.error || "Erro ao deletar tarefa";
                showSnackbar(message, 5000, "error");
            } finally {
                hideBackdrop();
            }
        },
        [statusName]
    );

    /**
     * Inicia a tarefa selecionada
     */
    const handleStart = useCallback(async (task: Task) => {
        try {
            showBackdrop();

            await taskService.start(task.id);
            await loadTasks();
            await checkActiveTimer();

            showSnackbar("Tarefa iniciada!", 3000, "success");
        } catch (error: any) {
            const message = error?.response?.data?.error || "Erro ao iniciar tarefa";
            showSnackbar(message, 5000, "error");
        } finally {
            hideBackdrop();
        }
    }, [statusName]);

    /**
     * Pausa a tarefa selecionada
     */
    const handlePause = useCallback(async (task: Task) => {
        try {
            showBackdrop();

            await taskService.pause(task.id);
            await loadTasks();
            await checkActiveTimer();

            showSnackbar("Tarefa pausada!", 3000, "info");
        } catch (error: any) {
            const message = error?.response?.data?.error || "Erro ao pausar tarefa";
            showSnackbar(message, 5000, "error");
        } finally {
            hideBackdrop();
        }
    }, [statusName]);

    /**
     * Finaliza a tarefa selecionada
     */
    const handleFinish = useCallback(async (task: Task) => {
        try {
            showBackdrop();

            await taskService.finish(task.id);
            await loadTasks();
            await checkActiveTimer();

            showSnackbar("Tarefa concluída!", 3000, "success");
        } catch (error: any) {
            const message = error?.response?.data?.error || "Erro ao concluir tarefa";
            showSnackbar(message, 5000, "error");
        } finally {
            hideBackdrop();
        }
    }, [statusName]);

    /**
     * Abre o modal de edição para a tarefa selecionada.
     * Esta função não depende de nenhuma variável externa (props ou states) que mude com o tempo. Crie esta função uma única vez quando a tela carregar e nunca mais a recrie.
     * Por isso, o array de dependências está vazio.
     */
    const handleEdit = useCallback((task: Task) => {
        setTaskToEdit(task);
        setEditDialogOpen(true);
    }, []);

    /**
     * Salva as alterações feitas na tarefa editada no modal.
     */
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

                setEditDialogOpen(false);
                setTaskToEdit(null);

                await loadTasks();

                showSnackbar("Tarefa atualizada com sucesso!", 5000, "success");
            } catch (error: any) {
                const message = error?.response?.data?.error || "Erro ao atualizar tarefa";
                showSnackbar(message, 5000, "error");
            } finally {
                hideBackdrop();
            }
        },
        [statusName]
    );

    /**
     * Define se a tarefa pode ser editada com base no status atual
     */
    const setEditable = () => {
        if (!status) return;

        if (status.is_actionable) {
            switch (status.name) {
                case EnumActionableTypeName[EnumActionableType.Projeto]:
                    setIsEditable(false);
                    break;
                case EnumActionableTypeName[EnumActionableType.EmAndamento]:
                case EnumActionableTypeName[EnumActionableType.ProximaAcao]:
                case EnumActionableTypeName[EnumActionableType.Agendada]:
                case EnumActionableTypeName[EnumActionableType.Aguardando]:
                default:
                    setIsEditable(true);
                    break;
            }
        }
        else {
            switch (status.name) {
                case EnumNonActionableTypeName[EnumNonActionableType.Concluida]:
                case EnumNonActionableTypeName[EnumNonActionableType.AlgumDia]:
                case EnumNonActionableTypeName[EnumNonActionableType.Referencia]:
                case EnumNonActionableTypeName[EnumNonActionableType.Arquivada]:
                default:
                    setIsEditable(false);
                    break;
            }
        }
    }

    /**
     * Define as colunas da tabela de tarefas com base no statusName e nas funções de manipulação.
     * O useMemo garante que, se os dados não mudaram, a referência do array columns permanece a mesma na memória.  Isso é importante para otimização de performance, evitando renderizações desnecessárias.
     */
    const columns: GridColDef<Task>[] = useMemo(() => {
        return createTaskColumns(
            statusName,
            {
                handleEdit,
                handleDelete,
                handleStart,
                handlePause,
                handleFinish,
                activeTaskId,
                getStatus,
                showSnackbar
            }
        );
    }, [statusName, activeTaskId]);



    return {
        // data
        tasks,
        users,
        projects,
        columns,
        editDialogOpen,
        setEditDialogOpen,
        editTask,
        handleEdit,
        handleSaveEdit,
        handleDelete,
        handleUpdate,
        refresh: loadTasks,
        status,
        isEditable
    };
}