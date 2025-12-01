import { Button, IconButton, Stack, Typography, Drawer, Box, List, Divider, ListItemButton } from "@mui/material";
import UpdateIcon from '@mui/icons-material/Update';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from "react";
import { Delete, Edit } from "@mui/icons-material";
import CreateProjectModal from "./CreateProject.modal";
import { useSnackbar } from "../../contexts/Snackbar.context";
import { useBackdrop } from "../../contexts/Backdrop.context";
import { projectService } from "../../services/project.service";
import type { Project } from "../../dtos/project/Project.res.dto";
import UpdateProjectModal from "./UpdateProject.modal";
import { useAuth } from "../../contexts/Auth.context";
import type { CreateProjectDto, UpdateProjectDto } from "../../dtos/project/Project.req.dto";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import { useInitialize } from "../../contexts/Initialized.context";

export default function Projects() {
    const { showSnackbar } = useSnackbar();
    const { showBackdrop, hideBackdrop } = useBackdrop();
    const { isManager } = useAuth();
    const { statusProjects, refresh } = useInitialize();

    const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
    const [isUpdateProjectModalOpen, setIsUpdateProjectModalOpen] = useState(false);
    const [projectList, setProjectList] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const [detailOpen, setDetailOpen] = useState(false);
    const [detailProject, setDetailProject] = useState<Project | null>(null);

    useEffect(() => {
        onInitialize();
    }, []);

    async function onInitialize() {
        try {
            showBackdrop();
            await getProjects();
            if (statusProjects.length === 0) {
                await refresh();
            }
        } catch (error) {
            showSnackbar('Erro ao carregar dados', 5000, 'error');
        } finally {
            hideBackdrop();
        }
    }

    async function getProjects() {
        try {
            showBackdrop();
            const list = await projectService.findAll();
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

    async function UpdateProject(data: Project): Promise<boolean> {
        try {
            showBackdrop()

            const updateProject: UpdateProjectDto = {
                title: data.title,
                status_id: data.status_id,
            }

            const project = await projectService.update(data.id, updateProject);
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

    async function CreateProject(data: CreateProjectDto): Promise<boolean> {
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
            await projectService.remove(id);
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

    const handleEdit = async (project: Project) => {
        if (isManager) {
            setSelectedProject(project);
            setIsUpdateProjectModalOpen(true);
        }
        else {
            showSnackbar('Seu projeto não tem permissão para editar projetos', 5000, 'warning')
        }
    };

    const handleDelete = async (project: Project) => {
        await deleteProject(project.id, project.title);
    };

    const handleUpdateList = async () => {
        await getProjects();
        showSnackbar('Lista de projetos atualizada', 5000, 'success')
    }

    const openDetail = (project: Project) => {
        setDetailProject(project);
        setDetailOpen(true);
    };

    const columns: GridColDef<Project>[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 80,
        },
        {
            field: 'title',
            headerName: 'Título',
            flex: 1,
        },
        {
            field: 'description',
            headerName: 'Descrição',
            flex: 1,
        },
        {
            field: 'status_id',
            headerName: 'Status',
            flex: 0.6,
            renderCell: (params: GridRenderCellParams<Project>) => (
                <span>{params.row.status?.name}</span>
            )
        },
        {
            field: 'actions',
            headerName: 'Ações',
            width: 120,
            sortable: false,
            filterable: false,
            renderCell: (params: GridRenderCellParams<Project>) => (
                <Box>
                    <IconButton size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(params.row);
                        }}
                    >
                        <Edit />
                    </IconButton>
                    <IconButton size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(params.row);
                        }}
                    >
                        <Delete />
                    </IconButton>
                </Box>
            )
        }
    ];

    {/** Renderização de mensagem quando não houver items no grid*/ }
    function CustomNoRowsOverlay() {
        return (
            <Stack height="100%" alignItems="center" justifyContent="center" spacing={1}>
                <Typography>Nenhum item para exibir.</Typography>
            </Stack>
        );
    }

    {/** Retorna nome do status */ }
    function getStatusName(statusId: number): string {
        const status = statusProjects.find(s => s.id === statusId);
        return status ? status.name : 'Desconhecido';
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
            </Stack>

            <DataGrid
                rows={projectList || []}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                }}
                pageSizeOptions={[5, 10, 25, 50]}
                disableRowSelectionOnClick
                disableColumnResize
                onRowDoubleClick={(e) => openDetail(e.row)}
                resizeThrottleMs={1000}
                sx={{
                    '& .MuiDataGrid-row:hover': {
                        backgroundColor: 'action.hover',
                    },
                    cursor: 'pointer',
                }}
                slots={{
                    noRowsOverlay: CustomNoRowsOverlay
                }}
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

            {/* Drawer para mostrar detalhes da linha (disparado pelo botão de visualizar) */}
            <Drawer anchor="right" open={detailOpen} onClose={() => setDetailOpen(false)}>
                <Box sx={{ width: 480, p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6">Detalhes do Projeto</Typography>
                        <IconButton onClick={() => setDetailOpen(false)}><CloseIcon /></IconButton>
                    </Box>

                    {
                        detailProject &&
                        <Stack gap={2} mt={2}>
                            <Stack>
                                <Typography variant="subtitle2">Título</Typography>
                                <Typography>{detailProject.title}</Typography>
                            </Stack>

                            <Stack>
                                <Typography variant="subtitle2">Descrição</Typography>
                                <Typography>{detailProject.description}</Typography>
                            </Stack>

                            <Stack>
                                <Typography variant="subtitle2">Status</Typography>
                                <Typography>{getStatusName(detailProject.status_id!)}</Typography>
                            </Stack>

                            {
                                detailProject.tasks && detailProject.tasks.length > 0 &&
                                <>
                                    <Divider />
                                    <Stack>
                                        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"end"}>
                                            <Typography variant="subtitle1">Tarefas</Typography>
                                            <Typography variant="caption">{detailProject.tasks.length}</Typography>
                                        </Stack>

                                        <Stack>
                                            <List dense={true}>
                                                {
                                                    detailProject.tasks.map((task) => {
                                                        return (
                                                            <ListItemButton key={task.id}>
                                                                <Box key={task.id} sx={{ mt: 1 }}>
                                                                    <Stack>
                                                                        <Stack>
                                                                            <Typography variant="subtitle2">{task.title}</Typography>
                                                                            <Typography variant="body2">{task.description}</Typography>
                                                                        </Stack>
                                                                    </Stack>
                                                                </Box>
                                                            </ListItemButton>
                                                        )
                                                    })
                                                }
                                            </List>
                                        </Stack>
                                    </Stack>
                                </>
                            }

                        </Stack>
                    }
                </Box>
            </Drawer>
        </Stack>
    );
}