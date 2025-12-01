import { Backdrop as MuiBackdrop, CircularProgress, Typography, Stack } from '@mui/material';

interface IBackdrop {
    open: boolean;
    message?: string;
}

export default function CTBackdrop(
    {
        open,
        message = "Carregando..."
    }: IBackdrop
) {
    return (
        <MuiBackdrop
            sx={() => ({
                color: '#fff',
                zIndex: 9999,
            })}
            open={open}
        >
            <Stack spacing={2} alignItems="center">
                <CircularProgress color="inherit" size={50} />
                <Typography>{message}</Typography>
            </Stack>
        </MuiBackdrop>
    );
}