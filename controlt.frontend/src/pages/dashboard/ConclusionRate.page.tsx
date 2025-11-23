import { useEffect, useState } from "react";
import { Box, Card, CardContent, Chip, Divider, Drawer, Grid, IconButton, LinearProgress, List, ListItemButton, Stack, Typography } from "@mui/material";
import { CheckCircle, Close, EventAvailable, TrendingUp } from "@mui/icons-material";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import CTDataGrid from "../../components/ui/organisms/data grid/CTDataGrid.component";
import { metricService } from "../../services/metric.service";
import type { ConclusionRateData, ConclusionRateResponse } from "../../dtos/metric/metric.res.dto";
import { useBackdrop } from "../../contexts/Backdrop.context";
import { useSnackbar } from "../../contexts/Snackbar.context";
import dayjs from "dayjs";

export default function ConclusionRatePage() {
    const { showBackdrop, hideBackdrop } = useBackdrop();
    const { showSnackbar } = useSnackbar();
    const [detailOpen, setDetailOpen] = useState<boolean>(false);
    const [detailMetric, setDetailMetric] = useState<ConclusionRateData | null>(null);
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
        {
            field: "title",
            headerName: "Tarefa",
            flex: 1
        },
        {
            field: "project",
            headerName: "Projeto",
            flex: 1,
            renderCell: (params: GridRenderCellParams<ConclusionRateData>) => (
                <span>{params?.row?.project ? params.row.project.title : "-"}</span>
            ),
        },
        {
            field: "created_date",
            headerName: "Data de Criação",
            type: "string",
            flex: 1,
            renderCell: (params: GridRenderCellParams<ConclusionRateData>) => (
                <span>{params?.row?.created_date ? new Date(params.row.created_date).toLocaleString() : "-"}</span>
            ),
        },
        {
            field: "due_date",
            headerName: "Data Planejada",
            type: "string",
            flex: 1,
            renderCell: (params: GridRenderCellParams<ConclusionRateData>) => (
                <span>{params?.row?.due_date ? new Date(params.row.due_date).toLocaleString() : "-"}</span>
            ),
        },
        {
            field: "completed_at",
            headerName: "Data de Conclusão",
            type: "string",
            flex: 1,
            renderCell: (params: GridRenderCellParams<ConclusionRateData>) => (
                <span>{params?.row?.completed_at ? new Date(params.row.completed_at).toLocaleString() : "-"}</span>
            ),
        },
        {
            field: "assigned_to",
            headerName: "Responsável",
            flex: 1,
            renderCell: (params: GridRenderCellParams<ConclusionRateData>) => (
                <span>{params?.row?.assigned_to ? params.row.assigned_to.name : "-"}</span>
            ),
        },
        {
            field: "status",
            headerName: "Status",
            width: 150,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams<ConclusionRateData>) => (
                <Chip
                    label={params.row.status.name}
                    color={params.row.status.name === "Concluída" ? "success" : "default"}
                    variant={params.row.status.name === "Concluída" ? "filled" : "outlined"}
                    size="small"
                />
            ),
        },
        {
            field: "due",
            headerName: "Entregue no Prazo",
            width: 150,
            align: "center",
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams<ConclusionRateData>) => {
                if (params.row.completed_at && params.row.due_date) {
                    const completedAt = new Date(params.row.completed_at);
                    const dueDate = new Date(params.row.due_date);

                    const onTime = completedAt <= dueDate;

                    return (
                        <Chip
                            label={onTime ? "Sim" : "Não"}
                            color={onTime ? "success" : "error"}
                            size="small"
                        />
                    );
                }
            },
        },
    ];

    function onRowDoubleClick(params: ConclusionRateData) {
        setDetailOpen(true);
        setDetailMetric(params);
        console.log(params.recorded_time.map((a) => a.user));
    }

    function getTimeSpendAtTask(date_start: Date | string, date_end: Date | string): string {
        if (!date_start || !date_end) return "-";

        const start = dayjs(date_start);
        const end = dayjs(date_end);

        const diff = end.diff(start);

        if (diff < 0) return "00:00:00";

        return dayjs.duration(diff).format('HH:mm:ss');
    }

    return (
        <Stack spacing={3}>
            {/* Cards de Resumo */}
            {
                metrics && (
                    <>
                        <Grid container spacing={2} alignItems={"center"} maxHeight={150}>

                            {/* Card: Realizado vs Planeado */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            <EventAvailable fontSize="large" />
                                            <Stack>
                                                <Typography variant="overline" color="text.secondary">Taxa de Conclusão</Typography>
                                                <Typography variant="h4" fontWeight="bold">
                                                    {metrics.summary.rate}%
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Card: Realizado vs Planeado */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            <EventAvailable fontSize="large" />
                                            <Box>
                                                <Typography variant="overline" color="text.secondary">Total Planejado</Typography>
                                                <Typography variant="h4" fontWeight="bold">
                                                    {metrics.summary.total_planned}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Card: Realizado vs Planeado */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            <CheckCircle fontSize="large" color="success" />
                                            <Box>
                                                <Typography variant="overline" color="text.secondary">Total Concluído</Typography>
                                                <Typography variant="h4" fontWeight="bold" color="success.main">
                                                    {metrics.summary.total_completed}
                                                </Typography>
                                            </Box>
                                        </Stack>
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
                                onRowDoubleClick={(e) => onRowDoubleClick(e.row)}
                            />
                        </Box>
                    </>
                )
            }

            <Drawer anchor="right" open={detailOpen} onClose={() => setDetailOpen(false)}>
                <Box sx={{ width: 480, p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6">Detalhes da Tarefa</Typography>
                        <IconButton onClick={() => setDetailOpen(false)}><Close /></IconButton>
                    </Box>

                    {
                        detailMetric &&
                        <Stack gap={2} mt={2}>
                            <Stack>
                                <Typography variant="subtitle2">Título</Typography>
                                <Typography>{detailMetric.title}</Typography>
                            </Stack>

                            <Stack>
                                <Typography variant="subtitle2">Descrição</Typography>
                                <Typography>{detailMetric.description}</Typography>
                            </Stack>

                            <Stack>
                                <Typography variant="subtitle2">Status</Typography>
                                <Typography>{detailMetric.status?.name ?? "-"}</Typography>
                            </Stack>

                            <Stack>
                                <Typography variant="subtitle2">Vencimento</Typography>
                                <Typography>{detailMetric.due_date ? new Date(detailMetric.due_date).toLocaleString() : "-"}</Typography>
                            </Stack>

                            {
                                detailMetric.recorded_time && detailMetric.recorded_time.length > 0 &&
                                <>
                                    <Divider />

                                    <Stack>
                                        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"end"}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>Registros de Tempo</Typography>
                                            <Typography variant="caption">{detailMetric.recorded_time.length}</Typography>
                                        </Stack>

                                        <Stack>
                                            <List dense={true}>
                                                {
                                                    detailMetric.recorded_time.map((record) => {
                                                        return (
                                                            <Box key={record.id}>
                                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                                    <Stack>
                                                                        <Typography variant="subtitle1">{record?.user?.name ?? "-"}</Typography>
                                                                        <Stack direction="row" spacing={1}>
                                                                            <Typography variant="body2">Início:</Typography>
                                                                            <Typography variant="body2">{new Date(record.startedAt).toLocaleString() ?? "-"}</Typography>
                                                                        </Stack>
                                                                        <Stack direction="row" spacing={1}>
                                                                            <Typography variant="body2">Fim:</Typography>
                                                                            <Typography variant="body2">{record.endedAt ? new Date(record?.endedAt).toLocaleString() : "-"}</Typography>
                                                                        </Stack>
                                                                    </Stack>
                                                                    <Typography variant="caption">
                                                                        Tempo Gasto: {getTimeSpendAtTask(record.startedAt, record.endedAt!)}
                                                                    </Typography>
                                                                </Stack>
                                                                {detailMetric.recorded_time.indexOf(record) < detailMetric.recorded_time.length - 1 && <Divider sx={{ my: 1 }} />}
                                                            </Box>
                                                        )
                                                    })
                                                }
                                            </List>
                                        </Stack>
                                    </Stack>
                                </>
                            }

                        </Stack>
                    }
                </Box>
            </Drawer>
        </Stack >
    );
}