import { useEffect, useState } from "react";
import { Box, Card, CardContent, Chip, Grid, LinearProgress, Stack, Typography } from "@mui/material";
import { CheckCircle, EventAvailable, TrendingUp } from "@mui/icons-material";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import CTDataGrid from "../../components/ui/organisms/data grid/CTDataGrid.component";
import { metricService } from "../../services/metric.service";
import type { ConclusionRateData, ConclusionRateResponse } from "../../dtos/metric/metric.res.dto";
import { useBackdrop } from "../../contexts/Backdrop.context";
import { useSnackbar } from "../../contexts/Snackbar.context";

export default function ConclusionRatePage() {
    const { showBackdrop, hideBackdrop } = useBackdrop();
    const { showSnackbar } = useSnackbar();

    const [metrics, setMetrics] = useState<ConclusionRateResponse | null>(null);

    useEffect(() => {
        loadMetrics();
    }, []);

    async function loadMetrics() {
        try {
            showBackdrop();
            const data = await metricService.getConclusionRate();
            setMetrics(data);
        } catch (error: any) {
            const message = error?.response?.data?.error || "Erro ao carregar métricas";
            showSnackbar(message, 5000, "error");
        } finally {
            hideBackdrop();
        }
    }

    // Definição das colunas da tabela
    const columns: GridColDef<ConclusionRateData>[] = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "title", headerName: "Tarefa Planeada", flex: 1 },
        { field: "project", headerName: "Projeto", flex: 1 },
        {
            field: "due_date",
            headerName: "Data Planeada",
            width: 140,
            renderCell: (params: GridRenderCellParams<ConclusionRateData>) => (
                <span>{new Date(params.row.due_date).toLocaleDateString()}</span>
            ),
        },
        {
            field: "status",
            headerName: "Status Final",
            width: 150,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams<ConclusionRateData>) => (
                <Chip
                    label={params.row.status}
                    color={params.row.is_completed ? "success" : "default"}
                    variant={params.row.is_completed ? "filled" : "outlined"}
                    size="small"
                />
            ),
        },
    ];

    return (
        <Stack spacing={3}>
            {/* Cards de Resumo */}
            {metrics && (
                <>
                    <Grid container spacing={2}>
                        {/* Card Principal: Taxa % */}
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Stack spacing={1}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <TrendingUp />
                                            <Typography variant="overline">Taxa de Conclusão</Typography>
                                        </Stack>

                                        <Typography variant="h4" fontWeight="bold">
                                            {metrics.summary.rate}%
                                        </Typography>

                                        <Box sx={{ width: '100%', mt: 1 }}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={metrics.summary.rate}
                                                sx={{
                                                    height: 8,
                                                    borderRadius: 4,
                                                    bgcolor: 'rgba(255,255,255,0.3)',
                                                    '& .MuiLinearProgress-bar': {
                                                        bgcolor: 'white'
                                                    }
                                                }}
                                            />
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Card: Realizado vs Planeado */}
                        <Grid size={{ xs: 12, md: 8 }}>
                            <Card sx={{ height: '100%' }} variant="outlined">
                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                <EventAvailable fontSize="large" />
                                                <Box>
                                                    <Typography variant="overline" color="text.secondary">Total Planeado</Typography>
                                                    <Typography variant="h4" fontWeight="bold">
                                                        {metrics.summary.total_planned}
                                                    </Typography>
                                                    <Typography variant="caption">Tarefas com data</Typography>
                                                </Box>
                                            </Stack>
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                <CheckCircle fontSize="large" color="success" />
                                                <Box>
                                                    <Typography variant="overline" color="text.secondary">Total Concluído</Typography>
                                                    <Typography variant="h4" fontWeight="bold" color="success.main">
                                                        {metrics.summary.total_completed}
                                                    </Typography>
                                                    <Typography variant="caption">Entregues no prazo</Typography>
                                                </Box>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Tabela Detalhada */}
                    <Box sx={{ height: 500 }}>
                        <Typography variant="subtitle1" mb={2}>
                            Detalhamento do Plano
                        </Typography>
                        <CTDataGrid
                            rows={metrics.data}
                            columns={columns}
                            refresh={loadMetrics}
                            cursor="default"
                        />
                    </Box>
                </>
            )}
        </Stack>
    );
}