import * as React from 'react';
import MuiSnackbar, { type SnackbarCloseReason } from '@mui/material/Snackbar';

interface ISnackbar {
    open: boolean;
    message: string;
    duration?: number;
    onClose: () => void;
}

export default function Snackbar({ open, message, duration = 6000, onClose }: ISnackbar) {
    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        onClose();
    };

    return (
        <MuiSnackbar
            open={open}
            autoHideDuration={duration}
            onClose={handleClose}
            message={message}
        />
    );
}