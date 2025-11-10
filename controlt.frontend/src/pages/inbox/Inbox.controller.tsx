import { useCallback, useEffect, useMemo, useState } from "react";
import { useBackdrop } from "../../contexts/Backdrop.context";
import { useSnackbar } from "../../contexts/Snackbar.context";
import { itemService } from "../../services/item.service";
import { userService } from "../../services/user.service";
import { taskService } from "../../services/task.service";
import { projectService } from "../../services/project.service";
import { useInitialize } from "../../contexts/Initialized.context";
import type { Item } from "../../dtos/item/Item.res.dto";
import type { User } from "../../dtos/user/User.res.dto";
import type { Project } from "../../dtos/project/Project.res.dto";
import type { CreateTaskDto } from "../../dtos/task/task.req.dto";
import type { CreateProjectDto } from "../../dtos/project/Project.req.dto";
import { InboxGridColumns } from "./Inbox.columns";
import { useAuth } from "../../contexts/Auth.context";

export function useInboxController() {
    const { user } = useAuth();
    const { showBackdrop, hideBackdrop } = useBackdrop();
    const { showSnackbar } = useSnackbar();
    const { statusTasks, priorities, statusProjects, refresh } = useInitialize();

    const [itemsList, setItemsList] = useState<Item[]>([]);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [usersList, setUsersList] = useState<User[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [projectsList, setProjectsList] = useState<Project[]>([]);

    useEffect(() => {
        (async () => {
            try {
                await Promise.all([
                    getItems(),
                    getUsers(),
                    getProjects(),
                    refresh()
                ]);
            } catch {
                return;
            }
        })();
    }, []);

    async function getItems() {
        try {
            showBackdrop();
            const items = await itemService.findAll({ is_processed: false });
            setItemsList(items);
        } catch (error: any) {
            const message = error?.response?.data?.error || "Erro ao carregar items";
            showSnackbar(message, 5000, "error");
            throw error;
        } finally {
            hideBackdrop();
        }
    }

    async function getUsers() {
        try {
            showBackdrop();
            const users = await userService.findAll();
            setUsersList(users);
        } catch (error: any) {
            const message = error?.response?.data?.error || "Erro ao carregar usuários";
            showSnackbar(message, 5000, "error");
            throw error;
        } finally {
            hideBackdrop();
        }
    }

    async function getProjects() {
        try {
            showBackdrop();
            const projects = await projectService.findAll();
            setProjectsList(projects);
        } catch (error: any) {
            const message = error?.response?.data?.error || "Erro ao carregar projetos";
            showSnackbar(message, 5000, "error");
            throw error;
        } finally {
            hideBackdrop();
        }
    }

    const handleRefresh = useCallback(async () => {
        try {
            await getItems();
            showSnackbar("Itens atualizados com sucesso", 3000, "success");
        } catch {
            return;
        }
    }, []);

    const handleOpenWizard = useCallback((item: Item) => {
        setSelectedItem(item);
        setModalOpen(true);
    }, []);

    const handleCloseWizard = useCallback(() => {
        setSelectedItem(null);
        setModalOpen(false);
    }, []);

    const handleProcessItem = useCallback(
        async (data: CreateTaskDto) => {
            if (!selectedItem) return;
            try {
                showBackdrop();
                await taskService.create({
                    item_id: selectedItem.id,
                    title: data.title,
                    description: data.description,
                    due_date: data.due_date ?? undefined,
                    priority_id: data.priority_id,
                    project_id: data.project_id,
                    status_id: data.status_id,
                    created_by_id: data.created_by_id,
                    assigned_to_id: data.assigned_to_id,
                });
                await itemService.update(selectedItem.id, { is_processed: true });
                showSnackbar("Item processado com sucesso!", 5000, "success");
                handleCloseWizard();
                await getItems();
            } catch (error: any) {
                const message = error?.response?.data?.error || "Erro ao processar item";
                showSnackbar(message, 5000, "error");
            } finally {
                hideBackdrop();
            }
        },
        [selectedItem, handleCloseWizard]
    );

    const handleConvertToProject = useCallback(
        async (projectData: CreateProjectDto) => {
            if (!selectedItem) return;
            try {
                showBackdrop();
                await projectService.create({
                    title: projectData.title,
                    description: projectData.description,
                    status_id: projectData.status_id,
                });
                await itemService.update(selectedItem.id, { is_processed: true });
                showSnackbar("Item convertido em projeto com sucesso!", 5000, "success");
                handleCloseWizard();
                await getItems();
            } catch (error: any) {
                const message = error?.response?.data?.error || "Erro ao converter em projeto";
                showSnackbar(message, 5000, "error");
            } finally {
                hideBackdrop();
            }
        },
        [selectedItem, handleCloseWizard]
    );

    const columns = useMemo(
        () => InboxGridColumns({ handleOpenWizard }),
        [handleOpenWizard]
    );

    return {
        // dados
        itemsList,
        usersList,
        projectsList,
        selectedItem,
        modalOpen,
        columns,

        // handlers
        handleOpenWizard,
        handleCloseWizard,
        handleProcessItem,
        handleConvertToProject,
        handleRefresh,

        // dados auxiliares
        statusTasks,
        priorities,
        statusProjects,
    };
}