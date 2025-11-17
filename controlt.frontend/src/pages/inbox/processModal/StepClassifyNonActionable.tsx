import { Box, FormControl, FormControlLabel, Radio, RadioGroup, Stack, Typography } from "@mui/material";
import { Archive, Delete, WatchLater } from "@mui/icons-material";   

interface IStepClassifyNonActionableProps {
    classification: number;
    onChange: (value: number) => void;
}

export default function StepClassifyNonActionable({ classification, onChange }: IStepClassifyNonActionableProps) {
    return (
        <Stack spacing={3}>
            <Typography>
                Este item não requer ação. O que fazer com ele?
            </Typography>

            <FormControl component="fieldset" fullWidth>
                <RadioGroup
                    value={classification}
                    onChange={(e) => onChange(Number(e.target.value))}
                    sx={{ gap: 2 }}
                >
                    <FormControlLabel
                        value={NonActionableClassificationEnum.Lixo}
                        control={<Radio />}
                        label={
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Delete fontSize="small" color="error" />
                                <Box>
                                    <Typography variant="body1" fontWeight="bold">
                                        Descartar
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Não é útil, pode ser deletado
                                    </Typography>
                                </Box>
                            </Stack>
                        }
                    />

                    <FormControlLabel
                        value={NonActionableClassificationEnum.Referencia}
                        control={<Radio />}
                        label={
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Archive fontSize="small" color="primary" />
                                <Box>
                                    <Typography variant="body1" fontWeight="bold">
                                        Material de referência
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Informação útil para consulta futura
                                    </Typography>
                                </Box>
                            </Stack>
                        }
                    />

                    <FormControlLabel
                        value={NonActionableClassificationEnum.AlgumDia}
                        control={<Radio />}
                        label={
                            <Stack direction="row" spacing={1} alignItems="center">
                                <WatchLater fontSize="small" color="primary" />
                                <Box>
                                    <Typography variant="body1" fontWeight="bold">
                                        Algum dia / Talvez
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Algo que eu possa querer fazer no futuro
                                    </Typography>
                                </Box>
                            </Stack>
                        }
                    />
                </RadioGroup>
            </FormControl>
        </Stack>
    );
}