import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stepper,
    Step,
    StepLabel,
    Typography,
    Stack,
    Box,
} from "@mui/material";
import { HelpOutline } from "@mui/icons-material";
import type { Item } from "../../../dtos/item/Item.res.dto";
import type { User } from "../../../dtos/user/User.res.dto";
import StepActionable from "./StepActionable";
import StepClassifyActionable from "./StepClassifyActionable";
import StepClassifyNonActionable from "./StepClassifyNonActionable";
import StepDetails from "./StepDetails";
import { getStatusName, StatusItemEnum } from "../../../enums/StatusItem.enum";
import type { CreateTaskDto } from "../../../dtos/task/task.req.dto";
import type { CreateProjectDto } from "../../../dtos/project/Project.req.dto";
import type { PriorityTask } from "../../../dtos/priorityTask/priorityTask.res.dto";
import type { StatusTask } from "../../../dtos/statusTask/statusTask.res.dto";
import type { StatusProject } from "../../../dtos/statusProject/statusProject.res.dto";
import type { Project } from "../../../dtos/project/Project.res.dto";
import { useAuth } from "../../../contexts/Auth.context";

interface IProcessItemProps {
    open: boolean;
    item: Item | null;
    users: User[];
    priorities: PriorityTask[];
    statusTasks: StatusTask[];
    statusProjects: StatusProject[];
    projects: Project[];
    onClose: () => void;
    onProcess: (data: CreateTaskDto) => Promise<void>;
    onConvertToProject?: (data: CreateProjectDto) => Promise<void>;
}


const steps = ["É Acionável?", "Status do Item", "Detalhes"];

export default function ProcessItem({
    open,
    item,
    users,
    priorities,
    statusTasks,
    statusProjects,
    projects,
    onClose,
    onProcess,
    onConvertToProject,
}: IProcessItemProps) {
    const [activeStep, setActiveStep] = useState(0);
    const [isActionable, setIsActionable] = useState<boolean | null>(null);
    const [statusId, setStatusId] = useState<number>(0);
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
    const [assignedUser, setAssignedUser] = useState<User | undefined>();
    const [priority, setPriority] = useState<number>(2);
    const [project, setProject] = useState<Project | undefined>(undefined);
    const { user } = useAuth();

    const handleNext = () => {
        if (activeStep === 0 && isActionable === false) {
            setActiveStep(2);
        } else {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (activeStep === 2 && isActionable === false) {
            setActiveStep(0);
        } else {
            setActiveStep((prev) => prev - 1);
        }
    };

    const handleReset = () => {
        setActiveStep(0);
        setIsActionable(null);
        setStatusId(0);
        setDueDate(undefined);
        setAssignedUser(undefined);
        setPriority(3);
        setProject(undefined);
    };

    const handleGetStatus = (): string => {
        return getStatusName(statusId);
    };

    const handleSubmit = async () => {
        if (!item) return;

        if (statusId === StatusItemEnum.Projeto) {
            await onConvertToProject?.({
                title: item.title,
                description: item.note || undefined,
                status_id: 1,
            });
        } else {
            const processedData: CreateTaskDto = {
                item_id: item.id,
                title: item.title,
                description: item.note || "",
                due_date: dueDate,
                priority_id: priority,
                project_id: project ? project.id : undefined,
                status_id: statusId,
                created_by_id: item.created_by_id,
                assigned_to_id: assignedUser ? assignedUser.id : user?.id,
            };

            await onProcess(processedData);
        }

        handleReset();
    };

    const canProceed = () => {
        if (activeStep === 0) return isActionable !== null;
        if (activeStep === 1) return statusId !== 0;
        if (activeStep === 2) {
            if (statusId === StatusItemEnum.Aguardando && !assignedUser) return false;
            if (statusId === StatusItemEnum.Agendada && !dueDate) return false;
            return true;
        }
        return true;
    };

    const handleClassificationChange = (value: number) => {
        setStatusId(value);
        if (value !== StatusItemEnum.Aguardando) setAssignedUser(undefined);
        if (value !== StatusItemEnum.Agendada) setDueDate(undefined);
    };

    const renderStep = () => {
        if (activeStep === 0) {
            return (
                <StepActionable
                    isActionable={isActionable}
                    onChange={setIsActionable}
                />
            );
        }

        if (activeStep === 1 && isActionable) {
            return (
                <StepClassifyActionable
                    classification={statusId}
                    onChange={handleClassificationChange}
                />
            );
        }

        if (activeStep === 2 && !isActionable) {
            return (
                <StepClassifyNonActionable
                    classification={statusId}
                    onChange={setStatusId}
                />
            );
        }

        if (activeStep === 2 && isActionable) {
            return (
                <StepDetails
                    classification={statusId}
                    priority={priority}
                    dueDate={dueDate}
                    assignedUser={assignedUser}
                    onPriorityChange={setPriority}
                    onDueDateChange={setDueDate}
                    onAssignedUserChange={setAssignedUser}
                    getStatusName={handleGetStatus}
                    users={users}
                    priorities={priorities}
                    statusTasks={statusTasks}
                    statusProjects={statusProjects}
                    project={project}
                    projects={projects}
                    onProjectChange={setProject}
                />
            );
        }

        return null;
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <HelpOutline color="primary" />
                    <Typography variant="h6">
                        Processar Item: {item?.title}
                    </Typography>
                </Stack>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {renderStep()}
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                {activeStep > 0 && <Button onClick={handleBack}>Voltar</Button>}
                {activeStep < 2 ? (
                    <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={!canProceed()}
                    >
                        Próximo
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!canProceed()}
                        color="success"
                    >
                        Concluir Processamento
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}