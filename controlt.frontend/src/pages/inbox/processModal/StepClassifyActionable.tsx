import { Box, FormControl, FormControlLabel, Radio, RadioGroup, Stack, Typography } from "@mui/material";
import { Assignment, CalendarToday, Flag, Group, KeyboardDoubleArrowRight } from "@mui/icons-material";
import { ActionableClassificationEnum } from "../../../enums/ClassificationItem.enum";

interface IStepClassifyActionableProps {
    classification: number;
    onChange: (value: number) => void;
}

export default function StepClassifyActionable({ classification, onChange }: IStepClassifyActionableProps) {
    return (
        <Stack spacing={3}>
            <Typography>
                Este item requer ação. Como você quer processá-lo?
            </Typography>

            <FormControl component="fieldset" fullWidth>
                <RadioGroup
                    value={classification}
                    onChange={(e) => onChange(Number(e.target.value))}
                    sx={{ gap: 2 }}
                >
                    <FormControlLabel
                        value={ActionableClassificationEnum.FazerAgora}
                        control={<Radio />}
                        label={
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Flag fontSize="small" color="primary" />
                                <Box>
                                    <Typography variant="body1" fontWeight="bold">
                                        Fazer agora (menos de 2 minutos)
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Execute imediatamente e marque como concluído
                                    </Typography>
                                </Box>
                            </Stack>
                        }
                    />

                    <FormControlLabel
                        value={ActionableClassificationEnum.Delegar}
                        control={<Radio />}
                        label={
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Group fontSize="small" color="primary" />
                                <Box>
                                    <Typography variant="body1" fontWeight="bold">
                                        Delegar
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Atribuir a outra pessoa e aguardar
                                    </Typography>
                                </Box>
                            </Stack>
                        }
                    />

                    <FormControlLabel
                        value={ActionableClassificationEnum.Agendar}
                        control={<Radio />}
                        label={
                            <Stack direction="row" spacing={1} alignItems="center">
                                <CalendarToday fontSize="small" color="primary" />
                                <Box>
                                    <Typography variant="body1" fontWeight="bold">
                                        Agendar
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Definir data/hora específica
                                    </Typography>
                                </Box>
                            </Stack>
                        }
                    />

                    <FormControlLabel
                        value={ActionableClassificationEnum.Projeto}
                        control={<Radio />}
                        label={
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Assignment fontSize="small" color="primary" />
                                <Box>
                                    <Typography variant="body1" fontWeight="bold">
                                        É um projeto (mais de 1 ação)
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Converter em projeto com múltiplas tarefas
                                    </Typography>
                                </Box>
                            </Stack>
                        }
                    />

                    <FormControlLabel
                        value={ActionableClassificationEnum.ProximaAcao}
                        control={<Radio />}
                        label={
                            <Stack direction="row" spacing={1} alignItems="center">
                                <KeyboardDoubleArrowRight fontSize="small" color="primary" />
                                <Box>
                                    <Typography variant="body1" fontWeight="bold">
                                        Próxima ação
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Ação única que farei quando possível
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