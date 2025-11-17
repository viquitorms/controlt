import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';

interface ICTStepper {
    renderFinished?: () => React.ReactNode;
    renderStepContent: () => React.ReactNode;
    steps: string[];
    finishButtonText?: string;
    isNextStepDisabled: boolean;
    onStepChange?: (newStep: number, previousStep: number) => void;
    onFinish?: () => void;
}

export default function CTStepper(
    {
        renderFinished,
        renderStepContent,
        steps,
        finishButtonText = 'Finalizar',
        isNextStepDisabled,
        onStepChange,
        onFinish
    }: ICTStepper
) {
    const [activeStep, setActiveStep] = React.useState(0);
    const [completed, setCompleted] = React.useState<{
        [k: number]: boolean;
    }>({});

    const totalSteps = () => {
        return steps.length;
    };

    const completedSteps = () => {
        return Object.keys(completed).length;
    };

    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };

    const allStepsCompleted = () => {
        return completedSteps() === totalSteps();
    };

    const handleNext = () => {
        const newActiveStep =
            isLastStep() && !allStepsCompleted()
                ? // It's the last step, but not all steps have been completed,
                // find the first step that has been completed
                steps.findIndex((step, i) => !(i in completed)) : activeStep + 1;

        setActiveStep(newActiveStep);

        if (onStepChange) {
            onStepChange(newActiveStep, activeStep);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
        if (onStepChange) {
            onStepChange(activeStep - 1, activeStep);
        }
    };

    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };

    const handleReset = () => {
        setActiveStep(0);
        setCompleted({});
    };

    return (
        <Stack sx={{ width: '100%' }} spacing={3}>
            <Stepper nonLinear activeStep={activeStep}>
                {steps.map((label, index) => (
                    <Step key={label} completed={completed[index]}>
                        <StepButton color="inherit" onClick={handleStep(index)}>
                            {label}
                        </StepButton>
                    </Step>
                ))}
            </Stepper>
            <Stack>
                {allStepsCompleted() ? (
                    <React.Fragment>
                        <Stack>
                            {
                                renderFinished &&
                                renderFinished()
                            }
                        </Stack>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button onClick={handleReset}>Voltar ao Início</Button>
                        </Box>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Stack spacing={3}>
                            <Stack>
                                {
                                    renderStepContent &&
                                    renderStepContent()
                                }
                            </Stack>
                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                <Button
                                    color="inherit"
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    sx={{ mr: 1 }}
                                >
                                    Voltar
                                </Button>
                                <Box sx={{ flex: '1 1 auto' }} />
                                {
                                    !isLastStep() && (
                                        <Button onClick={handleNext} sx={{ mr: 1 }}>
                                            Próximo
                                        </Button>
                                    )
                                }
                                <Button onClick={onFinish} disabled={!isLastStep()}>
                                    {finishButtonText}
                                </Button>
                            </Box>
                        </Stack>
                    </React.Fragment>
                )}
            </Stack>
        </Stack>
    );
}