import { Alert, Chip, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import type { UserListResponse } from "../../../dtos/user/User.res.dto";
import { StatusItemEnum } from "../../../enums/StatusItem.enum";

interface IStepDetailsProps {
    classification: number;
    priority: number;
    dueDate: string;
    assignedUser: UserListResponse | undefined;
    users: UserListResponse[];
    onPriorityChange: (value: number) => void;
    onDueDateChange: (value: string) => void;
    onAssignedUserChange: (user: UserListResponse) => void;
    getStatusName: () => string;
}

export default function StepDetails({
    classification,
    priority,
    dueDate,
    assignedUser,
    users,
    onPriorityChange,
    onDueDateChange,
    onAssignedUserChange,
    getStatusName,
}: IStepDetailsProps) {
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

    const handleUserChange = (userId: number) => {
        const selectedUser = users.find(u => u.id === userId);
        if (selectedUser) {
            onAssignedUserChange(selectedUser);
        }
    };

    return (
        <Stack spacing={3}>
            <Typography variant="h6">Detalhes Adicionais</Typography>

            <FormControl fullWidth>
                <InputLabel>Prioridade</InputLabel>
                <Select
                    value={priority}
                    label="Prioridade"
                    onChange={(e) => onPriorityChange(Number(e.target.value))}
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

            {classification === StatusItemEnum.Agendada && (
                <TextField
                    label="Data/Hora"
                    type="datetime-local"
                    fullWidth
                    required
                    value={dueDate}
                    onChange={(e) => onDueDateChange(e.target.value)}
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
                <Typography variant="body2" fontWeight="bold">
                    Resumo do Processamento:
                </Typography>
                <Typography variant="body2">
                    Status: <strong>{getStatusName()}</strong>
                </Typography>
                <Typography variant="body2">
                    Prioridade: <strong>{getPriorityLabel(priority)}</strong>
                </Typography>
                {classification === StatusItemEnum.Agendada && dueDate && (
                    <Typography variant="body2">
                        Data agendada: <strong>{new Date(dueDate).toLocaleString('pt-BR')}</strong>
                    </Typography>
                )}
                {classification === StatusItemEnum.Aguardando && assignedUser && (
                    <Typography variant="body2">
                        Atribuído para: <strong>{assignedUser.name}</strong>
                        {assignedUser.profile && ` (${assignedUser.profile.name})`}
                    </Typography>
                )}
            </Alert>
        </Stack>
    );
}