import { Button, Stack, Typography } from "@mui/material";
import UpdateIcon from '@mui/icons-material/Update';
import { useEffect, useState } from "react";
import DataGrid from "../../components/DataGrid.component";
import { Add } from "@mui/icons-material";
import CreateTeamModal from "./CreateTeam.modal";
import { useSnackbar } from "../../contexts/Snackbar.context";
import { useBackdrop } from "../../contexts/Backdrop.context";
import { teamService } from "../../services/team.service";
import type { TeamFindByIdResponse, TeamListResponse } from "../../dtos/team/Team.res.dto";
import type { TeamCreateRequest, TeamUpdateRequest } from "../../dtos/team/Team.req.dto";
import UpdateTeamModal from "./UpdateTeam.modal";
import { useAuth } from "../../contexts/Auth.context";

export default function Teams() {
    const { showSnackbar } = useSnackbar();
    const { showBackdrop, hideBackdrop } = useBackdrop();
    const { isManager } = useAuth();

    const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
    const [isUpdateTeamModalOpen, setIsUpdateTeamModalOpen] = useState(false);
    const [teamList, setTeamList] = useState<TeamListResponse[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<TeamFindByIdResponse | null>(null);

    useEffect(() => {
        onInitialize();
    }, []);

    async function onInitialize() {
        showBackdrop();
        try {
            await getTeams();
        } catch (error) {
            showSnackbar('Erro ao carregar dados', 5000, 'error');
        } finally {
            hideBackdrop();
        }
    }

    async function getTeams() {
        try {
            showBackdrop();
            const list = await teamService.list();
            setTeamList(list)
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao carregar equipes';
            showSnackbar(message, 5000, 'error');
            throw error;
        }
        finally {
            hideBackdrop();
        }
    }

    async function getTeamById(id: number) {
        try {
            showBackdrop();
            const team = await teamService.findById(id);
            setSelectedTeam(team)
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao carregar equipes';
            showSnackbar(message, 5000, 'error');
            throw error;
        }
        finally {
            hideBackdrop();
        }
    }

    async function UpdateTeam(data: TeamUpdateRequest): Promise<boolean> {
        try {
            showBackdrop()
            const team = await teamService.update(data);
            await getTeams();
            showSnackbar(`Equipe ${team.name} editado com sucesso`, 5000, 'success')
            return true;
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao editar projeto';
            showSnackbar(message, 5000, 'error');
            return false;
        } finally {
            hideBackdrop();
        }
    }

    async function CreateTeam(data: TeamCreateRequest): Promise<boolean> {
        try {
            showBackdrop();
            await teamService.create(data);
            await getTeams();
            showSnackbar(`Equipe ${data.name} criado com sucesso`, 5000, 'success')
            return true;
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao criar projeto';
            showSnackbar(message, 5000, 'error');
            return false;
        } finally {
            hideBackdrop();
        }
    }

    async function deleteTeam(id: number, name: string) {
        try {
            showBackdrop();
            await teamService.delete(id);
            await getTeams();
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
            setIsCreateTeamModalOpen(true);
        }
        else {
            showSnackbar('Seu projeto não tem permissão para criar equipes', 5000, 'warning')
        }
    };

    const handleEdit = async (team: TeamListResponse) => {
        if (isManager) {
            await getTeamById(team.id);
            setIsUpdateTeamModalOpen(true);
        }
        else {
            showSnackbar('Seu projeto não tem permissão para editar equipes', 5000, 'warning')
        }
    };

    const handleDelete = async (team: TeamListResponse) => {
        await deleteTeam(team.id, team.name);
    };

    const handleUpdateList = async () => {
        await getTeams();
        showSnackbar('Lista de equipes atualizada', 5000, 'success')
    }

    return (
        <Stack spacing={2}>
            <Typography variant={'h5'}>Equipes</Typography>

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
                data={teamList}
                rowKey={(row) => row.id}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <CreateTeamModal
                open={isCreateTeamModalOpen}
                onClose={() => setIsCreateTeamModalOpen(false)}
                onSave={CreateTeam}
            />

            <UpdateTeamModal
                open={isUpdateTeamModalOpen}
                team={selectedTeam}
                onClose={() => setIsUpdateTeamModalOpen(false)}
                onSave={UpdateTeam}
            />
        </Stack>
    );
}