import { Backdrop as MuiBackdrop, CircularProgress } from '@mui/material';

interface IBackdrop {
    open: boolean;
    onClose?: () => void;
}

export default function Backdrop({ open, onClose }: IBackdrop) {
    return (
        <MuiBackdrop
            sx={(theme) => ({
                color: '#fff',
                zIndex: theme.zIndex.drawer + 1
            })}
            open={open}
            onClick={onClose}
        >
            <CircularProgress color="inherit" />
        </MuiBackdrop>
    );
}