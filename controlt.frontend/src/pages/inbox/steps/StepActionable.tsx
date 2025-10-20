import { Alert, Box, FormControl, FormControlLabel, Radio, RadioGroup, Stack, Typography } from "@mui/material";
import { HelpOutline } from "@mui/icons-material";

interface IStepActionableProps {
    isActionable: boolean | null;
    onChange: (value: boolean) => void;
}

export default function StepActionable({ isActionable, onChange }: IStepActionableProps) {
    return (
        <Stack spacing={3}>
            <Typography>Esta tarefa requer alguma ação da sua parte?</Typography>

            <FormControl component="fieldset">
                <RadioGroup
                    value={isActionable?.toString() || ""}
                    onChange={(e) => onChange(e.target.value === "true")}
                    sx={{ gap: 2 }}
                >
                    <FormControlLabel
                        value="true"
                        control={<Radio />}
                        label={
                            <Box>
                                <Typography variant="body1" fontWeight="bold">
                                    Sim, é acionável
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Preciso fazer algo relacionado a este item
                                </Typography>
                            </Box>
                        }
                    />
                    <FormControlLabel
                        value="false"
                        control={<Radio />}
                        label={
                            <Box>
                                <Typography variant="body1" fontWeight="bold">
                                    Não é acionável
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    É apenas informação, referência ou pode ser descartado
                                </Typography>
                            </Box>
                        }
                    />
                </RadioGroup>
            </FormControl>
        </Stack>
    );
}