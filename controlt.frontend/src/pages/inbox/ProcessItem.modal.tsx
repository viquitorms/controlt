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
import type { ItemListResponse } from "../../dtos/item/Item.res.dto";
import type { UserListResponse } from "../../dtos/user/User.res.dto";
import StepActionable from "./steps/StepActionable";
import StepClassifyActionable from "./steps/StepClassifyActionable";
import StepClassifyNonActionable from "./steps/StepClassifyNonActionable";
import StepDetails from "./steps/StepDetails";
import { getStatusName, StatusItemEnum } from "../../enums/StatusItem.enum";

interface IProcessItemProps {
    open: boolean;
    item: ItemListResponse | null;
    users: UserListResponse[];
    onClose: () => void;
    onProcess: (data: IProcessedItem) => Promise<void>;
    onConvertToProject?: (data: IConvertToProject) => Promise<void>;
}

export interface IProcessedItem {
    is_actionable: boolean;
    status_id: number;
    due_date?: string;
    userAssigned_id?: number;
    project_id?: number;
    priority?: number;
}

export interface IConvertToProject {
    title: string;
    description?: string | null;
    status: string;
}

const steps = ["É Acionável?", "Status do Item", "Detalhes"];

export default function ProcessItem({
    open,
    item,
    users,
    onClose,
    onProcess,
    onConvertToProject,
}: IProcessItemProps) {
    const [activeStep, setActiveStep] = useState(0);
    const [isActionable, setIsActionable] = useState<boolean | null>(null);
    const [statusId, setStatusId] = useState<number>(0);
    const [dueDate, setDueDate] = useState<string>("");
    const [assignedUser, setAssignedUser] = useState<UserListResponse | undefined>();
    const [priority, setPriority] = useState<number>(3);

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
        setDueDate("");
        setAssignedUser(undefined);
        setPriority(3);
    };

    const handleGetStatus = (): string => {
        return getStatusName(statusId);
    };

    const handleSubmit = async () => {
        if (!item) return;

        if (statusId === StatusItemEnum.Projeto) {
            await onConvertToProject?.({
                title: item.title,
                description: item.description,
                status: "active",
            });
        } else {
            const processedData: IProcessedItem = {
                is_actionable: isActionable || false,
                status_id: statusId,
                due_date: dueDate || undefined,
                userAssigned_id: assignedUser?.id,
                priority: priority,
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
        if (value !== StatusItemEnum.Agendada) setDueDate("");
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