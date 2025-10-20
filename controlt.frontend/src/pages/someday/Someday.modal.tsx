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
    Typography,
    Chip,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import type { ItemListResponse } from "../../dtos/item/Item.res.dto";
import type { UserListResponse } from "../../dtos/user/User.res.dto";
import type { ProjectListResponse } from "../../dtos/project/Project.res.dto";
import type { StatusItemResponse } from "../../dtos/statusItem/StatusItem.res.dto";
import type { ItemUpdateRequest } from "../../dtos/item/Item.req.dto";

interface IUpdateItem {
    open: boolean;
    item: ItemListResponse | null;
    users: UserListResponse[];
    projects: ProjectListResponse[];
    statuses: StatusItemResponse[];
    onClose: () => void;
    onSave: (data: ItemUpdateRequest) => Promise<void>;
}

export default function ScheduledModal({
    open,
    item,
    users,
    projects,
    statuses,
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

                    <FormControl fullWidth required>
                        <InputLabel>Responsável</InputLabel>
                        <Select
                            value={assignedUserId || ""}
                            label="Responsável"
                            onChange={(e) => setAssignedUserId(Number(e.target.value) || undefined)}
                        >
                            <MenuItem value="">
                                <em>Nenhum (não delegado)</em>
                            </MenuItem>
                            {users.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography>{user.name}</Typography>
                                        <Chip
                                            label={user.profile?.name || "Sem perfil"}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </Stack>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        type="datetime-local"
                        fullWidth
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        helperText="Opcional - quando espera que seja concluído"
                    />

                    <FormControl fullWidth>
                        <InputLabel>Prioridade</InputLabel>
                        <Select
                            value={priority}
                            label="Prioridade"
                            onChange={(e) => setPriority(Number(e.target.value))}
                        >
                            <MenuItem value={1}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Chip label="Alta" color="error" size="small" />
                                    <Typography>Urgente e Importante</Typography>
                                </Stack>
                            </MenuItem>
                            <MenuItem value={2}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Chip label="Média-Alta" color="warning" size="small" />
                                    <Typography>Importante</Typography>
                                </Stack>
                            </MenuItem>
                            <MenuItem value={3}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Chip label="Média" color="info" size="small" />
                                    <Typography>Normal</Typography>
                                </Stack>
                            </MenuItem>
                            <MenuItem value={4}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Chip label="Baixa" color="default" size="small" />
                                    <Typography>Pode esperar</Typography>
                                </Stack>
                            </MenuItem>
                            <MenuItem value={5}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Chip label="Muito Baixa" size="small" />
                                    <Typography>Quando sobrar tempo</Typography>
                                </Stack>
                            </MenuItem>
                        </Select>
                    </FormControl>

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

                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={statusId || ""}
                            label="Status"
                            onChange={(e) => setStatusId(Number(e.target.value))}
                        >
                            {statuses.map((status) => (
                                <MenuItem key={status.id} value={status.id}>
                                    {status.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* <Alert severity="info">
                        <Typography variant="body2" fontWeight="bold">
                            Resumo das Alterações:
                        </Typography>
                        <Typography variant="body2">
                            Status: <strong>{statusId ? getStatusName(statusId) : "Não definido"}</strong>
                        </Typography>
                        <Typography variant="body2">
                            Prioridade: <strong>{getPriorityLabel(priority)}</strong>
                        </Typography>
                        {assignedUserId && (
                            <Typography variant="body2">
                                Responsável: <strong>{users.find(u => u.id === assignedUserId)?.name}</strong>
                            </Typography>
                        )}
                        {dueDate && (
                            <Typography variant="body2">
                                Prazo: <strong>{new Date(dueDate).toLocaleString('pt-BR')}</strong>
                            </Typography>
                        )}
                    </Alert> */}
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