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
import type { Task } from "../../dtos/task/task.res.dto";
import type { User } from "../../dtos/user/User.res.dto";
import type { Project } from "../../dtos/project/Project.res.dto";
import { useInitialize } from "../../contexts/Initialized.context";
import dayjs, { Dayjs } from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers";

interface TaskEditModalProps {
    open: boolean;
    task: Task | null;
    users: User[];
    projects: Project[];
    onClose: () => void;
    onSave: (data: Partial<Task>) => Promise<void>;
}

export default function TaskEditModal({
    open,
    task,
    users,
    projects,
    onClose,
    onSave,
}: TaskEditModalProps) {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [assignedUserId, setAssignedUserId] = useState<number | "">("");
    const [dueDate, setDueDate] = useState<Dayjs | null>(null);
    const [priorityId, setPriorityId] = useState<number | "">("");
    const [projectId, setProjectId] = useState<number | "">("");
    const [statusId, setStatusId] = useState<number | "">("");
    const { statusTasks, priorities } = useInitialize();

    useEffect(() => {
        if (task) {
            setTitle(task.title ?? "");
            setDescription(task.description ?? "");
            setAssignedUserId(task.assigned_to_id ?? "");
            setDueDate(task.due_date ? dayjs(task.due_date) : null);
            setPriorityId(task.priority_id ?? "");
            setProjectId(task.project_id ?? "");
            setStatusId(task.status_id ?? "");
        } else {
            setTitle("");
            setDescription("");
            setAssignedUserId("");
            setDueDate(null);
            setPriorityId("");
            setProjectId("");
            setStatusId("");
        }
    }, [task]);

    const handleSave = async () => {
        if (!task) return;

        const editData: Partial<Task> = {
            id: task.id,
            title: title.trim(),
            description: description.trim() || undefined,
            assigned_to_id: assignedUserId === "" ? null : Number(assignedUserId),
            due_date: dueDate ? dueDate.toDate() : null,
            priority_id: priorityId === "" ? null : Number(priorityId),
            project_id: projectId === "" ? null : Number(projectId),
            status_id: Number(statusId),
        };

        await onSave(editData);
    };

    const canSave = () => title.trim().length > 0;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Edit color="primary" />
                    <Typography variant="h6">
                        Editar Tarefa: {task?.title}
                    </Typography>
                </Stack>
            </DialogTitle>

            <DialogContent>

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
                        <InputLabel>Responsável</InputLabel>
                        <Select
                            value={assignedUserId}
                            label="Responsável"
                            onChange={(e) => setAssignedUserId(e.target.value as number | "")}
                        >
                            <MenuItem value="">
                                <em>Nenhum</em>
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

                    <DateTimePicker
                        label="Data de Vencimento"
                        value={dueDate}
                        onChange={(newValue) => setDueDate(newValue)}
                    />

                    <FormControl fullWidth>
                        <InputLabel>Prioridade</InputLabel>
                        <Select
                            value={priorityId}
                            label="Prioridade"
                            onChange={(e) => setPriorityId(e.target.value as number | "")}
                        >
                            {
                                priorities.map((priority) => (
                                    <MenuItem key={priority.id} value={priority.id}>
                                        {priority.name}
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>

                    {
                        task?.status?.name !== "Projeto" &&
                        (
                            <FormControl fullWidth>
                                <InputLabel>Projeto</InputLabel>
                                <Select
                                    value={projectId}
                                    label="Projeto"
                                    onChange={(e) => setProjectId(e.target.value as number | "")}
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
                        )
                    }

                    {
                        task?.status?.name !== "Projeto" &&
                        task?.status?.name !== "Concluído" &&
                        (
                            <FormControl fullWidth required>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={statusId}
                                    label="Status"
                                    onChange={(e) => setStatusId(e.target.value as number | "")}
                                >
                                    {statusTasks.map((status) => (
                                        <MenuItem key={status.id} value={status.id}>
                                            {status.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )
                    }

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