import { useEffect, useState } from "react";
import { Box, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import { AccessTime, AssignmentTurnedIn, Speed } from "@mui/icons-material";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import CTDataGrid from "../../components/ui/organisms/data grid/CTDataGrid.component";
import { metricService } from "../../services/metric.service";
import type { LeadTimeMetricResponse, MetricData } from "../../dtos/metric/metric.res.dto";
import { useBackdrop } from "../../contexts/Backdrop.context";
import { useSnackbar } from "../../contexts/Snackbar.context";

export default function LeadTimePage() {
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
            width: 160,
            renderCell: (params: GridRenderCellParams<MetricData>) => (
                <span>{params?.row?.capture_date ? new Date(params.row.capture_date).toLocaleString() : "-"}</span>
            ),
        },
        {
            field: "completion_date",
            headerName: "Conclusão",
            width: 160,
            renderCell: (params: GridRenderCellParams<MetricData>) => (
                <span>{params?.row?.capture_date ? new Date(params.row.completion_date).toLocaleString() : "-"}</span>
            ),
        },
        {
            field: "lead_time_days",
            headerName: "Lead Time",
            width: 220,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams<MetricData>) => {
                const isAboveAverage = metrics?.summary?.average_days
                    ? params.row.lead_time_days > metrics.summary.average_days
                    : false;

                return (
                    <Stack direction="column" justifyContent="center" alignItems="center" sx={{ height: '100%', lineHeight: 1 }}>
                        <Typography
                            variant="body2"
                            fontWeight="bold"
                            color={isAboveAverage ? "error.main" : "success.main"}
                        >
                            {params.row.lead_time_days} dias
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {params.row.lead_time_formatted}
                        </Typography>
                    </Stack>
                );
            },
        },
    ];

    return (
        <Stack spacing={3}>
            {metrics && (
                <Grid container spacing={2}>
                    {/* Card 1: Média em Dias */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Speed fontSize="large" />
                                    <Box>
                                        <Typography variant="overline" color="text.secondary">Lead Time Médio (Dias)</Typography>
                                        <Typography variant="h4" fontWeight="bold">
                                            {metrics.summary.average_days} <Typography component="span" variant="caption" color="text.secondary">dias</Typography>
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Card 2: NOVO - Média em Horas */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <AccessTime fontSize="large" />
                                    <Box>
                                        <Typography variant="overline" color="text.secondary">Lead Time Médio (Horas)</Typography>
                                        <Typography variant="h4" fontWeight="bold">
                                            {metrics.summary.average_formatted}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Card 3: Total de Tarefas */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <AssignmentTurnedIn fontSize="large" color="success" />
                                    <Box>
                                        <Typography variant="overline" color="text.secondary">Tarefas Analisadas</Typography>
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
                    // Desabilitar seleção se for apenas relatório
                    checkboxSelection={false}
                />
            </Box>
        </Stack>
    );
}