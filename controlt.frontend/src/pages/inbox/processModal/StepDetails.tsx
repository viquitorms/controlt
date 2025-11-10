import { Alert, Chip, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import type { User } from "../../../dtos/user/User.res.dto";
import { StatusItemEnum } from "../../../enums/StatusItem.enum";
import type { PriorityTask } from "../../../dtos/priorityTask/priorityTask.res.dto";
import type { StatusTask } from "../../../dtos/statusTask/statusTask.res.dto";
import type { StatusProject } from "../../../dtos/statusProject/statusProject.res.dto";
import type { Project } from "../../../dtos/project/Project.res.dto";

interface IStepDetailsProps {
    classification: number;
    priority: number;
    project: Project | undefined;
    dueDate: Date | undefined;
    assignedUser: User | undefined;
    users: User[];
    priorities: PriorityTask[];
    statusTasks: StatusTask[];
    statusProjects: StatusProject[];
    projects: Project[] | undefined;
    onPriorityChange: (value: number) => void;
    onDueDateChange: (value: Date | undefined) => void;
    onProjectChange: (project: Project | undefined) => void;
    onAssignedUserChange: (user: User) => void;
    getStatusName: () => string;
}

export default function StepDetails({
    classification,
    priority,
    project,
    dueDate,
    assignedUser,
    users,
    priorities,
    projects,
    onPriorityChange,
    onDueDateChange,
    onProjectChange,
    onAssignedUserChange,
    getStatusName,
}: IStepDetailsProps) {

    const handleUserChange = (userId: number) => {
        const selectedUser = users.find(u => u.id === userId);
        if (selectedUser) {
            onAssignedUserChange(selectedUser);
        }
    };

    function handleOnPriorityChange(number: number) {
        onPriorityChange(number);
    }

    return (
        <Stack spacing={2}>
            <Typography variant="h6">Detalhes Adicionais</Typography>

            <FormControl fullWidth>
                <InputLabel>Prioridade</InputLabel>
                <Select
                    value={priority}
                    label="Prioridade"
                    onChange={(e) => handleOnPriorityChange(e.target.value as number)}
                >
                    {
                        priorities.map((p) => (
                            <MenuItem key={p.id} value={p.level}>
                                {p.name}
                            </MenuItem>
                        ))
                    }
                </Select>
            </FormControl>

            {
                classification !== StatusItemEnum.Projeto &&
                (
                    <FormControl fullWidth>
                        <InputLabel>Projeto</InputLabel>
                        <Select
                            value={project}
                            label="Projeto"
                            onChange={(e) => {
                                const selectedProject = projects?.find(p => p.id === Number(e.target.value));
                                onProjectChange(selectedProject);
                            }}
                        >
                            <MenuItem value={undefined}>Nenhum</MenuItem>
                            {projects?.map((p) => (
                                <MenuItem key={p.id} value={p.id}>
                                    {p.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )
            }

            {
                classification === StatusItemEnum.Agendada && (
                    <TextField
                        label="Data/Hora"
                        type="datetime-local"
                        fullWidth
                        required
                        value={dueDate}
                        onChange={(e) => onDueDateChange(new Date(e.target.value))}
                        helperText="Defina quando esta tarefa deve ser realizada"
                    />
                )}

            {classification === StatusItemEnum.Aguardando && (
                <FormControl fullWidth required>
                    <InputLabel>Delegar para</InputLabel>
                    <Select
                        value={assignedUser?.id || ""}
                        label="Delegar para"
                        onChange={(e) => handleUserChange(Number(e.target.value))}
                    >
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
            )}

            <Alert severity="success">
                <Typography variant="subtitle1" fontWeight="bold">
                    Resumo do Processamento:
                </Typography>
                <Typography variant="body2">
                    Status: <strong>{getStatusName()}</strong>
                </Typography>
                <Typography variant="body2">
                    Prioridade: <strong>{priorities.find(p => p.level === priority)?.name}</strong>
                </Typography>
                {
                    classification !== StatusItemEnum.Projeto && project && (
                        <Typography variant="body2">
                            Projeto: <strong>{project.title}</strong>
                        </Typography>
                    )
                }
                {
                    classification === StatusItemEnum.Agendada && dueDate && (
                        <Typography variant="body2">
                            Data agendada: <strong>{new Date(dueDate).toLocaleString('pt-BR')}</strong>
                        </Typography>
                    )
                }
                {
                    classification === StatusItemEnum.Aguardando && assignedUser && (
                        <Typography variant="body2">
                            Atribuído para: <strong>{assignedUser.name}</strong>
                            {assignedUser.profile && ` (${assignedUser.profile.name})`}
                        </Typography>
                    )
                }
            </Alert>
        </Stack >
    );
}