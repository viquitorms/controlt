import { useEffect, useState } from "react";
import { Box, Card, CardContent, Grid, Stack, Typography, useTheme } from "@mui/material";
import { AssignmentTurnedIn, Speed } from "@mui/icons-material";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import CTDataGrid from "../../components/ui/organisms/data grid/CTDataGrid.component";
import { metricService } from "../../services/metric.service";
import type { LeadTimeMetricResponse, MetricData } from "../../dtos/metric/metric.res.dto";
import { useBackdrop } from "../../contexts/Backdrop.context";
import { useSnackbar } from "../../contexts/Snackbar.context";

export default function LeadTimePage() {
    const theme = useTheme();
    const { showBackdrop, hideBackdrop } = useBackdrop();
    const { showSnackbar } = useSnackbar();

    const [metrics, setMetrics] = useState<LeadTimeMetricResponse | null>(null);

    useEffect(() => {
        loadMetrics();
    }, []);

    async function loadMetrics() {
        try {
            showBackdrop();
            const data = await metricService.getLeadTime();
            setMetrics(data);
        } catch (error: any) {
            const message = error?.response?.data?.error || "Erro ao carregar métricas";
            showSnackbar(message, 5000, "error");
        } finally {
            hideBackdrop();
        }
    }

    // Definição das colunas da tabela
    const columns: GridColDef<MetricData>[] = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "title", headerName: "Tarefa", flex: 1 },
        { field: "project", headerName: "Projeto", flex: 1 },
        {
            field: "capture_date",
            headerName: "Captura",
            width: 160, // Aumentei a largura para caber a hora
            renderCell: (params: GridRenderCellParams<MetricData>) => (
                <span>
                    {new Date(params.row.capture_date).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </span>
            ),
        },
        {
            field: "completion_date",
            headerName: "Conclusão",
            width: 160, // Aumentei a largura para caber a hora
            renderCell: (params: GridRenderCellParams<MetricData>) => (
                <span>
                    {new Date(params.row.completion_date).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </span>
            ),
        },
        {
            field: "lead_time_days",
            headerName: "Lead Time",
            width: 180,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams<MetricData>) => {
                // Cálculo dinâmico de horas para exibição
                const start = new Date(params.row.capture_date).getTime();
                const end = new Date(params.row.completion_date).getTime();
                const diffMs = Math.abs(end - start);
                const hours = (diffMs / (1000 * 60 * 60)).toFixed(1);

                return (
                    <Box
                        sx={{
                            fontWeight: "bold",
                            color: params.row.lead_time_days > (metrics?.summary.average || 0)
                                ? theme.palette.warning.main
                                : theme.palette.success.main
                        }}
                    >
                        {/* Exibe Dias e Horas */}
                        {params.row.lead_time_days} dias ({hours}h)
                    </Box>
                );
            },
        },
    ];

    return (
        <Stack spacing={3}>
            {/* Cards de Resumo */}
            {metrics && (
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card variant="outlined">
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Speed fontSize="large" />
                                    <Box>
                                        <Typography variant="overline">Lead Time Médio</Typography>
                                        <Typography variant="h4" fontWeight="bold">
                                            {metrics.summary.average} {metrics.unit}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card variant="outlined">
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <AssignmentTurnedIn fontSize="large" />
                                    <Box>
                                        <Typography variant="overline">Tarefas Analisadas</Typography>
                                        <Typography variant="h4" fontWeight="bold">
                                            {metrics.summary.total_tasks}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Tabela Detalhada */}
            <Box sx={{ height: 500 }}>
                <Typography variant="subtitle1" mb={2}>
                    Detalhamento por Tarefa
                </Typography>
                <CTDataGrid
                    rows={metrics?.data || []}
                    columns={columns}
                    refresh={loadMetrics}
                    cursor="default"
                />
            </Box>
        </Stack>
    );
}