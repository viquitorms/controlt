import { Box, Card, CardContent, Typography, IconButton, Stack, Chip } from "@mui/material";
import { Stop, PlayArrow } from "@mui/icons-material";
import { useTimer } from "../../../contexts/Timer.context";

export default function ActiveTimer() {
    const { activeTimer, isTimerActive, elapsedTime, stopTimer } = useTimer();

    if (!isTimerActive) return null;

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const getItemTitle = (): string => {
        if (activeTimer?.task) return activeTimer.task.title;
        if (activeTimer?.item) return activeTimer.item.title;
        return "Timer ativo";
    };

    const handleStop = async () => {
        try {
            await stopTimer();
        } catch (error) {
            console.error("Erro ao parar timer:", error);
        }
    };

    return (
        <Card
            sx={{
                position: "fixed",
                bottom: 16,
                right: 16,
                minWidth: 300,
                zIndex: 1000,
                boxShadow: 3,
            }}
        >
            <CardContent>
                <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <PlayArrow color="success" />
                        <Typography variant="subtitle2" fontWeight="bold">
                            Timer Ativo
                        </Typography>
                        <Chip label="Gravando" color="success" size="small" />
                    </Stack>

                    <Typography variant="body2" color="text.secondary" noWrap>
                        {getItemTitle()}
                    </Typography>

                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="h5" fontWeight="bold" color="primary">
                            {formatTime(elapsedTime)}
                        </Typography>
                        <IconButton color="error" onClick={handleStop} size="small">
                            <Stop />
                        </IconButton>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}