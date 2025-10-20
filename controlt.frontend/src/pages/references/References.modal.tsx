import { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Typography
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import type { ItemListResponse } from "../../dtos/item/Item.res.dto";
import type { ProjectListResponse } from "../../dtos/project/Project.res.dto";
import type { ItemUpdateRequest } from "../../dtos/item/Item.req.dto";

interface IUpdateItem {
    open: boolean;
    item: ItemListResponse | null;
    projects: ProjectListResponse[];
    onClose: () => void;
    onSave: (data: ItemUpdateRequest) => Promise<void>;
}

export default function ReferencesModal({
    open,
    item,
    projects,
    onClose,
    onSave,
}: IUpdateItem) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [assignedUserId, setAssignedUserId] = useState<number | undefined>();
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState(3);
    const [projectId, setProjectId] = useState<number | undefined>();
    const [statusId, setStatusId] = useState<number | undefined>();

    useEffect(() => {
        if (item) {
            setTitle(item.title);
            setDescription(item.description || "");
            setAssignedUserId(item.userAssigned_id || undefined);
            setDueDate(item.due_date ? new Date(item.due_date).toISOString().slice(0, 16) : "");
            setPriority(item.priority || 3);
            setProjectId(item.project_id || undefined);
            setStatusId(item.status_id);
        }
    }, [item]);

    const handleSave = async () => {
        if (!item) return;

        const editData: ItemUpdateRequest = {
            id: item.id,
            title,
            description: description || undefined,
            userAssigned_id: assignedUserId,
            due_date: dueDate || undefined,
            priority: priority,
            project_id: projectId,
            status_id: statusId,
        };

        await onSave(editData);
    };

    const canSave = () => {
        return title.trim().length > 0;
    };

    const getPriorityLabel = (priority: number) => {
        switch (priority) {
            case 1: return "Alta";
            case 2: return "Média-Alta";
            case 3: return "Média";
            case 4: return "Baixa";
            case 5: return "Muito Baixa";
            default: return "Média";
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Edit color="primary" />
                    <Typography variant="h6">
                        Editar Item: {item?.title}
                    </Typography>
                </Stack>
            </DialogTitle>

            <DialogContent dividers>
                <Stack spacing={2} sx={{ pt: 2 }}>
                    <TextField
                        label="Título"
                        fullWidth
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        helperText="Obrigatório"
                    />

                    <TextField
                        label="Descrição"
                        fullWidth
                        multiline
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <FormControl fullWidth>
                        <InputLabel>Projeto</InputLabel>
                        <Select
                            value={projectId || ""}
                            label="Projeto"
                            onChange={(e) => setProjectId(Number(e.target.value) || undefined)}
                        >
                            <MenuItem value="">
                                <em>Nenhum projeto</em>
                            </MenuItem>
                            {projects.map((project) => (
                                <MenuItem key={project.id} value={project.id}>
                                    {project.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={!canSave()}
                    color="primary"
                >
                    Salvar Alterações
                </Button>
            </DialogActions>
        </Dialog>
    );
}