import { Button, Stack, Typography } from "@mui/material";
import UpdateIcon from '@mui/icons-material/Update';
import { useEffect, useState } from "react";
import DataGrid from "../../components/DataGrid.component";
import { Add } from "@mui/icons-material";
import CreateProjectModal from "./CreateProject.modal";
import { useSnackbar } from "../../contexts/Snackbar.context";
import { useBackdrop } from "../../contexts/Backdrop.context";
import { projectService } from "../../services/project.service";
import type { ProjectFindByIdResponse, ProjectListResponse } from "../../dtos/project/Project.res.dto";
import type { ProjectCreateRequest, ProjectUpdateRequest } from "../../dtos/project/Project.req.dto";
import UpdateProjectModal from "./UpdateProject.modal";
import { useAuth } from "../../contexts/Auth.context";

export default function Projects() {
    const { showSnackbar } = useSnackbar();
    const { showBackdrop, hideBackdrop } = useBackdrop();
    const { isManager } = useAuth();

    const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
    const [isUpdateProjectModalOpen, setIsUpdateProjectModalOpen] = useState(false);
    const [projectList, setProjectList] = useState<ProjectListResponse[]>([]);
    const [selectedProject, setSelectedProject] = useState<ProjectFindByIdResponse | null>(null);

    useEffect(() => {
        onInitialize();
    }, []);

    async function onInitialize() {
        showBackdrop();
        try {
            await getProjects();
        } catch (error) {
            showSnackbar('Erro ao carregar dados', 5000, 'error');
        } finally {
            hideBackdrop();
        }
    }

    async function getProjects() {
        try {
            showBackdrop();
            const list = await projectService.list();
            setProjectList(list)
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao carregar projetos';
            showSnackbar(message, 5000, 'error');
            throw error;
        }
        finally {
            hideBackdrop();
        }
    }

    async function getProjectById(id: number) {
        try {
            showBackdrop();
            const project = await projectService.findById(id);
            setSelectedProject(project)
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao carregar projetos';
            showSnackbar(message, 5000, 'error');
            throw error;
        }
        finally {
            hideBackdrop();
        }
    }

    async function UpdateProject(data: ProjectUpdateRequest): Promise<boolean> {
        try {
            showBackdrop()
            const project = await projectService.update(data);
            await getProjects();
            showSnackbar(`Projeto ${project.title} editado com sucesso`, 5000, 'success')
            return true;
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao editar projeto';
            showSnackbar(message, 5000, 'error');
            return false;
        } finally {
            hideBackdrop();
        }
    }

    async function CreateProject(data: ProjectCreateRequest): Promise<boolean> {
        try {
            showBackdrop();
            await projectService.create(data);
            await getProjects();
            showSnackbar(`Projeto ${data.title} criado com sucesso`, 5000, 'success')
            return true;
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao criar projeto';
            showSnackbar(message, 5000, 'error');
            return false;
        } finally {
            hideBackdrop();
        }
    }

    async function deleteProject(id: number, name: string) {
        try {
            showBackdrop();
            await projectService.delete(id);
            await getProjects();
            showSnackbar(`O projeto ${name} foi deletado`, 5000, 'info');
        }
        catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao deletar projeto';
            showSnackbar(message, 5000, 'error');
            throw error;
        }
        finally {
            hideBackdrop();
        }
    }


    const handleCreate = async () => {
        if (isManager) {
            setIsCreateProjectModalOpen(true);
        }
        else {
            showSnackbar('Seu projeto não tem permissão para criar projetos', 5000, 'warning')
        }
    };

    const handleEdit = async (project: ProjectListResponse) => {
        if (isManager) {
            await getProjectById(project.id);
            setIsUpdateProjectModalOpen(true);
        }
        else {
            showSnackbar('Seu projeto não tem permissão para editar projetos', 5000, 'warning')
        }
    };

    const handleDelete = async (project: ProjectListResponse) => {
        await deleteProject(project.id, project.title);
    };

    const handleUpdateList = async () => {
        await getProjects();
        showSnackbar('Lista de projetos atualizada', 5000, 'success')
    }

    return (
        <Stack spacing={2}>

            <Stack direction={'row'} spacing={1}>
                <Button
                    variant="outlined"
                    startIcon={<UpdateIcon />}
                    onClick={handleUpdateList}
                >
                    Atualizar
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleCreate}
                >
                    Adicionar
                </Button>
            </Stack>

            <DataGrid
                data={projectList}
                rowKey={(row) => row.id}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <CreateProjectModal
                open={isCreateProjectModalOpen}
                onClose={() => setIsCreateProjectModalOpen(false)}
                onSave={CreateProject}
            />

            <UpdateProjectModal
                open={isUpdateProjectModalOpen}
                project={selectedProject}
                onClose={() => setIsUpdateProjectModalOpen(false)}
                onSave={UpdateProject}
            />
        </Stack>
    );
}