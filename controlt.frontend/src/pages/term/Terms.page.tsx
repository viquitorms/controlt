import { Button, Stack, Typography } from "@mui/material";
import UpdateIcon from '@mui/icons-material/Update';
import { useEffect, useState } from "react";
import DataGrid from "../../components/ui/CTDataGrid.component";
import { Add } from "@mui/icons-material";
import CreateTermModal from "./CreateTerm.modal";
import { useSnackbar } from "../../contexts/Snackbar.context";
import { useBackdrop } from "../../contexts/Backdrop.context";
import { termService } from "../../services/term.service";
import type { TermFindByIdResponse, TermListResponse } from "../../dtos/term/Term.res.dto";
import type { TermCreateRequest, TermUpdateRequest } from "../../dtos/term/Term.req.dto";
import UpdateTermModal from "./UpdateTerm.modal";
import { useAuth } from "../../contexts/Auth.context";

export default function Terms() {
    const { showSnackbar } = useSnackbar();
    const { showBackdrop, hideBackdrop } = useBackdrop();
    const { isManager } = useAuth();

    const [isCreateTermModalOpen, setIsCreateTermModalOpen] = useState(false);
    const [isUpdateTermModalOpen, setIsUpdateTermModalOpen] = useState(false);
    const [termList, setTermList] = useState<TermListResponse[]>([]);
    const [selectedTerm, setSelectedTerm] = useState<TermFindByIdResponse | null>(null);

    useEffect(() => {
        onInitialize();
    }, []);

    async function onInitialize() {
        showBackdrop();
        try {
            await getTerms();
        } catch (error) {
            showSnackbar('Erro ao carregar dados', 5000, 'error');
        } finally {
            hideBackdrop();
        }
    }

    async function getTerms() {
        try {
            showBackdrop();
            const list = await termService.list();
            setTermList(list)
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao carregar termos';
            showSnackbar(message, 5000, 'error');
            throw error;
        }
        finally {
            hideBackdrop();
        }
    }

    async function getTermById(id: number) {
        try {
            showBackdrop();
            const term = await termService.findById(id);
            setSelectedTerm(term)
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao carregar termos';
            showSnackbar(message, 5000, 'error');
            throw error;
        }
        finally {
            hideBackdrop();
        }
    }

    async function updateTerm(data: TermUpdateRequest): Promise<boolean> {
        try {
            showBackdrop()
            const term = await termService.update(data);
            await getTerms();
            showSnackbar(`Termo ${term.name} editado com sucesso`, 5000, 'success')
            return true;
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao editar termo';
            showSnackbar(message, 5000, 'error');
            return false;
        } finally {
            hideBackdrop();
        }
    }

    async function createTerm(data: TermCreateRequest): Promise<boolean> {
        try {
            showBackdrop();
            await termService.create(data);
            await getTerms();
            showSnackbar(`Termo ${data.name} criado com sucesso`, 5000, 'success')
            return true;
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao criar termo';
            showSnackbar(message, 5000, 'error');
            return false;
        } finally {
            hideBackdrop();
        }
    }

    async function deleteTerm(id: number, name: string) {
        try {
            showBackdrop();
            await termService.delete(id);
            await getTerms();
            showSnackbar(`O termo ${name} foi deletado`, 5000, 'info');
        }
        catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao deletar termo';
            showSnackbar(message, 5000, 'error');
            throw error;
        }
        finally {
            hideBackdrop();
        }
    }


    const handleCreate = async () => {
        if (isManager) {
            setIsCreateTermModalOpen(true);
        }
        else {
            showSnackbar('Seu termo não tem permissão para criar termos', 5000, 'warning')
        }
    };

    const handleEdit = async (term: TermListResponse) => {
        if (isManager) {
            await getTermById(term.id);
            setIsUpdateTermModalOpen(true);
        }
        else {
            showSnackbar('Seu termo não tem permissão para editar termos', 5000, 'warning')
        }
    };

    const handleDelete = async (term: TermListResponse) => {
        await deleteTerm(term.id, term.name);
    };

    const handleUpdateList = async () => {
        await getTerms();
        showSnackbar('Lista de termos atualizada', 5000, 'success')
    }

    return (
        <Stack spacing={2}>
            <Typography variant={'h5'}>Termos</Typography>

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
                data={termList}
                rowKey={(row) => row.id}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <CreateTermModal
                open={isCreateTermModalOpen}
                onClose={() => setIsCreateTermModalOpen(false)}
                onSave={createTerm}
            />

            <UpdateTermModal
                open={isUpdateTermModalOpen}
                term={selectedTerm}
                onClose={() => setIsUpdateTermModalOpen(false)}
                onSave={updateTerm}
            />
        </Stack>
    );
}