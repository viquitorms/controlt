import * as React from 'react';
import MuiSnackbar, { type SnackbarCloseReason } from '@mui/material/Snackbar';
import { Alert, type AlertColor } from '@mui/material';

interface ISnackbar {
    open: boolean;
    message: string;
    duration?: number;
    severity?: AlertColor;
    onClose: () => void;
}

export default function Snackbar({ open, message, duration = 6000, onClose, severity }: ISnackbar) {

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
        <MuiSnackbar open={open} autoHideDuration={duration} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Alert
                onClose={handleClose}
                severity={severity}
                variant='filled'
            >
                {message}
            </Alert>
        </MuiSnackbar>
    );
}